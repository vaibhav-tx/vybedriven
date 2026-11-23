import { useState, useEffect, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Copy,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MessageCircle,
  X,
} from "lucide-react";
import {
  updateTeamRoster,
  removeTeammateFromTeam,
  confirmTeammateInvitation,
  deleteTeamRegistration,
  leaveTeamRegistration,
  findOpportunity,
  isPlatformAdmin,
  mergeRemoteRegistrations,
  getStoredRegistrations,
  type EventRegistration,
  type TeammateDetail,
} from "@/data/events-store";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { IdeaSubmissionModal } from "@/components/IdeaSubmissionModal";

interface TeamManagementModalProps {
  registration: EventRegistration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (updated: EventRegistration) => void;
  onDeleted?: () => void;
}

export function TeamManagementModal({
  registration,
  open,
  onOpenChange,
  onUpdated,
  onDeleted,
}: TeamManagementModalProps) {
  const { user } = useAuth();

  const [teamName, setTeamName] = useState("");
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [lookingForTeammates, setLookingForTeammates] = useState(false);
  const [teammates, setTeammates] = useState<TeammateDetail[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);

  // Leader Delete Team State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmChecked, setDeleteConfirmChecked] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  // Member Leave Team State
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leavingTeam, setLeavingTeam] = useState(false);

  // New member form fields
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCollege, setNewCollege] = useState("");
  const [newDept, setNewDept] = useState("");
  const [newYear, setNewYear] = useState("");

  const [saving, setSaving] = useState(false);

  // Initialize from registration and fetch latest cloud state
  useEffect(() => {
    setShowDeleteConfirm(false);
    setDeleteConfirmChecked(false);
    setShowAddForm(false);

    if (registration) {
      setTeamName(registration.teamName || "My Squad");
      setLookingForTeammates(Boolean(registration.lookingForTeammates));
      const initTeammates = Array.isArray(registration.teammates)
        ? registration.teammates
        : typeof (registration as any).teammates === "string"
        ? (() => {
            try {
              return JSON.parse((registration as any).teammates);
            } catch {
              return [];
            }
          })()
        : [];
      setTeammates(
        (Array.isArray(initTeammates) ? initTeammates : []).map((t) => ({
          ...t,
          status: t.status || "pending",
        }))
      );
    }

    if (open && registration?.id) {
      import("@/integrations/d1/client")
        .then(({ d1Query }) => {
          d1Query("SELECT * FROM registrations WHERE id = ? LIMIT 1", [
            registration.id,
          ])
            .then((rows) => {
              if (rows && rows.length > 0) {
                mergeRemoteRegistrations(rows);
                const fresh = rows[0] as any;
                if (fresh) {
                  setTeamName(fresh.team_name || fresh.teamName || registration.teamName || "My Squad");
                  setLookingForTeammates(Boolean(fresh.looking_for_teammates ?? fresh.lookingForTeammates));
                  let freshTeammates = fresh.teammates;
                  if (typeof freshTeammates === "string" && freshTeammates.trim()) {
                    try {
                      freshTeammates = JSON.parse(freshTeammates);
                    } catch {
                      freshTeammates = [];
                    }
                  }
                  if (!Array.isArray(freshTeammates)) freshTeammates = [];
                  setTeammates(
                    freshTeammates.map((t: any) => ({
                      ...t,
                      status: t?.status || "pending",
                    }))
                  );
                }
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    }
  }, [registration, open]);

  if (!registration) return null;

  const opportunity = findOpportunity(registration.opportunitySlug);
  const isLeader = Boolean(
    user &&
      ((user.id && registration.userId === user.id) ||
        (user.email && registration.email.toLowerCase() === user.email.toLowerCase()))
  );

  const isEventClosed = Boolean(
    opportunity &&
      (opportunity.status === "Event full" || opportunity.status === "Sold out")
  );

  const isTeammate = Boolean(
    user?.email &&
      registration.teammates?.some(
        (t) =>
          typeof t === "object" &&
          t &&
          typeof t.email === "string" &&
          t.email.toLowerCase() === user.email!.toLowerCase()
      )
  );

  const isAdmin = isPlatformAdmin(user);

  // Anyone in the squad (Leader, Members) or Platform Admin can manage & invite teammates!
  const canManageTeam = !isEventClosed && (isLeader || isTeammate || isAdmin);

  const totalMembers = 1 + teammates.length;
  const maxMembers = 4;
  const remainingSlots = Math.max(0, maxMembers - totalMembers);

  // Add Member to local list
  const handleAddMember = (e: FormEvent) => {
    e.preventDefault();
    if (teammates.length >= 3) {
      toast.error("Maximum 4 members allowed per team.");
      return;
    }
    if (!newName.trim()) {
      toast.error("Please enter teammate's full name.");
      return;
    }
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Please enter a valid teammate email address.");
      return;
    }

    const target = newEmail.trim().toLowerCase();
    const alreadyAdded =
      teammates.some(
        (t) =>
          typeof t === "object" &&
          t &&
          typeof t.email === "string" &&
          t.email.toLowerCase() === target
      ) ||
      (typeof registration.email === "string" &&
        registration.email.toLowerCase() === target);

    if (alreadyAdded) {
      toast.error("A member with this email address is already in the team.");
      return;
    }

    const newTeammate: TeammateDetail = {
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || undefined,
      collegeOrCompany: newCollege.trim() || undefined,
      department: newDept.trim() || undefined,
      graduationYear: newYear.trim() || undefined,
      status: "pending",
      role: "member",
    };

    setTeammates([...teammates, newTeammate]);

    // Reset inputs
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewCollege("");
    setNewDept("");
    setNewYear("");
    setShowAddForm(false);
    toast.success(`${newTeammate.name} added! Click "Save & Update Team Details" below to save.`);
  };

  const handleRemoveMember = async (index: number) => {
    if (!canManageTeam || !isLeader) {
      toast.error("Only the Team Leader can remove members from the squad.");
      return;
    }
    if (isEventClosed) {
      toast.error("Hackathon registration is closed. Team roster has been locked.");
      return;
    }

    const targetMember = teammates[index];
    if (!targetMember) return;
    const memberName = targetMember.name || "Member";
    const memberEmail = targetMember.email || "";

    const updatedTeammates = teammates.filter((_, i) => i !== index);
    setTeammates(updatedTeammates);

    try {
      const updated = await removeTeammateFromTeam(registration.id, memberEmail, user);
      toast.success(`✅ ${memberName} has been removed from the team.`);
      onUpdated?.(updated);
    } catch (err: any) {
      console.warn("Failed to remove member:", err);
      toast.error(err.message || "Failed to remove member from squad.");
    }
  };

  const teamCode = registration.teamCode || registration.id;

  const getTeamInviteLink = () => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://www.vybedriven.in";
    return `${base}/opportunities/${registration.opportunitySlug}?joinCode=${encodeURIComponent(teamCode)}`;
  };

  const handleCopyTeamCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(teamCode);
      toast.success(`📋 Team Code "${teamCode}" copied to clipboard!`);
    } else {
      toast.info(teamCode);
    }
  };

  const handleCopyTeamInviteLink = () => {
    const link = getTeamInviteLink();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      toast.success("🔗 Team invite link copied to clipboard!");
    } else {
      toast.info(link);
    }
  };

  const handleShareTeamOnWhatsApp = () => {
    const link = getTeamInviteLink();
    const msg = encodeURIComponent(
      `🚀 Join my team "${teamName}" for ${registration.opportunityTitle} on Vybe Driven!\n\n` +
      `🔑 Official Team Code: ${teamCode}\n\n` +
      `🔗 Click link to join directly: ${link}\n\n` +
      `Simply sign in, enter our Team Code, and you'll instantly get your verified participant pass! 🎟️`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, "_blank");
  };

  // Generate Invite Link & Mailto
  const getInviteLink = (memberEmail: string) => {
    const base = typeof window !== "undefined" ? window.location.origin : "https://www.vybedriven.in";
    return `${base}/opportunities/${registration.opportunitySlug}?confirmTeam=${registration.id}&email=${encodeURIComponent(
      memberEmail
    )}`;
  };

  const handleCopyInviteLink = (memberEmail: string) => {
    const link = getInviteLink(memberEmail);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link);
      toast.success("📋 Team invitation link copied to clipboard!");
    } else {
      toast.info(link);
    }
  };

  const handleSendEmailInvite = (member: TeammateDetail) => {
    const link = getInviteLink(member.email);
    const subject = encodeURIComponent(`Invitation to join Team "${teamName}" for ${registration.opportunityTitle}`);
    const body = encodeURIComponent(
      `Hey ${member.name},\n\n` +
      `You have been invited by ${registration.fullName} to join Team "${teamName}" for ${registration.opportunityTitle} on Vybe Driven!\n\n` +
      `Click the link below to confirm and join the official team roster:\n${link}\n\n` +
      `Once confirmed, your official participant pass will be available in your Vybe Driven builder profile.\n\n` +
      `See you at the hackathon!\n— Team Vybe Driven`
    );
    window.open(`mailto:${member.email}?subject=${subject}&body=${body}`, "_blank");
    toast.success(`Mail client opened to invite ${member.name}!`);
  };

  // Save changes to store and Cloudflare D1
  const handleSaveTeam = async () => {
    if (!canManageTeam) {
      toast.error("Only team members or administrators can modify team details.");
      return;
    }
    if (isEventClosed) {
      toast.error("Hackathon registration is closed. Team roster has been locked.");
      return;
    }
    if (!teamName.trim()) {
      toast.error("Please enter a valid team name.");
      return;
    }

    setSaving(true);
    try {
      const safeTeammates = Array.isArray(teammates) ? teammates : [];
      const teamSummary = safeTeammates
        .map((t) => `${(t.name || "Member").trim()} (${(t.email || "").trim()})`)
        .join(", ");
      const teamSize = `${1 + safeTeammates.length} members`;

      // 1. Direct Cloudflare D1 execution
      const { d1Db } = await import("@/integrations/d1/client");
      await d1Db.updateRegistrationTeam(
        registration.id,
        teamSize,
        teamSummary || null,
        safeTeammates,
        teamName.trim(),
        lookingForTeammates
      ).catch((err) => {
        console.warn("[Cloud Save Team] D1 query note:", err);
      });

      // 2. Direct local store update with fallback to prevent "Registration not found"
      const updated = updateTeamRoster(
        registration.id,
        {
          teamName: teamName.trim(),
          teammates: safeTeammates,
          lookingForTeammates,
        },
        user,
        registration
      );

      toast.success("✅ Team details successfully updated and saved!");
      onUpdated?.(updated);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update team details.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Squad (Team Leader only)
  const handleDeleteTeam = async () => {
    if (!deleteConfirmChecked) {
      toast.error("Please tick the confirmation checkbox to delete the team.");
      return;
    }
    setDeletingTeam(true);
    try {
      await deleteTeamRegistration(registration.id, user);
      toast.success("Squad deleted successfully! You can now re-register or join another team.");
      onDeleted?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete squad.");
    } finally {
      setDeletingTeam(false);
    }
  };

  // Leave Squad (Teammate only)
  const handleLeaveTeam = async () => {
    if (!user) {
      toast.error("Please sign in to leave the squad.");
      return;
    }
    setLeavingTeam(true);
    try {
      await leaveTeamRegistration(registration.id, user);
      toast.success(`You have successfully left Team "${teamName}".`);
      onDeleted?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to leave squad.");
    } finally {
      setLeavingTeam(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-24px)] sm:w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-[#070e0a] p-4 sm:p-6 text-foreground shadow-2xl rounded-2xl sm:rounded-3xl no-scrollbar box-border">
        <DialogHeader className="border-b border-border/70 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neon">
                <Users className="size-4" /> Team Management &amp; Roster Hub
              </div>
              <DialogTitle className="mt-1 text-xl sm:text-2xl font-black text-foreground">
                {registration.opportunityTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Manage your team roster, invite friends, and track member confirmations in real-time.
              </DialogDescription>
            </div>

            {/* Lock / Open Badge */}
            <div className="self-start sm:self-auto">
              {isEventClosed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-xs font-bold text-red-400">
                  🔒 Roster Locked (Event Closed)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neon/50 bg-neon/15 px-3 py-1 text-xs font-bold text-neon shadow-glow-soft">
                  <CheckCircle2 className="size-3.5" /> Editable until Deadline
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Team Name Header Card */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Team Name
              </span>
              {editingTeamName && canManageTeam ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="rounded-lg border border-neon bg-background px-3 py-1.5 text-base font-bold text-foreground outline-none focus:ring-2 focus:ring-neon"
                    placeholder="Enter team name"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => setEditingTeamName(false)}
                    className="rounded-lg bg-neon text-black text-xs font-bold px-3"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {teamName}
                  </h3>
                  {canManageTeam && (
                    <button
                      type="button"
                      onClick={() => setEditingTeamName(true)}
                      className="rounded-full p-1 text-muted-foreground hover:bg-surface-2 hover:text-neon transition"
                      title="Edit Team Name"
                    >
                      <Edit2 className="size-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Teammates Counter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-semibold">
                <span className="text-muted-foreground">Teammates: </span>
                <span className="font-bold text-foreground">
                  ({totalMembers}/{maxMembers})
                </span>
              </div>
            </div>
          </div>

          {/* Team Code & Direct Share Box */}
          <div className="rounded-2xl border-2 border-neon/40 bg-gradient-to-br from-neon/15 via-emerald-950/30 to-black p-4 sm:p-5 shadow-glow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-neon flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Official Team Code
                </span>
                <div className="mt-1 flex items-center gap-2.5">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-foreground tracking-wider bg-black/70 px-3.5 py-1 rounded-xl border border-neon/50 shadow-inner select-all">
                    {teamCode}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCopyTeamCode}
                    className="rounded-full bg-neon text-black font-extrabold text-xs shadow-glow hover:brightness-110 h-8 px-3 cursor-pointer"
                  >
                    <Copy className="size-3.5 mr-1" /> Copy Code
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-1 sm:pt-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleCopyTeamInviteLink}
                  className="rounded-full border-neon/40 text-xs font-bold text-neon hover:bg-neon hover:text-black h-8 px-3.5 cursor-pointer"
                >
                  <Copy className="size-3.5 mr-1" /> Copy Link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleShareTeamOnWhatsApp}
                  className="rounded-full bg-[#25D366] text-white font-extrabold text-xs hover:brightness-110 shadow-sm h-8 px-3.5 cursor-pointer"
                >
                  <MessageCircle className="size-3.5 mr-1" /> WhatsApp Invite
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/40">
              Share this code or link with your teammates. They will sign in, enter this code, and instantly appear on your roster with verified passes!
            </p>
          </div>

          {/* Members Roster List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>TEAM MEMBERS &amp; INVITATIONS</span>
              {remainingSlots > 0 && canManageTeam && (
                <span className="text-neon">You can add {remainingSlots} more member{remainingSlots > 1 ? "s" : ""}</span>
              )}
            </div>

            {/* 1. TEAM LEADER (Always Green & Verified) */}
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 transition shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <span className="grid size-11 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 font-extrabold text-lg border border-emerald-500/40 shrink-0">
                    {(registration.fullName || "L").charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-foreground">
                        {registration.fullName}
                      </h4>
                      <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                        Team Leader
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3 text-emerald-400" /> {registration.email}
                      </span>
                      {registration.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3 text-emerald-400" /> {registration.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Building2 className="size-3 text-emerald-400" /> {registration.collegeOrCompany}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="size-3.5 text-emerald-400" /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* 2. TEAMMATES LIST */}
            {(Array.isArray(teammates) ? teammates : []).map((member, index) => {
              const isVerified = member.status === "verified";
              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 transition shadow-sm ${
                    isVerified
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-amber-500/40 bg-amber-950/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`grid size-11 place-items-center rounded-xl font-extrabold text-lg border shrink-0 ${
                          isVerified
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                            : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        }`}
                      >
                        {(member.name || "M").charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm sm:text-base font-bold text-foreground">
                            {member.name}
                          </h4>
                          <span className="rounded-full bg-surface-2 border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            Member #{index + 2}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" /> {member.email}
                          </span>
                          {member.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3" /> {member.phone}
                            </span>
                          )}
                          {member.collegeOrCompany && (
                            <span className="flex items-center gap-1">
                              <Building2 className="size-3" /> {member.collegeOrCompany}
                            </span>
                          )}
                          {member.department && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="size-3" /> {member.department} ({member.graduationYear || "Grad"})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Leader Controls */}
                    <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="size-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">
                          <Clock className="size-3.5" /> Confirmation Pending
                        </span>
                      )}

                      {/* Action buttons */}
                      {canManageTeam && (
                        <div className="flex items-center gap-1">
                          {!isVerified && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSendEmailInvite(member)}
                                className="rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:border-neon hover:text-neon transition"
                                title="Send / Resend Email Invitation"
                              >
                                <Send className="size-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyInviteLink(member.email)}
                                className="rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:border-neon hover:text-neon transition"
                                title="Copy 1-Click Invite Link"
                              >
                                <Copy className="size-3.5" />
                              </button>
                            </>
                          )}
                          {isLeader && !isEventClosed && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(index)}
                              className="rounded-lg border border-border bg-surface p-1.5 text-muted-foreground hover:border-red-500 hover:text-red-400 transition"
                              title="Remove Member (Leader Only)"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Teammate slots available notice */}
            {canManageTeam && remainingSlots > 0 ? (
              <div className="rounded-2xl border border-border/80 bg-surface/60 p-3.5 sm:p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {remainingSlots} teammate slot{remainingSlots > 1 ? "s" : ""} available.
                  </span>{" "}
                  Share your Official Team Code from above with your friends to join.
                </p>
              </div>
            ) : canManageTeam && remainingSlots === 0 ? (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400">
                🎉 Team Roster Full (4/4 Members Verified)
              </div>
            ) : null}
            {/* Danger Zone: Disband Entire Squad (Team Leader Only) */}
            {isLeader && !isEventClosed && (
              <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-400">
                      <Trash2 className="size-3.5" /> Danger Zone · Disband Squad
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Need to disband this squad? Disbanding will permanently cancel all member passes and free everyone to join or create another team.
                    </p>
                  </div>
                  {!showDeleteConfirm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-red-500/40 text-red-400 hover:bg-red-500/15 hover:text-red-300 text-xs rounded-xl shrink-0 self-start sm:self-auto"
                    >
                      <Trash2 className="size-3.5 mr-1" /> Disband Squad
                    </Button>
                  )}
                </div>

                {showDeleteConfirm && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3.5 space-y-3 text-xs">
                    <p className="text-red-200 leading-relaxed font-medium">
                      ⚠️ Are you sure you want to disband <strong>&quot;{teamName}&quot;</strong>? This will permanently disband this squad, invalidate all member entry passes, and cannot be undone.
                    </p>

                    <label className="flex items-start gap-2.5 cursor-pointer text-foreground select-none bg-red-950/50 p-2.5 rounded-lg border border-red-500/30">
                      <input
                        type="checkbox"
                        checked={deleteConfirmChecked}
                        onChange={(e) => setDeleteConfirmChecked(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-red-500/50 accent-red-500 cursor-pointer"
                      />
                      <span className="text-[11px] leading-tight font-semibold text-red-100">
                        I confirm that I want to permanently disband this squad and cancel all member passes.
                      </span>
                    </label>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmChecked(false);
                        }}
                        className="rounded-xl text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={!deleteConfirmChecked || deletingTeam}
                        onClick={handleDeleteTeam}
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 shadow-glow disabled:opacity-50"
                      >
                        {deletingTeam ? "Disbanding Squad..." : "Permanently Disband Squad"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Member Action: Leave Squad (Teammate only) */}
            {isTeammate && !isLeader && !isEventClosed && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-foreground">Want to leave this squad?</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      You will be removed from &quot;{teamName}&quot; and can join or create another team.
                    </p>
                  </div>
                  {!showLeaveConfirm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLeaveConfirm(true)}
                      className="border-amber-500/40 text-amber-400 hover:bg-amber-500/15 hover:text-amber-300 text-xs rounded-xl shrink-0 self-start sm:self-auto"
                    >
                      Leave Squad
                    </Button>
                  )}
                </div>

                {showLeaveConfirm && (
                  <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-3.5 space-y-3 text-xs">
                    <p className="text-amber-200 leading-relaxed font-medium">
                      Are you sure you want to leave <strong>&quot;{teamName}&quot;</strong>? Your current entry pass will be cancelled, and you will be free to join or create another squad.
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowLeaveConfirm(false)}
                        className="rounded-xl text-xs text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={leavingTeam}
                        onClick={handleLeaveTeam}
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-4 shadow-glow"
                      >
                        {leavingTeam ? "Leaving..." : "Yes, Leave Squad"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quasar Official PPT Format Gate - Unlocked & Accessible to All Squad Members */}
            {(registration?.opportunitySlug === "quasar-5-international-hackathon-2027" || registration?.eventName?.includes("Quasar")) && (
              <div className="rounded-2xl border border-neon/40 bg-neon/10 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Sparkles className="size-4 text-neon shrink-0" />
                    <span className="text-xs font-bold text-foreground">Official Quasar 5.0 PPT Template</span>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                      ✓ Open to All
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Make a copy of the official slides to prepare your presentation deck. Submissions open on 1 Dec 2026.
                  </p>
                </div>
                <a
                  href="https://docs.google.com/presentation/d/1X3Z5uzfAHhiQfyw-xAf06AQpkuWxlw48rU8ZQblrRJ4/edit?slide=id.h1f2b58c52b4784ea_3_75#slide=id.h1f2b58c52b4784ea_3_75"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-neon px-3.5 py-2 text-xs font-black text-black hover:brightness-105 shrink-0"
                >
                  Open PPT Format 📊 ↗
                </a>
              </div>
            )}
          </div>

          {/* Unstop Legend */}
          <div className="flex flex-wrap items-center gap-4 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span>Verified / Joined</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400" />
              <span>Confirmation Pending (Click send mail)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-400" />
              <span>Locked after deadline</span>
            </span>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full text-xs"
            >
              Close
            </Button>

            {canManageTeam && (
              <Button
                type="button"
                disabled={saving}
                onClick={handleSaveTeam}
                className="rounded-full bg-gradient-brand text-primary-foreground font-bold px-6 text-xs shadow-glow hover:brightness-110"
              >
                {saving ? "Saving Changes..." : "Save & Update Team Details"}
              </Button>
            )}
          </div>
        </div>

        <IdeaSubmissionModal
          registration={registration}
          open={ideaModalOpen}
          onOpenChange={setIdeaModalOpen}
          onSubmitted={() => {
            if (registration) {
              const fresh = getStoredRegistrations().find((r) => r.id === registration.id);
              if (fresh && onUpdated) onUpdated(fresh);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}


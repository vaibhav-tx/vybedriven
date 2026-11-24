import { describe, it, expect, beforeEach } from "vitest";
import {
  createHostedOpportunity,
  findOpportunity,
  submitRegistration,
  getRegistrationsBySlug,
  updateRegistrationStatus,
  slugifyTitle,
  isEventOrganizer,
  updateHostedOpportunity,
  getUserRegistrations,
  joinTeamWithCode,
  removeTeammateFromTeam,
} from "@/data/events-store";

describe("Events Store & Vybe Driven Host Hub", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("slugifies titles cleanly", () => {
    expect(slugifyTitle("Mumbai Web3 & AI Hackathon 2026!")).toBe(
      "mumbai-web3-ai-hackathon-2026"
    );
  });

  it("creates a hosted event and retrieves it by slug", () => {
    const hosted = createHostedOpportunity({
      title: "Fintech Innovation Sprint 2026",
      type: "Hackathon",
      tag: "Fintech · Open Banking",
      description: "Build rapid banking and payments prototypes.",
      overview: "Full 24-hour sprint details.",
      date: "Nov 30, 2026",
      location: "BKC, Mumbai",
      format: "In person",
      prize: "₹1,00,000",
      image: "/test.jpg",
      organizer: "Fintech Club",
      organizerId: "alex-uuid-1",
      organizerEmail: "alex@vybedriven.in",
      registrationDeadline: "Nov 25, 2026",
      eligibility: "Open to all",
      teamSize: "1–4 Members",
      fee: "Free",
    });

    expect(hosted.slug).toBe("fintech-innovation-sprint-2026");
    expect(hosted.isHosted).toBe(true);

    const found = findOpportunity("fintech-innovation-sprint-2026");
    expect(found).toBeDefined();
    expect(found?.title).toBe("Fintech Innovation Sprint 2026");
  });

  it("strictly enforces multi-user isolation and authorization", () => {
    const event = createHostedOpportunity({
      title: "Global Builder Sprint",
      type: "Hackathon",
      tag: "AI",
      description: "Exclusive builder hackathon.",
      overview: "Overview",
      date: "Dec 1, 2026",
      location: "Mumbai",
      format: "Online",
      image: "/test.jpg",
      organizer: "Alex",
      organizerId: "alex-user-id",
      organizerEmail: "alex@test.com",
      registrationDeadline: "Nov 28, 2026",
      eligibility: "Students",
      teamSize: "2–4",
      fee: "Free",
    });

    const alexUser = { id: "alex-user-id", email: "alex@test.com" };
    const guestUser = { id: "guest-user-id", email: "guest@test.com" };

    // Alex is the organizer
    expect(isEventOrganizer(event, alexUser)).toBe(true);

    // Guest is NOT the organizer of Alex's event
    expect(isEventOrganizer(event, guestUser)).toBe(false);

    // Anonymous visitor is NOT organizer
    expect(isEventOrganizer(event, null)).toBe(false);

    // Guest cannot edit Alex's event
    expect(() => {
      updateHostedOpportunity(event.slug, { title: "Hacked by Guest" }, guestUser);
    }).toThrow(/Unauthorized/);

    // Alex CAN edit his event
    const updated = updateHostedOpportunity(
      event.slug,
      { title: "Global Builder Sprint 2.0" },
      alexUser
    );
    expect(updated?.title).toBe("Global Builder Sprint 2.0");

    // Built-in directory opportunities (e.g. Hacksprint) must NEVER grant organizer access
    const hacksprint = findOpportunity("hacksprint-3-kahe-coimbatore");
    expect(isEventOrganizer(hacksprint, { email: "hello@goabuilds.com" })).toBe(false);
    expect(isEventOrganizer(hacksprint, alexUser)).toBe(false);

    // Goa Buildathon grants organizer access ONLY to authorized emails
    const goa = findOpportunity("goa-buildathon-2027");
    expect(isEventOrganizer(goa, { email: "hello@goabuilds.com" })).toBe(true);
    expect(isEventOrganizer(goa, { email: "guest@test.com" })).toBe(false);

    // Quasar 5.0 grants organizer access ONLY to Quasar organizers / platform admin
    const quasar = findOpportunity("quasar-5-international-hackathon-2027");
    expect(quasar).toBeDefined();
    expect(isEventOrganizer(quasar, { email: "pandeysatyam2030@gmail.com" })).toBe(true);
    expect(isEventOrganizer(quasar, { email: "vybedriven@gmail.com" })).toBe(true);
    expect(isEventOrganizer(quasar, { email: "quasar@pvppcoe.ac.in" })).toBe(true);
    expect(isEventOrganizer(quasar, { email: "35shanmukhtawde@gmail.com" })).toBe(false);
    expect(isEventOrganizer(quasar, { email: "hello@goabuilds.com" })).toBe(false);
    expect(isEventOrganizer(quasar, { email: "guest@test.com" })).toBe(false);
  });

  it("handles event registration and isolates participant records", () => {
    const reg = submitRegistration({
      opportunitySlug: "fintech-innovation-sprint-2026",
      opportunityTitle: "Fintech Innovation Sprint 2026",
      userId: "guest-user-id",
      fullName: "Guest Builder",
      email: "guest@test.com",
      phone: "+91 99999 88888",
      collegeOrCompany: "IIT Bombay",
      teamType: "team",
      teamName: "CodeNinjas",
      teamSize: "3 members",
    });

    expect(reg.id).toMatch(/^REG-2026-/);
    expect(reg.status).toBe("Registered");

    const quasarReg = submitRegistration({
      opportunitySlug: "quasar-5-international-hackathon-2027",
      opportunityTitle: "Quasar 5.0: 36-Hour International Hackathon",
      fullName: "Quasar Builder",
      email: "quasarbuilder@test.com",
      phone: "+91 91234 56789",
      collegeOrCompany: "PVPPCOE Mumbai",
      teamType: "team",
      teamName: "Galactic Coders",
    });
    expect(quasarReg.id).toMatch(/^QSR5-\d{5}$/);
    expect(quasarReg.teamCode).toMatch(/^QSR5-\d{5}$/);

    // Guest can see their own registration
    const guestRegs = getUserRegistrations("guest-user-id", "guest@test.com");
    expect(guestRegs.length).toBe(1);
    expect(guestRegs[0].email).toBe("guest@test.com");

    // Alex does NOT see Guest's personal registration in his "My Registrations" tab
    const alexRegs = getUserRegistrations("alex-user-id", "alex@test.com");
    expect(alexRegs.length).toBe(0);

    // The event organizer can see all participants registered for that event
    const eventApplicants = getRegistrationsBySlug("fintech-innovation-sprint-2026");
    expect(eventApplicants.length).toBe(1);
    expect(eventApplicants[0].fullName).toBe("Guest Builder");
  });

  it("allows updating registration status by organizer", () => {
    const reg = submitRegistration({
      opportunitySlug: "fintech-innovation-sprint-2026",
      opportunityTitle: "Fintech Innovation Sprint 2026",
      fullName: "Rahul Roy",
      email: "rahul@example.com",
      phone: "+91 99999 77777",
      collegeOrCompany: "VJTI",
      teamType: "solo",
    });

    const updated = updateRegistrationStatus(reg.id, "Shortlisted");
    expect(updated).toBe(true);

    const list = getRegistrationsBySlug("fintech-innovation-sprint-2026");
    const target = list.find((r) => r.id === reg.id);
    expect(target?.status).toBe("Shortlisted");
  });

  it("allows joining team with code and updates roster properly", async () => {
    const leaderReg = submitRegistration({
      opportunitySlug: "goa-buildathon-2027",
      opportunityTitle: "Goa Buildathon 2027",
      fullName: "Lavitra Satam",
      email: "lavitra@example.com",
      phone: "+91 99999 11111",
      collegeOrCompany: "Thakur College",
      teamType: "team",
      teamName: "ABSOLUT",
    });

    const code = leaderReg.teamCode || leaderReg.id;
    expect(code).toBeTruthy();

    const joined = await joinTeamWithCode(code, {
      fullName: "Shubham Sahu",
      email: "shubham@example.com",
      phone: "+91 93725 80326",
      collegeOrCompany: "Thakur engineering college",
      department: "Electronics and computer engineering",
      opportunitySlug: "goa-buildathon-2027",
    });

    expect(joined.teammates?.length).toBe(1);
    expect(joined.teammates?.[0].name).toBe("Shubham Sahu");
    expect(joined.teammates?.[0].email).toBe("shubham@example.com");
    expect(joined.teammates?.[0].status).toBe("verified");

    // Idempotent join check
    const joinedAgain = await joinTeamWithCode(code, {
      fullName: "Shubham Sahu",
      email: "shubham@example.com",
      phone: "+91 93725 80326",
      collegeOrCompany: "Thakur engineering college",
    });
    expect(joinedAgain.teammates?.length).toBe(1);

    // Join 3rd member (Member #3)
    const joinedMember3 = await joinTeamWithCode(code, {
      fullName: "Member Three",
      email: "member3@example.com",
      phone: "+91 93725 80327",
      collegeOrCompany: "Thakur engineering college",
      opportunitySlug: "goa-buildathon-2027",
    });
    expect(joinedMember3.teammates?.length).toBe(2);
    expect(joinedMember3.teamSize).toBe("3 members");

    // Join 4th member (Member #4 - maximum capacity)
    const joinedMember4 = await joinTeamWithCode(code, {
      fullName: "Member Four",
      email: "member4@example.com",
      phone: "+91 93725 80328",
      collegeOrCompany: "Thakur engineering college",
      opportunitySlug: "goa-buildathon-2027",
    });
    expect(joinedMember4.teammates?.length).toBe(3);
    expect(joinedMember4.teamSize).toBe("4 members");
    // Verify all 3 joined teammates are present and none was removed!
    const teammateEmails = joinedMember4.teammates?.map((t) => t.email);
    expect(teammateEmails).toContain("shubham@example.com");
    expect(teammateEmails).toContain("member3@example.com");
    expect(teammateEmails).toContain("member4@example.com");

    // Attempting to join a 5th member should fail
    await expect(
      joinTeamWithCode(code, {
        fullName: "Member Five",
        email: "member5@example.com",
        phone: "+91 93725 80329",
        collegeOrCompany: "Thakur engineering college",
        opportunitySlug: "goa-buildathon-2027",
      })
    ).rejects.toThrow("already full (maximum 4 members allowed)");

    // Leader removes member test
    const afterRemoval = await removeTeammateFromTeam(
      code,
      "shubham@example.com",
      { email: "lavitra@example.com" }
    );
    expect(afterRemoval.teammates?.length).toBe(2);
    expect(afterRemoval.teamSize).toBe("3 members");
  });

  it("supports full 4-member squads for Quasar 5.0 without dropping members", async () => {
    const quasar = findOpportunity("quasar-5-international-hackathon-2027");
    expect(quasar).toBeTruthy();

    const leader = submitRegistration({
      opportunitySlug: "quasar-5-international-hackathon-2027",
      opportunityTitle: quasar!.title,
      fullName: "Krushna Leader",
      email: "krushna.lead@example.com",
      phone: "+91 93132 91418",
      collegeOrCompany: "R. N. G. Patel Institute of Technology",
      teamType: "team",
      teamName: "Bitshift",
    });

    const code = leader.teamCode || leader.id;

    // Add Member 2
    const step2 = await joinTeamWithCode(code, {
      fullName: "Sahil Gandhi",
      email: "sahil@example.com",
      phone: "+91 83200 89964",
      collegeOrCompany: "R. N. G. Patel Institute of Technology",
      opportunitySlug: "quasar-5-international-hackathon-2027",
    });
    expect(step2.teammates?.length).toBe(1);

    // Add Member 3
    const step3 = await joinTeamWithCode(code, {
      fullName: "Kavya Bhandari",
      email: "kavya@example.com",
      phone: "+91 70460 49421",
      collegeOrCompany: "R. N. G. Patel Institute of Technology",
      opportunitySlug: "quasar-5-international-hackathon-2027",
    });
    expect(step3.teammates?.length).toBe(2);
    expect(step3.teammates?.map((t) => t.email)).toEqual(["sahil@example.com", "kavya@example.com"]);

    // Add Member 4
    const step4 = await joinTeamWithCode(code, {
      fullName: "Fourth Member",
      email: "fourth@example.com",
      phone: "+91 98765 43210",
      collegeOrCompany: "R. N. G. Patel Institute of Technology",
      opportunitySlug: "quasar-5-international-hackathon-2027",
    });
    expect(step4.teammates?.length).toBe(3);
    expect(step4.teamSize).toBe("4 members");
    expect(step4.teammates?.map((t) => t.email)).toEqual([
      "sahil@example.com",
      "kavya@example.com",
      "fourth@example.com",
    ]);

    // Member 5 rejected
    await expect(
      joinTeamWithCode(code, {
        fullName: "Fifth Member",
        email: "fifth@example.com",
        phone: "+91 98765 43211",
        collegeOrCompany: "R. N. G. Patel Institute of Technology",
        opportunitySlug: "quasar-5-international-hackathon-2027",
      })
    ).rejects.toThrow("already full (maximum 4 members allowed)");
  });
});


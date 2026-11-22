/**
 * Cloudflare D1 Database Client for Vybe Driven
 * Handles high-concurrency queries without egress limits.
 */

const CF_ACCOUNT_ID =
  process.env["CLOUDFLARE_ACCOUNT_ID"] ||
  process.env["VITE_CLOUDFLARE_ACCOUNT_ID"] ||
  "dfd353579afb6efbf5f3eeb63cec3f1f";

const CF_DB_ID =
  process.env["CLOUDFLARE_D1_DATABASE_ID"] ||
  process.env["VITE_CLOUDFLARE_D1_DATABASE_ID"] ||
  "68d5ad88-bd27-46c5-963f-edc5286847c9";

const CF_TOKEN = process.env["CLOUDFLARE_D1_API_TOKEN"] || "";

export interface D1QueryResult<T = any> {
  results: T[];
  success: boolean;
  meta?: any;
}

function normalizeD1Rows<T = any>(rows: any[]): T[] {
  if (!Array.isArray(rows)) return [];
  return rows.map((r) => {
    if (!r || typeof r !== "object") return r;
    const copy = { ...r };
    if ("teammates" in copy) {
      if (typeof copy.teammates === "string") {
        try {
          copy.teammates = JSON.parse(copy.teammates);
        } catch {
          copy.teammates = [];
        }
      }
      if (!Array.isArray(copy.teammates)) {
        copy.teammates = [];
      }
    }
    if ("skills" in copy && typeof copy.skills === "string") {
      try {
        copy.skills = JSON.parse(copy.skills);
      } catch {}
    }
    if ("interests" in copy && typeof copy.interests === "string") {
      try {
        copy.interests = JSON.parse(copy.interests);
      } catch {}
    }
    return copy as T;
  });
}

const queryCache = new Map<string, { time: number; data: any[] }>();
const CACHE_TTL_MS = 3000; // 3 seconds in-memory deduplication for SELECT queries

export function clearD1QueryCache() {
  queryCache.clear();
}

/**
 * Execute raw SQL query on Cloudflare D1.
 * Auto-detects server vs client environment.
 */
export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") {
    return [];
  }

  const trimmedSql = sql.trim();
  const isSelect = trimmedSql.toUpperCase().startsWith("SELECT");
  const cacheKey = isSelect ? `${trimmedSql}::${JSON.stringify(params)}` : "";

  // If writing or modifying data, clear the read cache immediately so mutations are never stale
  if (!isSelect) {
    queryCache.clear();
  } else {
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
      return cached.data as T[];
    }
  }

  const isServer =
    typeof window === "undefined" ||
    (typeof process !== "undefined" &&
      !!process.versions?.node &&
      (!window.location?.origin ||
        window.location.origin === "null" ||
        !window.location.href?.startsWith("http")));

  if (isServer) {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_DB_ID}/query`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error("[D1 Server Query Error]", res.status, errText);
        return [];
      }
      const data = (await res.json()) as any;
      const normalized = normalizeD1Rows<T>(data.result?.[0]?.results || []);
      if (isSelect) {
        queryCache.set(cacheKey, { time: Date.now(), data: normalized });
      }
      return normalized;
    } catch (err) {
      console.error("[D1 Server Fetch Error]", err);
      return [];
    }
  }

  // Client-side execution via internal API proxy
  try {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "";
    const endpoint = origin ? `${origin}/api/d1` : "/api/d1";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });

    if (!res.ok) {
      console.error("[D1 Client API Error]", res.status);
      return [];
    }

    const data = (await res.json()) as any;
    const normalized = normalizeD1Rows<T>(data.results || []);
    if (isSelect) {
      queryCache.set(cacheKey, { time: Date.now(), data: normalized });
    }
    return normalized;
  } catch (err) {
    console.error("[D1 Client Fetch Error]", err);
    return [];
  }
}

/**
 * D1 High-Level CRUD Helper for Vybe Driven
 */
export const d1Db = {
  async getRegistrations(filter?: { opportunity_slug?: string; email?: string; id?: string }) {
    let sql = "SELECT * FROM registrations WHERE status != 'deleted'";
    const params: any[] = [];
    if (filter?.opportunity_slug) {
      sql += " AND opportunity_slug = ?";
      params.push(filter.opportunity_slug);
    }
    if (filter?.email) {
      sql += " AND email = ?";
      params.push(filter.email);
    }
    if (filter?.id) {
      sql += " AND id = ?";
      params.push(filter.id);
    }
    sql += " ORDER BY created_at DESC";
    return d1Query(sql, params);
  },

  async upsertRegistration(r: any) {
    const sql = `
      INSERT OR REPLACE INTO registrations (
        id, opportunity_slug, opportunity_title, user_id, full_name,
        first_name, last_name, email, phone, gender,
        location, college_or_company, department, user_type, team_type, team_name,
        team_size, team_members, teammates, looking_for_teammates, terms_accepted,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      r.id || "",
      r.opportunity_slug || r.opportunitySlug || "",
      r.opportunity_title || r.opportunityTitle || "",
      r.user_id || r.userId || "",
      r.full_name || r.fullName || "",
      r.first_name || r.firstName || "",
      r.last_name || r.lastName || "",
      r.email || "",
      r.phone || "",
      r.gender || "",
      r.location || "",
      r.college_or_company || r.collegeOrCompany || "",
      r.department || "",
      r.user_type || r.userType || "",
      r.team_type || r.teamType || "",
      r.team_name || r.teamName || "",
      r.team_size || r.teamSize || "",
      typeof r.team_members === "string" ? r.team_members : JSON.stringify(r.team_members || r.teamMembers || null),
      typeof r.teammates === "string" ? r.teammates : JSON.stringify(r.teammates || []),
      r.looking_for_teammates || r.lookingForTeammates ? 1 : 0,
      r.terms_accepted || r.termsAccepted ? 1 : 0,
      r.status || "Registered",
      r.created_at || r.createdAt || new Date().toISOString(),
      r.updated_at || r.updatedAt || new Date().toISOString(),
    ];
    return d1Query(sql, params);
  },

  async updateRegistrationTeam(
    id: string,
    teamSize: string,
    teamMembers: string | null,
    teammates: any[],
    teamName?: string | null,
    lookingForTeammates?: boolean | number
  ) {
    let sql = `
      UPDATE registrations
      SET team_size = ?, team_members = ?, teammates = ?, updated_at = ?
    `;
    const teammatesJson = typeof teammates === "string" ? teammates : JSON.stringify(teammates || []);
    const teamMembersVal = typeof teamMembers === "string" ? teamMembers : JSON.stringify(teamMembers || null);
    const params: any[] = [teamSize, teamMembersVal, teammatesJson, new Date().toISOString()];

    if (teamName !== undefined) {
      sql += `, team_name = ?`;
      params.push(teamName);
    }
    if (lookingForTeammates !== undefined) {
      sql += `, looking_for_teammates = ?`;
      params.push(lookingForTeammates ? 1 : 0);
    }

    sql += ` WHERE id = ?`;
    params.push(id);

    return d1Query(sql, params);
  },

  async deleteRegistration(id: string) {
    const sql = `
      UPDATE registrations
      SET status = 'deleted', opportunity_slug = 'deleted', team_name = '[Deleted Squad]', updated_at = ?
      WHERE id = ?
    `;
    return d1Query(sql, [new Date().toISOString(), id]);
  },

  async getProfile(idOrEmail: string) {
    const sql = "SELECT * FROM profiles WHERE id = ? OR email = ? LIMIT 1";
    const res = await d1Query(sql, [idOrEmail, idOrEmail]);
    return res[0] || null;
  },

  async upsertProfile(p: any) {
    const sql = `
      INSERT OR REPLACE INTO profiles (
        id, display_name, avatar_url, phone, college_or_company,
        bio, headline, location, github_url, linkedin_url,
        website_url, skills, interests, username, email,
        password_hash, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      p.id || "",
      p.display_name || p.displayName || "",
      p.avatar_url || p.avatarUrl || "",
      p.phone || "",
      p.college_or_company || p.collegeOrCompany || "",
      p.bio || "",
      p.headline || "",
      p.location || "",
      p.github_url || p.githubUrl || null,
      p.linkedin_url || p.linkedinUrl || null,
      p.website_url || p.websiteUrl || null,
      typeof p.skills === "string" ? p.skills : JSON.stringify(p.skills || []),
      typeof p.interests === "string" ? p.interests : JSON.stringify(p.interests || []),
      p.username || null,
      p.email || "",
      p.password_hash || p.passwordHash || "",
      p.created_at || p.createdAt || new Date().toISOString(),
      p.updated_at || p.updatedAt || new Date().toISOString(),
    ];
    return d1Query(sql, params);
  },
};

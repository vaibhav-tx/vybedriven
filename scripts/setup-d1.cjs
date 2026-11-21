const fs = require('fs');

const accountId = 'dfd353579afb6efbf5f3eeb63cec3f1f';
const dbId = '68d5ad88-bd27-46c5-963f-edc5286847c9';
const token = process.env.CLOUDFLARE_D1_API_TOKEN || '';

async function createTables() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  
  const statements = [
    `CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY,
      opportunity_slug TEXT,
      opportunity_title TEXT,
      user_id TEXT,
      full_name TEXT,
      first_name TEXT,
      last_name TEXT,
      email TEXT,
      phone TEXT,
      gender TEXT,
      location TEXT,
      college_or_company TEXT,
      user_type TEXT,
      team_type TEXT,
      team_name TEXT,
      team_size TEXT,
      team_members TEXT,
      teammates TEXT,
      looking_for_teammates INTEGER DEFAULT 0,
      terms_accepted INTEGER DEFAULT 1,
      status TEXT,
      created_at TEXT,
      updated_at TEXT
    );`,
    `CREATE INDEX IF NOT EXISTS idx_reg_slug ON registrations(opportunity_slug);`,
    `CREATE INDEX IF NOT EXISTS idx_reg_email ON registrations(email);`,
    `CREATE INDEX IF NOT EXISTS idx_reg_user_id ON registrations(user_id);`,
    `CREATE INDEX IF NOT EXISTS idx_reg_team_name ON registrations(team_name);`,
    `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      display_name TEXT,
      avatar_url TEXT,
      phone TEXT,
      college_or_company TEXT,
      bio TEXT,
      headline TEXT,
      location TEXT,
      github_url TEXT,
      linkedin_url TEXT,
      website_url TEXT,
      skills TEXT,
      interests TEXT,
      username TEXT,
      email TEXT,
      password_hash TEXT,
      created_at TEXT,
      updated_at TEXT
    );`,
    `CREATE INDEX IF NOT EXISTS idx_profile_email ON profiles(email);`
  ];

  for (const s of statements) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql: s })
    });
    const d = await res.json();
    if (!d.success) {
      console.error('Failed on statement:', s, d.errors);
      process.exit(1);
    }
  }
  console.log('Tables and indexes created successfully in Cloudflare D1!');
}

createTables().catch(err => {
  console.error(err);
  process.exit(1);
});

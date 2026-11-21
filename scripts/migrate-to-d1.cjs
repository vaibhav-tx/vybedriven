const fs = require('fs');

const accountId = 'dfd353579afb6efbf5f3eeb63cec3f1f';
const dbId = '68d5ad88-bd27-46c5-963f-edc5286847c9';
const token = process.env.CLOUDFLARE_D1_API_TOKEN || '';

const registrations = require('../supabase_backup_registrations_2026-11-21.json');
const profiles = require('../supabase_backup_profiles_2026-11-21.json');

async function executeQuery(sql, params = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.result?.[0]?.results || [];
}

async function migrate() {
  console.log(`Starting migration to Cloudflare D1...`);
  console.log(`Registrations to import: ${registrations.length}`);
  console.log(`Profiles to import: ${profiles.length}`);

  // 1. Import Registrations in parallel chunks of 10
  const regConcurrency = 10;
  for (let i = 0; i < registrations.length; i += regConcurrency) {
    const chunk = registrations.slice(i, i + regConcurrency);
    await Promise.all(chunk.map(r => {
      const sql = `
        INSERT OR REPLACE INTO registrations (
          id, opportunity_slug, opportunity_title, user_id, full_name,
          first_name, last_name, email, phone, gender,
          location, college_or_company, user_type, team_type, team_name,
          team_size, team_members, teammates, looking_for_teammates, terms_accepted,
          status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        r.id || '',
        r.opportunity_slug || '',
        r.opportunity_title || '',
        r.user_id || '',
        r.full_name || '',
        r.first_name || '',
        r.last_name || '',
        r.email || '',
        r.phone || '',
        r.gender || '',
        r.location || '',
        r.college_or_company || '',
        r.user_type || '',
        r.team_type || '',
        r.team_name || '',
        r.team_size || '',
        typeof r.team_members === 'string' ? r.team_members : JSON.stringify(r.team_members || null),
        typeof r.teammates === 'string' ? r.teammates : JSON.stringify(r.teammates || []),
        r.looking_for_teammates ? 1 : 0,
        r.terms_accepted ? 1 : 0,
        r.status || 'Registered',
        r.created_at || new Date().toISOString(),
        r.updated_at || new Date().toISOString()
      ];
      return executeQuery(sql, params);
    }));
    if ((i + regConcurrency) % 50 === 0 || i + regConcurrency >= registrations.length) {
      console.log(`Registrations imported: ${Math.min(i + regConcurrency, registrations.length)} / ${registrations.length}`);
    }
  }

  // 2. Import Profiles in parallel chunks of 10
  const profileConcurrency = 10;
  for (let i = 0; i < profiles.length; i += profileConcurrency) {
    const chunk = profiles.slice(i, i + profileConcurrency);
    await Promise.all(chunk.map(p => {
      const sql = `
        INSERT OR REPLACE INTO profiles (
          id, display_name, avatar_url, phone, college_or_company,
          bio, headline, location, github_url, linkedin_url,
          website_url, skills, interests, username, email,
          password_hash, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        p.id || '',
        p.display_name || '',
        p.avatar_url || '',
        p.phone || '',
        p.college_or_company || '',
        p.bio || '',
        p.headline || '',
        p.location || '',
        p.github_url || '',
        p.linkedin_url || '',
        p.website_url || '',
        typeof p.skills === 'string' ? p.skills : JSON.stringify(p.skills || []),
        typeof p.interests === 'string' ? p.interests : JSON.stringify(p.interests || []),
        p.username || '',
        p.email || '',
        p.password_hash || '',
        p.created_at || new Date().toISOString(),
        p.updated_at || new Date().toISOString()
      ];
      return executeQuery(sql, params);
    }));
    if ((i + profileConcurrency) % 100 === 0 || i + profileConcurrency >= profiles.length) {
      console.log(`Profiles imported: ${Math.min(i + profileConcurrency, profiles.length)} / ${profiles.length}`);
    }
  }

  // 3. Verify counts in D1
  const regCountRes = await executeQuery('SELECT COUNT(*) as count FROM registrations');
  const profileCountRes = await executeQuery('SELECT COUNT(*) as count FROM profiles');

  console.log('=== VERIFICATION RESULT IN CLOUDFLARE D1 ===');
  console.log('Total Registrations in D1:', regCountRes[0]?.count);
  console.log('Total Profiles in D1:', profileCountRes[0]?.count);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

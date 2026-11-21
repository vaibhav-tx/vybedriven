const accountId = 'dfd353579afb6efbf5f3eeb63cec3f1f';
const dbId = '68d5ad88-bd27-46c5-963f-edc5286847c9';
const token = process.env.CLOUDFLARE_D1_API_TOKEN || '';

async function verifyD1() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;
  
  // 1. Quasar
  const r1 = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: "SELECT id, opportunity_slug, team_name, full_name, email FROM registrations WHERE opportunity_slug LIKE '%quasar%' LIMIT 4" })
  });
  console.log('Quasar rows in D1:', (await r1.json()).result[0].results);

  // 2. Goa
  const r2 = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: "SELECT id, opportunity_slug, team_name, full_name, email FROM registrations WHERE opportunity_slug LIKE '%goa%' LIMIT 3" })
  });
  console.log('Goa rows in D1:', (await r2.json()).result[0].results);

  // 3. Profiles
  const r3 = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: "SELECT id, display_name, email FROM profiles LIMIT 3" })
  });
  console.log('Profiles in D1:', (await r3.json()).result[0].results);
}

verifyD1().catch(console.error);

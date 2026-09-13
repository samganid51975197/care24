import {createClient} from '@libsql/client';
import {readdir,readFile} from 'node:fs/promises';
const url=process.env.CARE24_DATABASE_URL;
if(!url?.startsWith('file:'))throw new Error('Set CARE24_DATABASE_URL to a private file database. Back up existing data before migration.');
const db=createClient({url});
await db.execute('PRAGMA journal_mode=WAL');
await db.execute('CREATE TABLE IF NOT EXISTS care24_migrations(name TEXT PRIMARY KEY, applied_at INTEGER NOT NULL)');
const applied=new Set((await db.execute('SELECT name FROM care24_migrations')).rows.map(r=>r.name));
for(const name of (await readdir('drizzle')).filter(n=>/^\d+.*\.sql$/.test(n)).sort()){
 if(applied.has(name))continue;
 const source=await readFile('drizzle/'+name,'utf8');
 const statements=source.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean);
 await db.batch([...statements,{sql:'INSERT INTO care24_migrations(name,applied_at) VALUES(?,?)',args:[name,Date.now()]}],'write');
 console.log('Applied',name);
}
if(!applied.has('auth-v1')){
 const statements=(await readFile('db/auth.sql','utf8')).split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean);
 for(const table of ['applications','board_posts','care_requests','document_bundles','privacy_consents','care_contracts','submissions']){
  const columns=(await db.execute(`PRAGMA table_info(${table})`)).rows.map(r=>r.name);
  for(const col of ['owner_user_id','hospital_id'])if(!columns.includes(col))statements.push(`ALTER TABLE ${table} ADD COLUMN ${col} TEXT`);
  statements.push(`CREATE INDEX IF NOT EXISTS idx_${table}_owner ON ${table}(owner_user_id)`,`CREATE INDEX IF NOT EXISTS idx_${table}_hospital ON ${table}(hospital_id)`);
 }
 await db.batch([...statements,{sql:'INSERT INTO care24_migrations(name,applied_at) VALUES(?,?)',args:['auth-v1',Date.now()]}],'write');
 console.log('Applied auth-v1');
}
db.close();

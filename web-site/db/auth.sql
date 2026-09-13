CREATE TABLE auth_hospitals(id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE);
--> statement-breakpoint
CREATE TABLE auth_users(id TEXT PRIMARY KEY,username TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password_hash TEXT NOT NULL,requested_role TEXT NOT NULL,requested_hospital TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','hospital','caregiver')),hospital_id TEXT REFERENCES auth_hospitals(id),status TEXT NOT NULL CHECK(status IN ('pending','active','rejected','suspended')),created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE auth_sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES auth_users(id),expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX idx_auth_sessions_user ON auth_sessions(user_id);
--> statement-breakpoint
CREATE INDEX idx_auth_sessions_expiry ON auth_sessions(expires_at);
--> statement-breakpoint
CREATE TABLE auth_limits(key TEXT PRIMARY KEY,window_start INTEGER NOT NULL,count INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE auth_audit(id INTEGER PRIMARY KEY AUTOINCREMENT,actor_id TEXT NOT NULL,target_id TEXT NOT NULL,action TEXT NOT NULL,created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE auth_bootstrap(id INTEGER PRIMARY KEY CHECK(id=1),token_hash TEXT NOT NULL,expires_at INTEGER NOT NULL);

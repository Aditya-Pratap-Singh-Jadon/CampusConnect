# Local database setup and demo

The backend is Express with Mongoose. It already uses `MONGO_URI`; the database name for this demo is `campusconnect`. The frontend is React/Vite. No database connection or seed was run while preparing these files.

## 1. Install and configure

Install MongoDB Shell (`mongosh`) from the [MongoDB Shell download page](https://www.mongodb.com/try/download/shell), then verify in a **terminal**:

```powershell
mongosh --version
```

If using MongoDB Atlas, create a database deployment, create a database user under **Database Access**, allow your machine's IP under **Network Access**, and copy the driver connection URI from **Connect**. Put `/campusconnect` before its query string. For a local MongoDB server, use `mongodb://127.0.0.1:27017/campusconnect`. MongoDB creates the database when the seed first inserts records; selecting it alone does not create it.

If `npm start` reports `querySrv ECONNREFUSED`, Node cannot reach its configured DNS resolver for the Atlas `mongodb+srv://` SRV lookup. Keep the SRV connection string and set `MONGO_DNS_SERVER=1.1.1.1` in `Backend/.env` to use Cloudflare DNS for MongoDB's SRV lookup. Remove this optional setting once your machine's normal DNS resolver works. Keep `/campusconnect` before `?` in `MONGO_URI`; do not put the URI in source control.

In a **terminal** from the repository root:

```powershell
if (-not (Test-Path Backend/.env)) { Copy-Item Backend/.env.example Backend/.env }
if (-not (Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
```

Edit `Backend/.env` and `frontend/.env` locally. These files are ignored by Git. Fill in:

| Variable | Where | Value and source |
|---|---|---|
| `MONGO_URI` | `Backend/.env` | Your Atlas or local MongoDB URI, selecting `campusconnect`; obtain from Atlas **Connect** or your local server. |
| `MONGO_DNS_SERVER` | `Backend/.env` | Optional DNS server IP for Atlas SRV lookups if Node's default resolver refuses them; `1.1.1.1` worked on this machine. |
| `JWT_SECRET` | `Backend/.env` | A private random string. Generate in a terminal with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. |
| `PORT` | `Backend/.env` | Optional; defaults to `5000`. |
| `GOOGLE_CLIENT_ID` | `Backend/.env` | Needed for Google sign-in; obtain an OAuth web client ID in Google Cloud Console. |
| `VITE_GOOGLE_CLIENT_ID` | `frontend/.env` | The same public Google OAuth client ID. |
| `EMAIL_USER`, `EMAIL_PASS` | `Backend/.env` | Needed for manual signup OTP email. Use a Gmail address and its Google Account app password. Do not use your normal account password. |
| `VITE_API_URL` | `frontend/.env` | Backend origin, normally `http://localhost:5000`. |

`MONGO_URI` and `JWT_SECRET` are mandatory for backend startup. Google OAuth and email values are needed only for those respective login flows. Do not put secrets in `VITE_` variables; Vite exposes them to browsers. Seeded users have no password and are demo profiles for discovery and queries, not login accounts. All names are fictional and `isVerified` is false.

## 2. Start the app

In one **terminal**:

```powershell
cd Backend
npm install
npm start
```

In another **terminal**:

```powershell
cd frontend
npm install
npm run dev
```

The backend checks mandatory variables before connecting and listens only after a successful MongoDB connection. The frontend uses `VITE_API_URL` for API calls.

## 3. Validate, then seed only when authorized

The seed file is `Backend/seed-data/campusconnect-seed.json`. It has fixed ObjectIds and schema fields for users, posts, applications, and connections. The script checks schema validation and references offline:

```powershell
cd Backend
npm run seed:check
```

Once you have provided the URI **and explicitly decided to seed the intended database**, run this **application seed script in a terminal**:

```powershell
npm run seed:demo
```

The script refuses any URI that does not select `campusconnect`. It upserts only its fixed demo IDs, replacing those demo records on repeat runs. It preserves all other records and does not clear collections. A failed run can be retried. Review the target URI before running it; the script writes to that database.

## 4. Connect with MongoDB Shell and verify

In a **terminal**, connect with your own URI (keep the URI private):

```powershell
mongosh "mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER/campusconnect"
```

For a local server, use `mongosh "mongodb://127.0.0.1:27017/campusconnect"`. If your URI does not name the database, select it **inside `mongosh`** with `use campusconnect` before queries. To verify insertion **inside `mongosh`**, run `db.users.countDocuments({})` and `db.posts.countDocuments({})`; the sample alone has 8 users and 4 posts. Then follow the [ten numbered `mongosh` commands](mongodb-shell-demo.md). The output examples there are illustrative, not results from this machine.

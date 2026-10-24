/**
 * Smoke tests for CampusConnect API.
 * Run with backend server already listening on port 5000.
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import configureMongoDns from "../config/mongoDns.js";

dotenv.config();

const API = "http://localhost:5000/api";
const results = [];

async function request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function test(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, error: e.message, status: e.status });
  }
}

let token = "";
let userId = "";
let postId = "";
let secondToken = "";
let secondUserId = "";

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  name: String,
  password: String,
  role: String,
  createdAt: Date,
});
const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema, "otps");

await test("Connect to MongoDB", async () => {
  configureMongoDns();
  await mongoose.connect(process.env.MONGO_URI);
});

await test("GET /users returns array", async () => {
  const users = await request("GET", "/users");
  if (!Array.isArray(users)) throw new Error("Expected array");
});

await test("Manual signup + OTP verify", async () => {
  const email = `smoke${Date.now()}@vitstudent.ac.in`;
  await request("POST", "/auth/manual-signup", {
    name: "Smoke Student",
    email,
    password: "password123",
    role: "student",
  });

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord?.otp) throw new Error("OTP record not created");

  const authData = await request("POST", "/auth/verify-otp", {
    email,
    otp: otpRecord.otp,
  });

  token = authData.token;
  userId = authData.user.id;
  if (!token) throw new Error("Missing token after verify");
});

await test("GET /auth/me", async () => {
  const me = await request("GET", "/auth/me", null, token);
  if (!me.email) throw new Error("Missing email");
});

await test("PUT /users/profile with domain", async () => {
  const updated = await request(
    "PUT",
    "/users/profile",
    { domain: "Frontend", branch: "CSE", year: 2026, skills: ["React"] },
    token,
  );
  if (updated.domain !== "Frontend") throw new Error("Domain not saved");
});

await test("GET /users?role=student&domain=Frontend", async () => {
  const users = await request("GET", "/users?role=student&domain=Frontend");
  if (!Array.isArray(users)) throw new Error("Expected array");
});

await test("POST /posts create", async () => {
  const post = await request(
    "POST",
    "/posts",
    {
      title: "Smoke Test Post",
      category: "collaboration",
      type: "developer",
      description: "Automated test post",
      skillsNeeded: ["React"],
      teamSize: 1,
    },
    token,
  );
  postId = post._id;
  if (!postId) throw new Error("Missing post id");
});

await test("GET /posts/my-posts includes created post", async () => {
  const posts = await request("GET", "/posts/my-posts", null, token);
  if (!posts.some((p) => p._id === postId)) throw new Error("Post not found");
});

await test("GET /posts/:id/applications", async () => {
  const apps = await request("GET", `/posts/${postId}/applications`, null, token);
  if (!Array.isArray(apps)) throw new Error("Expected applications array");
});

await test("Second alumni user signup + verify", async () => {
  const email = `alumni${Date.now()}@vitstudent.ac.in`;
  await request("POST", "/auth/manual-signup", {
    name: "Smoke Alumni",
    email,
    password: "password123",
    role: "alumni",
  });
  const otpRecord = await OTP.findOne({ email });
  const authData = await request("POST", "/auth/verify-otp", {
    email,
    otp: otpRecord.otp,
  });
  secondToken = authData.token;
  secondUserId = authData.user.id;
  if (authData.user.role !== "alumni") throw new Error("Expected alumni role");
});

await test("POST /connections/send", async () => {
  await request("POST", `/connections/send/${secondUserId}`, {}, token);
});

await test("POST /connections/send self blocked", async () => {
  try {
    await request("POST", `/connections/send/${userId}`, {}, token);
    throw new Error("Should not allow self-connection");
  } catch (e) {
    if (e.status !== 400) throw e;
  }
});

await test("POST /posts/:id/apply", async () => {
  await request("POST", `/posts/${postId}/apply`, { message: "Interested" }, secondToken);
});

await test("GET applications after apply", async () => {
  const apps = await request("GET", `/posts/${postId}/applications`, null, token);
  if (apps.length !== 1) throw new Error("Expected one application");
  const appId = apps[0]._id;
  await request(
    "PUT",
    `/posts/${postId}/applications/${appId}`,
    { status: "accepted" },
    token,
  );
});

await test("POST /auth/resend-otp for missing email fails", async () => {
  try {
    await request("POST", "/auth/resend-otp", { email: "missing@vitstudent.ac.in" });
    throw new Error("Should fail");
  } catch (e) {
    if (e.status !== 400) throw e;
  }
});

await mongoose.disconnect();

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok);

console.log(`\nSmoke tests: ${passed}/${results.length} passed\n`);
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} - ${r.name}${r.error ? `: ${r.error}` : ""}`);
}

if (failed.length) process.exit(1);

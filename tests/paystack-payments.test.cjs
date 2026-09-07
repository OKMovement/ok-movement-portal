const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const originalFetch = global.fetch;
const originalEnv = { ...process.env };
afterEach(() => { global.fetch = originalFetch; process.env = { ...originalEnv }; });

function harness() {
  process.env.PAYSTACK_SECRET_KEY = "sk_test_unit-test";
  process.env.FLUTTERWAVE_SECRET_KEY = "FLWSECK_TEST-unit-test-X";
  process.env.FLUTTERWAVE_SECRET_HASH = "flutterwave-webhook-test-hash";
  process.env.APP_BASE_URL = "https://example.com";
  const records = [];
  const pledges = [];
  const providerCalls = [];
  let transaction = null;
  let admin = true;
  let failNextWrite = false;
  const matches = (record, query) => Object.entries(query).every(([key, value]) =>
    value && typeof value === "object" && "$ne" in value ? record[key] !== value.$ne : record[key] === value);

  const DonationModel = {
    async init() {},
    async findOneAndUpdate(query, update) {
      let record = records.find((item) => matches(item, query));
      if (!record) {
        record = { _id: String(records.length + 1), createdAt: new Date(), ...update.$setOnInsert };
        record.save = async () => record;
        records.push(record);
      }
      return record;
    },
    async findOne(query) { return records.find((item) => matches(item, query)) ?? null; },
    async updateOne(query, update) {
      if (failNextWrite) { failNextWrite = false; throw new Error("Database unavailable"); }
      const record = records.find((item) => matches(item, query));
      if (!record) return { modifiedCount: 0 };
      Object.assign(record, update.$set);
      return { modifiedCount: 1 };
    },
    find() { return { sort() { return { lean: async () => records }; } }; },
  };
  const mocks = {
    "@/lib/db": { connectToDatabase: async () => {} },
    "@/lib/models/donation": { DonationModel },
    "@/lib/models/member": { MemberModel: { find() { return { lean: async () => pledges }; } } },
    "@/lib/server/api-auth": { getAdminUserFromRequest: async () => admin ? { id: "admin" } : null },
  };
  const cache = new Map();
  function load(file) {
    file = path.resolve(root, file);
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText;
    const localRequire = (id) => {
      if (mocks[id]) return mocks[id];
      if (id.startsWith("@/")) return load(`src/${id.slice(2)}.ts`);
      if (id.startsWith(".")) return load(path.resolve(path.dirname(file), `${id}.ts`));
      return require(id);
    };
    new Function("require", "module", "exports", source)(localRequire, module, module.exports);
    return module.exports;
  }

  global.fetch = async (url, options) => {
    providerCalls.push({ url, options });
    if (url.startsWith("https://api.flutterwave.com")) {
      assert.equal(options.headers.Authorization, "Bearer FLWSECK_TEST-unit-test-X");
      if (url.endsWith("/payments")) {
        return Response.json({ status: "success", data: {
          link: "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/test-link",
        } });
      }
      if (transaction) return Response.json({ status: "success", data: transaction });
      return Response.json({ status: "error", message: "Transaction not completed" }, { status: 400 });
    }
    assert.equal(options.headers.Authorization, "Bearer sk_test_unit-test");
    if (url.endsWith("/transaction/initialize")) {
      const body = JSON.parse(options.body);
      return Response.json({ status: true, data: {
        authorization_url: "https://checkout.paystack.com/test-access-code",
        access_code: "test-access-code",
        reference: body.reference,
      } });
    }
    if (transaction) return Response.json({ status: true, data: transaction });
    return Response.json({ status: false, message: "Transaction not completed" }, { status: 400 });
  };

  const checkoutRoute = load("app/api/donations/checkout/route.ts");
  const statusRoute = load("app/api/donations/status/route.ts");
  const webhookRoute = load("app/api/donations/paystack/webhook/route.ts");
  const flutterwaveWebhookRoute = load("app/api/donations/flutterwave/webhook/route.ts");
  const adminRoute = load("app/api/admin/donations/route.ts");
  const post = (url, payload, headers = {}) => new Request(`https://example.com${url}`, {
    method: "POST", headers, body: JSON.stringify(payload),
  });
  return {
    records, pledges, providerCalls,
    checkout: (payload) => checkoutRoute.POST(post("/api/donations/checkout", payload)),
    status: (reference) => statusRoute.GET(new Request(`https://example.com/api/donations/status?reference=${reference}&status=success`)),
    webhook: (payload, signature) => {
      const raw = JSON.stringify(payload);
      return webhookRoute.POST(new Request("https://example.com/api/donations/paystack/webhook", {
        method: "POST",
        headers: { "x-paystack-signature": signature ?? createHmac("sha512", "sk_test_unit-test").update(raw).digest("hex") },
        body: raw,
      }));
    },
    flutterwaveWebhook: (payload, hash = "flutterwave-webhook-test-hash") => {
      const raw = JSON.stringify(payload);
      return flutterwaveWebhookRoute.POST(new Request("https://example.com/api/donations/flutterwave/webhook", {
        method: "POST",
        headers: { "verif-hash": hash },
        body: raw,
      }));
    },
    admin: () => adminRoute.GET(new Request("https://example.com/api/admin/donations")),
    setTransaction(value) { transaction = value; },
    setAdmin(value) { admin = value; },
    failNextWrite() { failNextWrite = true; },
  };
}

const payload = {
  checkoutKey: "c5379d41-5a75-430a-b994-b306ccf8bc32",
  provider: "paystack",
  donationAmount: "1,234.56",
  name: "Test Donor",
  email: "donor@example.com",
  phone: "+2348031234567",
  isDiaspora: true,
  country: "UK",
};
const verified = (record, changes = {}) => ({
  id: 9007199254740991,
  status: "success",
  reference: record.reference,
  amount: record.amountSubunit,
  currency: "NGN",
  domain: "test",
  channel: "card",
  paid_at: "2026-09-07T12:00:00.000Z",
  customer: { email: record.email },
  ...changes,
});
const event = (record) => ({ event: "charge.success", data: { reference: record.reference } });
const flutterwavePayload = {
  ...payload,
  checkoutKey: "d6379d41-5a75-430a-b994-b306ccf8bc33",
  provider: "flutterwave",
};
const flutterwaveVerified = (record, changes = {}) => ({
  id: 8123456,
  status: "successful",
  tx_ref: record.reference,
  amount: record.amount,
  currency: "NGN",
  payment_type: "card",
  created_at: "2026-09-07T12:00:00.000Z",
  customer: { email: "payer-can-differ@example.com" },
  ...changes,
});

test("initializes hosted checkout in kobo and reuses the same attempt", async () => {
  const h = harness();
  const response = await h.checkout(payload);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).checkoutUrl, "https://checkout.paystack.com/test-access-code");
  assert.equal(h.records.length, 1);
  const body = JSON.parse(h.providerCalls[0].options.body);
  assert.equal(body.amount, "123456");
  assert.equal(body.currency, "NGN");
  assert.equal(new URL(body.callback_url).origin, "https://example.com");
  assert.equal(new URL(body.callback_url).pathname, "/home/donations/payment");
  assert.equal(body.reference, h.records[0].reference);
  await h.checkout(payload);
  assert.equal(h.providerCalls.length, 1);
  assert.equal(h.records.length, 1);
});

test("rejects invalid amounts, donor details and unsupported providers before initialization", async () => {
  const h = harness();
  for (const donationAmount of ["0", "99", "NaN", "1.234", "100000001"]) {
    assert.equal((await h.checkout({ ...payload, donationAmount })).status, 400);
  }
  for (const changes of [{ provider: "stripe" }, { email: "bad" }, { phone: "123" }, { country: "" }, { isDiaspora: false }]) {
    assert.equal((await h.checkout({ ...payload, ...changes })).status, 400);
  }
  assert.equal(h.records.length, 0);
  assert.equal(h.providerCalls.length, 0);
});

test("initializes Flutterwave hosted checkout and records its verified webhook", async () => {
  const h = harness();
  const response = await h.checkout(flutterwavePayload);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).checkoutUrl, "https://checkout-v2.dev-flutterwave.com/v3/hosted/pay/test-link");
  const body = JSON.parse(h.providerCalls[0].options.body);
  assert.equal(body.amount, 1234.56);
  assert.equal(body.currency, "NGN");
  assert.equal(body.tx_ref, h.records[0].reference);
  assert.equal(new URL(body.redirect_url).pathname, "/home/donations/payment");

  h.setTransaction(flutterwaveVerified(h.records[0]));
  const notification = { event: "charge.completed", data: { tx_ref: h.records[0].reference } };
  assert.equal((await h.flutterwaveWebhook(notification, "wrong")).status, 401);
  assert.equal((await h.flutterwaveWebhook(notification)).status, 200);
  assert.equal(h.records[0].status, "successful");
  assert.equal(h.records[0].transactionId, "8123456");
  const rows = (await (await h.admin()).json()).members;
  assert.equal(rows[0].paymentProvider, "Flutterwave");
});

test("does not record mismatched Flutterwave transactions", async () => {
  const mismatches = [
    { amount: 1234.55 },
    { currency: "USD" },
    { tx_ref: "other-reference" },
  ];
  for (const changes of mismatches) {
    const h = harness();
    await h.checkout(flutterwavePayload);
    h.setTransaction(flutterwaveVerified(h.records[0], changes));
    const notification = { event: "charge.completed", data: { tx_ref: h.records[0].reference } };
    assert.equal((await h.flutterwaveWebhook(notification)).status, 503);
    assert.equal(h.records[0].status, "pending");
  }
});

test("does not trust callback query status without server verification", async () => {
  const h = harness();
  await h.checkout(payload);
  const response = await h.status(h.records[0].reference);
  const result = await response.json();
  assert.equal(result.status, "pending");
  assert.equal(result.email, undefined);
});

test("signed webhook verifies and records a paid donation in the authenticated admin table", async () => {
  const h = harness();
  await h.checkout(payload);
  h.setTransaction(verified(h.records[0]));
  assert.equal((await h.webhook(event(h.records[0]))).status, 200);
  assert.equal((await h.webhook(event(h.records[0]))).status, 200);
  assert.equal(h.records[0].status, "successful");
  assert.equal(h.records[0].transactionId, "9007199254740991");
  assert.equal(h.records[0].channel, "card");
  const rows = (await (await h.admin()).json()).members;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].paymentStatus, "successful");
  assert.equal(rows[0].paymentReference, h.records[0].reference);
  assert.equal(rows[0].donationAmount, 1234.56);
  h.setAdmin(false);
  assert.equal((await h.admin()).status, 401);
});

test("rejects forged webhooks and mismatched verified transactions", async () => {
  const mismatches = [
    { amount: 123455 },
    { currency: "USD" },
    { reference: "other-reference" },
    { domain: "live" },
    { customer: { email: "other@example.com" } },
  ];
  for (const changes of mismatches) {
    const h = harness();
    await h.checkout(payload);
    h.setTransaction(verified(h.records[0], changes));
    assert.equal((await h.webhook(event(h.records[0]), "wrong")).status, 401);
    assert.equal((await h.webhook(event(h.records[0]))).status, 503);
    assert.equal(h.records[0].status, "pending");
  }
});

test("webhook retries after persistence failure and successful records cannot be downgraded", async () => {
  const h = harness();
  await h.checkout(payload);
  h.setTransaction(verified(h.records[0]));
  h.failNextWrite();
  assert.equal((await h.webhook(event(h.records[0]))).status, 503);
  assert.equal(h.records[0].status, "pending");
  assert.equal((await h.webhook(event(h.records[0]))).status, 200);
  h.setTransaction(verified(h.records[0], { status: "failed" }));
  assert.equal((await h.webhook(event(h.records[0]))).status, 200);
  assert.equal(h.records[0].status, "successful");
});

test("separate submissions allow repeat donations", async () => {
  const h = harness();
  await h.checkout(payload);
  await h.checkout({ ...payload, checkoutKey: "294023a3-91f9-454b-aef0-94c1435395ee" });
  assert.equal(h.records.length, 2);
  assert.notEqual(h.records[0].reference, h.records[1].reference);
});

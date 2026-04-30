import nodemailer from "nodemailer";

type SendMailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type MemberWelcomeArgs = {
  name: string;
  email: string;
  engagement: string;
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toEngagementKey(engagement: string) {
  const normalized = engagement.trim().toLowerCase();

  if (normalized.includes("donate")) {
    return "donate" as const;
  }
  if (normalized.includes("organisation") || normalized.includes("organization")) {
    return "volunteer-organisation" as const;
  }
  if (normalized.includes("support group")) {
    return "volunteer-support-group" as const;
  }
  return "volunteer-individual" as const;
}

function getDonorDetails() {
  return {
    bankName: process.env.DONATION_BANK_NAME ?? "OK Movement Campaign Account",
    accountName: process.env.DONATION_ACCOUNT_NAME ?? "OK Movement",
    accountNumber: process.env.DONATION_ACCOUNT_NUMBER ?? "0000000000",
    giftsAddress:
      process.env.DONATION_GIFTS_ADDRESS ??
      "OK Movement Logistics Desk, Abuja, Nigeria (confirm delivery window by reply email)",
    guidance:
      process.env.DONATION_GUIDANCE ??
      "Use your full name and phone number as payment reference so we can issue your receipt quickly.",
  };
}

function getMailerConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM ?? user;

  if (!host || !port || !from) {
    return null;
  }

  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE.toLowerCase() === "true"
    : port === 465;

  return {
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
    from,
  };
}

const config = getMailerConfig();
const transport = config
  ? nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    })
  : null;

export async function sendEmail({ to, subject, html, text }: SendMailArgs) {
  if (!transport || !config) {
    console.info("[mail:disabled]", { to, subject, text });
    return;
  }

  await transport.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
  });
}

export async function sendMemberWelcomeEmail(args: MemberWelcomeArgs) {
  const { name, email, engagement } = args;
  const safeName = escapeHtml(name);
  const safeEngagement = escapeHtml(engagement);
  const engagementKey = toEngagementKey(engagement);
  const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:4200";
  const getInvolvedUrl = `${appBaseUrl.replace(/\/$/, "")}/home/get-involved`;

  const sharedTextBlocks = [
    "What happens next:",
    "1. We have logged your registration details successfully.",
    "2. A coordinator will contact you within 1-2 business days.",
    "3. You will receive onboarding resources and activation updates.",
  ];

  let roleTitle = "Volunteer";
  let roleText = "Thank you for raising your hand to serve with the OK Movement.";
  let roleHtml =
    "<p style=\"margin:0; color:#121212; line-height:1.7;\">Thank you for raising your hand to serve with the OK Movement.</p>";
  let donorTextBlock = "";
  let donorHtmlBlock = "";

  if (engagementKey === "volunteer-organisation") {
    roleTitle = "Organisation Partner";
    roleText =
      "Thank you for registering your organisation. Our partnerships desk will coordinate an alignment call and rollout plan.";
    roleHtml =
      "<p style=\"margin:0; color:#121212; line-height:1.7;\">Thank you for registering your organisation. Our partnerships desk will coordinate an alignment call and rollout plan.</p>";
  } else if (engagementKey === "volunteer-support-group") {
    roleTitle = "Support Group Lead";
    roleText =
      "Thank you for stepping up to build and sustain community support groups. We will share starter guidance and local support contacts.";
    roleHtml =
      "<p style=\"margin:0; color:#121212; line-height:1.7;\">Thank you for stepping up to build and sustain community support groups. We will share starter guidance and local support contacts.</p>";
  } else if (engagementKey === "donate") {
    roleTitle = "Donor";
    roleText =
      "Thank you for choosing to support the movement financially or with materials. Your contribution powers community action on the ground.";
    roleHtml =
      "<p style=\"margin:0; color:#121212; line-height:1.7;\">Thank you for choosing to support the movement financially or with materials. Your contribution powers community action on the ground.</p>";

    const donorDetails = getDonorDetails();
    donorTextBlock = [
      "",
      "Donation Details:",
      `Bank Name: ${donorDetails.bankName}`,
      `Account Name: ${donorDetails.accountName}`,
      `Account Number: ${donorDetails.accountNumber}`,
      `Cash/Gift Drop-off Address: ${donorDetails.giftsAddress}`,
      `Note: ${donorDetails.guidance}`,
    ].join("\n");

    donorHtmlBlock = `
      <div style="margin-top:16px; border:1px solid #e6e6e6; border-radius:12px; background:#fafafa; padding:16px;">
        <p style="margin:0 0 10px; color:#0a7f3f; font-weight:700; font-size:14px; text-transform:uppercase; letter-spacing:0.06em;">Donation Details</p>
        <p style="margin:0 0 6px; color:#121212; line-height:1.6;"><strong>Bank Name:</strong> ${escapeHtml(donorDetails.bankName)}</p>
        <p style="margin:0 0 6px; color:#121212; line-height:1.6;"><strong>Account Name:</strong> ${escapeHtml(donorDetails.accountName)}</p>
        <p style="margin:0 0 6px; color:#121212; line-height:1.6;"><strong>Account Number:</strong> ${escapeHtml(donorDetails.accountNumber)}</p>
        <p style="margin:0 0 6px; color:#121212; line-height:1.6;"><strong>Cash/Gift Drop-off Address:</strong> ${escapeHtml(donorDetails.giftsAddress)}</p>
        <p style="margin:8px 0 0; color:#3e3e3e; line-height:1.6;"><strong>Note:</strong> ${escapeHtml(donorDetails.guidance)}</p>
      </div>
    `;
  }

  const plainText = [
    `Hello ${name},`,
    "",
    "Thank you for registering with the OK Movement.",
    `Registration Type: ${engagement}`,
    "",
    roleText,
    "",
    ...sharedTextBlocks,
    donorTextBlock,
    "",
    `You can also visit: ${getInvolvedUrl}`,
    "",
    "For updates or corrections, simply reply to this email.",
    "",
    "- OK Movement Team",
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  await sendEmail({
    to: email,
    subject:
      engagementKey === "donate"
        ? "OK Movement Donation Registration Confirmed"
        : "Welcome to OK Movement - Registration Confirmed",
    text: plainText,
    html: `
      <div style="margin:0; padding:24px 12px; background:#f2f4f3; font-family:Arial, Helvetica, sans-serif; color:#121212;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e8ece9; border-radius:14px; overflow:hidden;">
          <div style="padding:20px 24px; background:#111111;">
            <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700;">OK Movement</p>
            <h1 style="margin:10px 0 0; color:#ffffff; font-size:24px; line-height:1.25;">Welcome, ${safeName}</h1>
          </div>

          <div style="padding:24px;">
            <p style="margin:0 0 14px; color:#121212; line-height:1.7;">
              Thank you for registering to get involved with the OK Movement.
            </p>

            <div style="margin:0 0 16px; border-left:4px solid #0a7f3f; background:#f7fbf8; padding:12px 14px;">
              <p style="margin:0 0 4px; color:#0a7f3f; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Registration Type</p>
              <p style="margin:0; color:#121212; font-size:15px; font-weight:600;">${safeEngagement}</p>
              <p style="margin:4px 0 0; color:#424242; font-size:13px;">Track: ${escapeHtml(roleTitle)}</p>
            </div>

            ${roleHtml}
            ${donorHtmlBlock}

            <div style="margin-top:18px; border:1px solid #ececec; border-radius:12px; padding:16px;">
              <p style="margin:0 0 10px; color:#111111; font-weight:700;">What happens next</p>
              <ol style="margin:0; padding-left:18px; color:#202020; line-height:1.7;">
                <li>We have logged your registration details successfully.</li>
                <li>A coordinator will contact you within 1-2 business days.</li>
                <li>You will receive onboarding resources and activation updates.</li>
              </ol>
            </div>

            <div style="margin-top:16px; text-align:center;">
              <a href="${escapeHtml(getInvolvedUrl)}" style="display:inline-block; background:#0a7f3f; color:#ffffff; text-decoration:none; padding:11px 18px; border-radius:8px; font-weight:700;">
                Visit Get Involved Page
              </a>
            </div>

            <p style="margin:16px 0 0; color:#5a5a5a; line-height:1.6;">
              Need to update your details? Reply directly to this email and our team will help.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendAdminInviteEmail(args: {
  email: string;
  invitedByName: string;
  temporaryPassword: string;
  signInUrl: string;
}) {
  const { email, invitedByName, temporaryPassword, signInUrl } = args;
  await sendEmail({
    to: email,
    subject: "You have been invited as an OK Movement admin",
    text: `You were invited by ${invitedByName} to join the OK Movement admin dashboard.\n\nEmail: ${email}\nTemporary password: ${temporaryPassword}\nSign in: ${signInUrl}\n\nPlease sign in and change your password immediately.`,
    html: `<p>You were invited by <strong>${invitedByName}</strong> to join the OK Movement admin dashboard.</p><p><strong>Email:</strong> ${email}<br/><strong>Temporary password:</strong> ${temporaryPassword}<br/><strong>Sign in:</strong> <a href="${signInUrl}">${signInUrl}</a></p><p>Please sign in and change your password immediately.</p>`,
  });
}

export async function sendPasswordResetEmail(args: { email: string; resetUrl: string }) {
  const { email, resetUrl } = args;
  await sendEmail({
    to: email,
    subject: "Reset your OK Movement admin password",
    text: `We received a request to reset your admin password.\n\nReset here: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>We received a request to reset your admin password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
}

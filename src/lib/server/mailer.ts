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

type DonationAdminNotificationArgs = {
  adminEmails: string[];
  name: string;
  email: string;
  phone: string;
  engagement: string;
  isDiaspora: boolean;
  country?: string;
  votingState?: string;
  votingLga?: string;
  votingWard?: string;
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
  const engagementKey = toEngagementKey(engagement);
  const appBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:4200";
  const getInvolvedUrl = `${appBaseUrl.replace(/\/$/, "")}/home/get-involved`;
  const firstName = name.trim().split(/\s+/)[0] ?? "Supporter";
  const safeFirstName = escapeHtml(firstName);

  const website = process.env.APP_BASE_URL ?? "https://okmovement.ng";
  const whatsappOrTelegram = process.env.OK_MOVEMENT_WHATSAPP_TELEGRAM ?? "https://wa.me";
  const socials = process.env.OK_MOVEMENT_SOCIAL_HANDLES ?? "@OK2027movement";

  if (engagementKey === "donate") {
    const safeWebsite = escapeHtml(website);
    const safeWhatsappOrTelegram = escapeHtml(whatsappOrTelegram);
    const safeSocials = escapeHtml(socials);

    await sendEmail({
      to: email,
      subject: "Thank You for Supporting the OK Movement",
      text: `Dear ${firstName},

Thank you for your generous donation to the OK Movement. Your support helps us organize, mobilize, and amplify the voices of Nigerians who believe that our country can and will be better.

Every naira you’ve given strengthens our ability to reach more communities, train volunteers, defend votes, and push for the accountable, people-centered leadership that Nigeria deserves. We do not take your trust for granted.

We’ll keep you updated on how your contribution is making an impact, and share concrete ways you can stay involved beyond your donation. Together, we are building a Nigeria that truly works for everyone.

With gratitude,
OK Movement Team
${website} | ${whatsappOrTelegram} | ${socials}`,
      html: `
        <div style="margin:0; padding:24px 12px; background:#f2f4f3; font-family:Arial, Helvetica, sans-serif; color:#121212;">
          <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e8ece9; border-radius:14px; overflow:hidden;">
            <div style="padding:20px 24px; background:#111111;">
              <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700;">OK Movement</p>
              <h1 style="margin:10px 0 0; color:#ffffff; font-size:24px; line-height:1.25;">Thank You for Supporting the OK Movement</h1>
            </div>

            <div style="padding:24px;">
              <p style="margin:0 0 14px; color:#121212; line-height:1.7;">Dear ${safeFirstName},</p>
              <p style="margin:0 0 14px; color:#121212; line-height:1.7;">
                Thank you for your generous donation to the OK Movement. Your support helps us organize, mobilize, and amplify the voices of Nigerians who believe that our country can and will be better.
              </p>
              <p style="margin:0 0 14px; color:#121212; line-height:1.7;">
                Every naira you’ve given strengthens our ability to reach more communities, train volunteers, defend votes, and push for the accountable, people-centered leadership that Nigeria deserves. We do not take your trust for granted.
              </p>
              <p style="margin:0 0 18px; color:#121212; line-height:1.7;">
                We’ll keep you updated on how your contribution is making an impact, and share concrete ways you can stay involved beyond your donation. Together, we are building a Nigeria that truly works for everyone.
              </p>
              <p style="margin:0; color:#333; line-height:1.7;">
                With gratitude,<br/>
                <strong>OK Movement Team</strong><br/>
                <a href="${safeWebsite}" style="color:#0a7f3f; text-decoration:none;">${safeWebsite}</a> |
                <a href="${safeWhatsappOrTelegram}" style="color:#0a7f3f; text-decoration:none;">WhatsApp/Telegram</a> |
                ${safeSocials}
              </p>
            </div>
          </div>
        </div>
      `,
    });
    return;
  }

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
      "Welcome to OK Movement - Registration Confirmed",
    text: plainText,
    html: `
      <div style="margin:0; padding:24px 12px; background:#f2f4f3; font-family:Arial, Helvetica, sans-serif; color:#121212;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e8ece9; border-radius:14px; overflow:hidden;">
          <div style="padding:20px 24px; background:#111111;">
            <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700;">OK Movement</p>
            <h1 style="margin:10px 0 0; color:#ffffff; font-size:24px; line-height:1.25;">Welcome, ${escapeHtml(name)}</h1>
          </div>

          <div style="padding:24px;">
            <p style="margin:0 0 14px; color:#121212; line-height:1.7;">
              Thank you for registering to get involved with the OK Movement.
            </p>

            <div style="margin:0 0 16px; border-left:4px solid #0a7f3f; background:#f7fbf8; padding:12px 14px;">
              <p style="margin:0 0 4px; color:#0a7f3f; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.06em;">Registration Type</p>
              <p style="margin:0; color:#121212; font-size:15px; font-weight:600;">${escapeHtml(engagement)}</p>
              <p style="margin:4px 0 0; color:#424242; font-size:13px;">Track: ${escapeHtml(roleTitle)}</p>
            </div>

            ${roleHtml}

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

export async function sendDonationAdminNotificationEmail(
  args: DonationAdminNotificationArgs,
) {
  const {
    adminEmails,
    name,
    email,
    phone,
    engagement,
    isDiaspora,
    country,
    votingState,
    votingLga,
    votingWard,
  } = args;

  const fallbackRecipients = (process.env.DONATION_ALERT_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const recipients = Array.from(
    new Set(
      [...adminEmails, ...fallbackRecipients]
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean),
    ),
  );

  if (recipients.length === 0) {
    return;
  }

  const locationText = isDiaspora
    ? `Diaspora (${country || "Country not provided"})`
    : `${votingState || "-"} / ${votingLga || "-"} / ${votingWard || "-"}`;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeEngagement = escapeHtml(engagement);
  const safeLocationText = escapeHtml(locationText);

  await Promise.allSettled(
    recipients.map((adminEmail) =>
      sendEmail({
        to: adminEmail,
        subject: "New Donation Submission - OK Movement",
        text: `A new donation submission has been received.

Name: ${name}
Email: ${email}
Phone: ${phone}
Engagement: ${engagement}
Location: ${locationText}`,
        html: `
          <div style="margin:0; padding:24px 12px; background:#f2f4f3; font-family:Arial, Helvetica, sans-serif; color:#121212;">
            <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e8ece9; border-radius:12px; overflow:hidden;">
              <div style="padding:20px 24px; background:#111111;">
                <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700;">OK Movement Admin Alert</p>
                <h1 style="margin:10px 0 0; color:#ffffff; font-size:22px; line-height:1.3;">New Donation Submission</h1>
              </div>
              <div style="padding:24px;">
                <p style="margin:0 0 10px; line-height:1.7;"><strong>Name:</strong> ${safeName}</p>
                <p style="margin:0 0 10px; line-height:1.7;"><strong>Email:</strong> ${safeEmail}</p>
                <p style="margin:0 0 10px; line-height:1.7;"><strong>Phone:</strong> ${safePhone}</p>
                <p style="margin:0 0 10px; line-height:1.7;"><strong>Engagement:</strong> ${safeEngagement}</p>
                <p style="margin:0; line-height:1.7;"><strong>Location:</strong> ${safeLocationText}</p>
              </div>
            </div>
          </div>
        `,
      }),
    ),
  );
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

type EventRegistrationConfirmationArgs = {
  name: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venueOrLink: string;
};

function getFirstName(name: string) {
  const first = name.trim().split(/\s+/)[0] ?? "";
  return first || "Supporter";
}

export async function sendEventRegistrationConfirmationEmail(
  args: EventRegistrationConfirmationArgs,
) {
  const { name, email, eventName, eventDate, eventTime, venueOrLink } = args;
  const firstName = getFirstName(name);

  const website = process.env.APP_BASE_URL ?? "https://okmovement.ng";
  const whatsappOrTelegram = process.env.OK_MOVEMENT_WHATSAPP_TELEGRAM ?? "https://wa.me";
  const socials = process.env.OK_MOVEMENT_SOCIAL_HANDLES ?? "@OK2027movement";

  const safeFirstName = escapeHtml(firstName);
  const safeEventName = escapeHtml(eventName);
  const safeEventDate = escapeHtml(eventDate);
  const safeEventTime = escapeHtml(eventTime);
  const safeVenueOrLink = escapeHtml(venueOrLink);
  const safeWebsite = escapeHtml(website);
  const safeWhatsappOrTelegram = escapeHtml(whatsappOrTelegram);
  const safeSocials = escapeHtml(socials);

  const text = `Dear ${firstName},

Thank you for registering for our upcoming OK Movement event. Your registration has been received and you’re officially on the list.

Event details:
- Event: ${eventName}
- Date: ${eventDate}
- Time: ${eventTime}
- Venue/Link: ${venueOrLink}

Closer to the date, we’ll send you a reminder with any updates you need to know and how you can prepare to participate fully.

Thank you for standing with the OK Movement and for taking concrete steps toward a Nigeria that works for everyone.

OK Movement Team
${website} | ${whatsappOrTelegram} | ${socials}`;

  const html = `
    <div style="margin:0; padding:24px 12px; background:#f2f4f3; font-family:Arial, Helvetica, sans-serif; color:#121212;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e8ece9; border-radius:12px; overflow:hidden;">
        <div style="padding:20px 24px; background:#111111;">
          <p style="margin:0; color:#ffffff; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; font-weight:700;">OK Movement</p>
          <h1 style="margin:10px 0 0; color:#ffffff; font-size:24px; line-height:1.25;">Your Registration Is Confirmed</h1>
        </div>

        <div style="padding:24px;">
          <p style="margin:0 0 12px; line-height:1.7;">Dear ${safeFirstName},</p>
          <p style="margin:0 0 12px; line-height:1.7;">
            Thank you for registering for our upcoming OK Movement event. Your registration has been received and you’re officially on the list.
          </p>

          <div style="margin:0 0 14px; border-left:4px solid #0a7f3f; background:#f7fbf8; padding:12px 14px;">
            <p style="margin:0 0 6px; line-height:1.6;"><strong>Event:</strong> ${safeEventName}</p>
            <p style="margin:0 0 6px; line-height:1.6;"><strong>Date:</strong> ${safeEventDate}</p>
            <p style="margin:0 0 6px; line-height:1.6;"><strong>Time:</strong> ${safeEventTime}</p>
            <p style="margin:0; line-height:1.6;"><strong>Venue/Link:</strong> ${safeVenueOrLink}</p>
          </div>

          <p style="margin:0 0 12px; line-height:1.7;">
            Closer to the date, we’ll send you a reminder with any updates you need to know and how you can prepare to participate fully.
          </p>

          <p style="margin:0 0 16px; line-height:1.7;">
            Thank you for standing with the OK Movement and for taking concrete steps toward a Nigeria that works for everyone.
          </p>

          <p style="margin:0; color:#333; line-height:1.7;">
            <strong>OK Movement Team</strong><br/>
            <a href="${safeWebsite}" style="color:#0a7f3f; text-decoration:none;">${safeWebsite}</a> |
            <a href="${safeWhatsappOrTelegram}" style="color:#0a7f3f; text-decoration:none;">WhatsApp/Telegram</a> |
            ${safeSocials}
          </p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Your Registration Is Confirmed – OK Movement Event",
    text,
    html,
  });
}

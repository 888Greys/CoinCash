type EmailRecipient = {
  email: string;
  name?: string;
};

type SendEmailInput = {
  to: EmailRecipient;
  subject: string;
  htmlContent: string;
  textContent: string;
};

function formatDateTime(value: Date = new Date()) {
  return value.toISOString().replace("T", " ").replace(".000Z", " UTC");
}

async function sendBrevoEmail(input: SendEmailInput) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "CoinCash";

  if (!apiKey || !senderEmail) {
    console.warn("Brevo email not sent: missing BREVO_API_KEY or BREVO_SENDER_EMAIL");
    return { success: false as const, reason: "missing_env" };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: [{ email: input.to.email, name: input.to.name }],
        subject: input.subject,
        htmlContent: input.htmlContent,
        textContent: input.textContent,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Brevo email error:", response.status, responseText);
      return { success: false as const, reason: `brevo_${response.status}` };
    }

    return { success: true as const };
  } catch (error) {
    console.error("Brevo email exception:", error);
    return { success: false as const, reason: "exception" };
  }
}

export async function sendLoginAlertEmail(params: {
  email: string;
  method: "otp" | "password" | "oauth";
  ipAddress?: string | null;
}) {
  const appName = process.env.APP_NAME || "CoinCash";
  const dashboardUrl = process.env.APP_BASE_URL || "https://coincash.app";
  const when = formatDateTime();
  const ipLine = params.ipAddress ? `IP: ${params.ipAddress}` : "IP: unavailable";

  return sendBrevoEmail({
    to: { email: params.email },
    subject: `${appName} Security Alert: New Login`,
    textContent: [
      `${appName} detected a new login to your account.`,
      `Method: ${params.method.toUpperCase()}`,
      `Time: ${when}`,
      ipLine,
      "",
      "If this was not you, secure your account immediately.",
      `Open app: ${dashboardUrl}`,
    ].join("\n"),
    htmlContent: `
      <h2>${appName} Security Alert</h2>
      <p>We detected a new login to your account.</p>
      <ul>
        <li><strong>Method:</strong> ${params.method.toUpperCase()}</li>
        <li><strong>Time:</strong> ${when}</li>
        <li><strong>IP:</strong> ${params.ipAddress ?? "unavailable"}</li>
      </ul>
      <p>If this was not you, secure your account immediately.</p>
      <p><a href="${dashboardUrl}">Open ${appName}</a></p>
    `,
  });
}

export async function sendTransactionAlertEmail(params: {
  email: string;
  title: string;
  summary: string;
  details: Array<{ label: string; value: string }>;
}) {
  const appName = process.env.APP_NAME || "CoinCash";
  const dashboardUrl = process.env.APP_BASE_URL || "https://coincash.app";
  const detailText = params.details.map((d) => `${d.label}: ${d.value}`).join("\n");
  const detailHtml = params.details
    .map((d) => `<li><strong>${d.label}:</strong> ${d.value}</li>`)
    .join("");

  return sendBrevoEmail({
    to: { email: params.email },
    subject: `${appName} ${params.title}`,
    textContent: [
      params.summary,
      "",
      detailText,
      "",
      `Open app: ${dashboardUrl}`,
    ].join("\n"),
    htmlContent: `
      <h2>${params.title}</h2>
      <p>${params.summary}</p>
      <ul>${detailHtml}</ul>
      <p><a href="${dashboardUrl}">Open ${appName}</a></p>
    `,
  });
}

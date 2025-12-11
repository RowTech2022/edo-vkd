export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { name, url, commitMessage, state } = req.body;
  
    const TELEGRAM_BOT_TOKEN = "5219056524:AAGEK4M4S7iTilPbmFbkFilSIHeFHjcYSdg";
    const TELEGRAM_CHAT_ID = "-1001587580206";
  
    let message = `🚀 **Vercel Build Notification**\n`;
    message += `📌 Проект: *${name}*\n`;
    message += `🔗 URL: ${url}\n`;
    message += `📄 Commit: ${commitMessage || "No commit message"}\n`;
  
    if (state === "SUCCEEDED") {
      message += `✅ Билд успешно завершен!`;
    } else {
      message += `❌ Билд завершился с ошибкой!`;
    }
  
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" }),
    });
  
    res.status(200).json({ message: "Уведомление отправлено!" });
  }
  
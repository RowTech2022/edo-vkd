const AWS = require("aws-sdk");

const TELEGRAM_BOT_TOKEN = "5219056524:AAGEK4M4S7iTilPbmFbkFilSIHeFHjcYSdg";
const TELEGRAM_CHAT_ID = "-1001587580206";
const BUILD_HOOK_URL = "https://api.netlify.com/build_hooks/67d8ec7ab964eb83698925ae";
const DYNAMODB_TABLE = "NetlifyBuildStatus";
const ERROR_REPEAT_TIMEOUT = 30 * 60 * 1000; // 30 минут

const dynamoDb = new AWS.DynamoDB.DocumentClient(); 

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));

  try {
    let payload = event.body ? JSON.parse(event.body) : {};
    const { state = "unknown", error_message = "No error message provided", name } = payload;
    
    const app_name = name || "Empty front proj"; // Используем имя приложения или дефолтное значение

    const previousStateData = await getPreviousBuildState();
    const previousState = previousStateData ? previousStateData.state : null;
    const previousError = previousStateData ? previousStateData.error_message : null;
    const previousTimestamp = previousStateData ? previousStateData.timestamp : 0;
    const currentTimestamp = Date.now();

    if (
      previousState === state &&
      previousError === error_message &&
      currentTimestamp - previousTimestamp < ERROR_REPEAT_TIMEOUT
    ) {
      console.log("No state or error message change, skipping notification.");
      return { statusCode: 200, body: JSON.stringify({ message: "No new state or error message change." }) };
    }

    let message;
    if (state === "success" || state === "ready") {
      message = `✅ Сборка приложения *${app_name}* на Netlify успешно завершена!`;
    } else if (state === "error") {
      message = `❌ Ошибка сборки приложения *${app_name}* на Netlify:\n${error_message}`;
    } else {
      message = `ℹ️ Статус сборки *${app_name}*: ${state}`;
    }

    await sendTelegramNotification(message);
    await updateBuildState(state, error_message, currentTimestamp);

    return { statusCode: 200, body: JSON.stringify({ message: "Уведомление отправлено!" }) };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

async function getPreviousBuildState() {
  try {
    const params = {
      TableName: DYNAMODB_TABLE,
      Key: { id: "latestBuildStatus" },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item ? result.Item : null;
  } catch (error) {
    console.error("Error fetching previous build state:", error);
    return null;
  }
}

async function updateBuildState(state, error_message, timestamp) {
  try {
    const params = {
      TableName: DYNAMODB_TABLE,
      Item: { id: "latestBuildStatus", state, error_message, timestamp },
    };
    await dynamoDb.put(params).promise();
  } catch (error) {
    console.error("Error updating build state:", error);
  }
}

async function sendTelegramNotification(message) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: "Markdown" }),
    });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

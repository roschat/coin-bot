const {
  RoschatBot,
  BOT_MESSAGE_EVENT,
  BOT_BUTTON_EVENT,
} = require("roschat-bot-js-sdk");

const config =
  process.env.NODE_ENV === "production"
    ? {
        baseUrl: process.env.BASE_URL,
        name: process.env.NAME,
        token: process.env.TOKEN,
      }
    : require("./config.json");

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const bot = new RoschatBot(config);

bot
  .start()
  .then((res) => {
    console.log(`Бот ${config.name} успешно инициализирован!`);
    bot.on(BOT_MESSAGE_EVENT, onBotMessageEvent);
    bot.on(BOT_BUTTON_EVENT, onBotButtonEvent);
  })
  .catch((error) => {
    console.log(error);
  });

function onBotButtonEvent({ cid, callbackData }) {
  switch (callbackData) {
    case "coin":
      onCoin(cid);
      break;
    case "random":
      onRandom(cid);
      break;
  }
}

/**
 * Приводит сообщения от бота к одному виду
 * @param {string} dataType
 * @param {any} data
 * @returns {{type: 'text' | 'data', text?: string}}
 */
function unpackBotMessage(dataType, data) {
  if (dataType === "text") {
    return {
      type: "text",
      text: data,
    };
  } else {
    return JSON.parse(data);
  }
}

function onBotMessageEvent({ data, dataType, cid, id }) {
  if (dataType === "unstored") {
    return;
  }
  bot.sendMessageReceived({ id });
  bot.sendMessageWatched({ id });

  const unpacked = unpackBotMessage(dataType, data);
  if (!unpacked.text) {
    bot.sendMessage({ cid }, "Я поддерживаю только текстовые команды.");
    return;
  }

  switch (unpacked.text) {
    case "/start":
      bot.sendMessage(
        { cid },
        `Доступные команды:
/coin - возвращает результат подбрасывания монетки (орел или решка)
/random - возвращает случайное число от 1 до 100`
      );
      break;
    case "/coin":
      const { text } = getCoinState();
      bot.sendMessage({ cid }, text);
      break;
    case "/random":
      const { value } = getCoinState();
      bot.sendMessage({ cid }, value.toString());
      break;
    case "/keyboard":
      onKeyboard(cid);
      break;

    default:
      bot.sendMessage({ cid }, "Неизвестная команда!");
  }
}

function onKeyboard(cid, action = "show") {
  const keyboard = [
    [
      {
        text: "Монетка",
        callbackData: "coin",
      },
      {
        text: "Число",
        callbackData: "random",
      },
    ],
  ];
  bot.setBotKeyboard({ cid, keyboard, action }, (result) =>
    console.log(result)
  );
}

function getCoinState() {
  const value = Math.random();
  return {
    value: Math.floor(value * 100),
    text:
      value < 0.5005 && value > 0.4995
        ? "Монетка упала на ребро!"
        : value <= 0.5
        ? "Орел"
        : "Решка",
  };
}

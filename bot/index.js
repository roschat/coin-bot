const { RoschatBot, BOT_MESSAGE_EVENT } = require('roschat-bot-js-sdk')

const config = process.env.NODE_ENV === 'production'
  ? {
    baseUrl: process.env.BASE_URL,
    name: process.env.NAME,
    token: process.env.TOKEN
  }
  : require('./config.json')

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const bot = new RoschatBot(config)

bot.start()
  .then(res => {
    console.log(`Бот ${config.name} успешно инициализирован!`)
    bot.on(BOT_MESSAGE_EVENT, onBotMessageEvent)
  })
  .catch(error => {
    console.log(error)
  })

function onBotMessageEvent ({ data, dataType, cid, id }) {
  if (dataType === 'unstored') {
    return
  }
  bot.sendMessageReceived({ id })
  bot.sendMessageWatched({ id })
  if (dataType === 'text') {
    switch (data) {
      case '/start':
        bot.sendMessage({ cid }, `Доступные команды:
/coin - возвращает результат подбрасывания монетки (орел или решка)
/random - возвращает случайное число от 1 до 100`)
        break
      case '/coin':
        const { text } = getCoinState()
        bot.sendMessage({ cid }, text)
        break
      case '/random':
        const { value } = getCoinState()
        bot.sendMessage({ cid }, value.toString())
        break
      default:
        bot.sendMessage({ cid }, 'Неизвестная команда!')
    }
  }
}

function getCoinState () {
  const value = Math.random()
  return {
    value: Math.floor(value * 100),
    text: (value < 0.5005 && value > 0.4995) ? 'Монетка упала на ребро!' : (value <= 0.5 ? 'Орел' : 'Решка')
  }
}

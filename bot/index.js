const { RoschatBot, BOT_MESSAGE_EVENT } = require('../index')
const config = require('./config.json')

const bot = new RoschatBot({ config })

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
        bot.sendMessage({ cid }, 'Отправьте команду /coin, чтобы получить результат подбрасывания монетки')
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

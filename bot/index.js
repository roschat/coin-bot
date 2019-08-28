const { RoschatBot, BOT_MESSAGE_EVENT } = require('../index')
const config = require('./config.json')

const bot = new RoschatBot({ config })

bot.start()
  .then(res => {
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
        bot.sendMessage({ cid }, getCoinState().text)
        break
      case '/coin+value':
        const { text, value } = getCoinState()
        bot.sendMessage({ cid }, `${text}\nВыпавшее число: ${value}`)
        break
      default:
        bot.sendMessage({ cid }, 'Неизвестная команда!')
    }
  }
}

function getCoinState () {
  const value = Math.random()
  return {
    value,
    text: value <= 0.5 ? 'орел' : 'решка'
  }
}

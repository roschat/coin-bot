const onStart = require('./start')

function onButtonEvent ({ cid, data, dataType, id }, bot) {
  if (dataType === 'unstored') {
    return
  }
  bot.sendMessageReceived({ id })
  bot.sendMessageWatched({ id })
  if (dataType === 'text') {
    switch (data) {
      case '/start':
        onStart({ cid }, bot)
        break
      default:
        bot.sendMessage({ cid }, 'Неизвестная команда!')
    }
  } else {
    bot.sendMessage({ cid }, 'Неизвестная команда!')
  }
}
module.exports = onButtonEvent

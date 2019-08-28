const config = require('../../config.json')
const { homeKeyboard, helloMsg } = config

function onStart ({ cid }, bot) {
  bot.createUser(cid)
  bot.sendMessage({ cid, dataType: 'data' }, JSON.stringify(helloMsg))
  bot.setBotKeyboard({ cid, keyboard: homeKeyboard, action: 'show' })
}

module.exports = onStart

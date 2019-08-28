const config = require('../../config.json')
const homeKeyboard = require('../../config.json').homeKeyboard

const themesText = config.themes.map(theme => theme.text)
const themesAnswers = config.themes
  .map(theme => (
    JSON.stringify(
      {
        type: 'text',
        text: theme.answer,
        keyboard: [
          theme.files
            ? theme.files
              .map(({ text, link }) => ({
                text,
                link: `${config.botConfig.baseUrl}/docs/${link}`
              }))
            : null]
      }
    )
  )
  )

const themesKeyboard = themesText.map((themeText, idx) => {
  return [
    {
      text: themeText,
      callbackData: `themes/${idx}`
    }
  ]
})

function onButtonEvent ({ cid, callbackData, dataType, id }, bot) {
  let user = bot.findUser(cid)

  if (!user) {
    user = bot.createUser(cid)
  }

  function handleDeleteAndShowMessage ({ cid, dataType, data }) {
    const userMsgIdx = bot.users[cid].msgIdx
    if (userMsgIdx) {
      bot.deleteBotMessage({ id: userMsgIdx })
    }
    bot.sendMessage({ cid, dataType }, data, ({ id }) => {
      bot.users[cid].msgIdx = id
    })
  }

  switch (true) {
    case (callbackData === 'themes'): // При запросе тем
      bot.setBotKeyboard({ cid, keyboard: [[{ text: '🔙 Назад', callbackData: 'home' }], ...themesKeyboard], action: 'show' })
      break
    case (/^themes\//.test(callbackData)): // При выборе определенной темы
      const idx = callbackData.split('/')[1]
      handleDeleteAndShowMessage({ cid, dataType: 'data', data: themesAnswers[idx] })
      break
    case (callbackData === 'contacts'):
      handleDeleteAndShowMessage(
        {
          cid,
          data: `@[542:Федулина Ирина Владимировна] 

Руководитель направления по управлению персоналом 
и административной работе АО «Информтехника и Связь» 

Тел.: +7(495) 662-7321 доб. 5440, 3440 
Моб. +7(926) 245-4781 
fedulina.iv@infotek.ru www.minicom.ru`
        }
      )
      break
    case (callbackData === 'about'):
      handleDeleteAndShowMessage(
        {
          cid,
          data: `Бот "Вопрос-ответ" поможет сотрудникам компании:
 - в различных производственных вопросах,
 - адаптации на новом месте и т.д.`
        }
      )
      break
    case (callbackData === 'home'):
      bot.setBotKeyboard({ cid, keyboard: homeKeyboard, action: 'show' })
  }
}
module.exports = onButtonEvent

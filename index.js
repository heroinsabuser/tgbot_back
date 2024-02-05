const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "6737638099:AAFcs2SnktPjfwoZIWl3YFTRHJgDjEeQlF0";
const webAppUrl = "https://grand-torrone-8db735.netlify.app/";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    await bot.sendMessage(chatId, "Кнопка снизу", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
    await bot.sendMessage(chatId, "Залетай", {
      reply_markup: {
        keyboard: [
          [{ text: "Заполнить форму", web_app: { url: webAppUrl + "form" } }],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, "Spasibo");
      await bot.sendMessage(chatId, "Страна: " + data?.country);
      await bot.sendMessage(chatId, "Улица: " + data?.street);
      setTimeout(async () => {
        await bot.sendMessage(chatId, "Все уловил, жди ментов");
      }, 2000);
    } catch (e) {
      console.log(e);
    }
  }
});
app.post('/web-data', async(req,res)=>{
  const {queryId, products, totalPrice} = req.body;
  try {
    await bot.answerWebAppQuery(queryId,{
      type:'article',
      id:queryId,
      title:'Успешная покупка',
      input_message_content:{message_text:'Товар на сумму' + totalPrice}
    })
    return res.status(200).json({})
  } catch (e) {
    await bot.answerWebAppQuery(queryId,{
      type:'article',
      id:queryId,
      title:'Не удалось лох',
      input_message_content:{message_text:'Не удалось лох'}
    })
    return res.status(500).json({})
  }
})
const PORT = 8000;
app.listen(PORT, ()=>console.log('server started on PORT'+ PORT))
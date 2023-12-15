const TelegramBot = require("node-telegram-bot-api");

const { gameOptions, againOptions } = require("./options");

// const token = "5233250692:AAHJGzjt9JCdkxtHpvKhWm36ZKW5sHOc4yE";
const token = "6668772112:AAFy3ji3xJCY3UYQVJmHNxZ6lHwFrUTfZdw";

const bot = new TelegramBot(token, { polling: true });

const obj = {};

const startGame = async (chatId) => {
  await bot.sendSticker(chatId, "./images/game-removebg-preview.png");

  await bot.sendMessage(
    chatId,
    `O'yinimiz sharti shundan iboratki, Kompyuter 0️⃣ dan 9️⃣ gacha son o'yladi,Siz shu sonni topishga harakat qiling `
  );
  const randomNumber = Math.floor(Math.random() * 10); // 0 da 9 gacha son chaqiradi
  obj[chatId] = randomNumber;
  await bot.sendMessage(chatId, "To'g'ri sonni toping ⬇", gameOptions);
};

const bootstrap = () => {
  bot.setMyCommands([
    {
      command: "/start",
      description: "Botni qayta ishga tushirish🔁",
    },
    {
      command: "/info",
      description: "O'zingiz haqida ma'lumot💡",
    },
    {
      command: "/game",
      description: "O'yin Boshlash🎮",
    },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    console.log(msg);
    const chatId = msg.chat.id;
    if (text === "/start") {
      await bot.sendSticker(chatId, "./images/4712109.png");
      return bot.sendMessage(
        chatId,
        `Assalomu Alaykum Hurmatli ➡${msg.from?.first_name}⬅Sizni ushbu botimizda ko'rib turganimizdan hursandmiz✅`
      );
    }
    if (text === "/info") {
      await bot.sendSticker(chatId, "./images/4712029.png");
      return bot.sendMessage(
        chatId,
        `Sizning telegram UserName ${msg.from?.username}, Sizning Ismingiz ${msg.from?.first_name}, Familiyangiz ${msg.from?.last_name}, va Sizning Id esa ${msg.from?.id}✅:`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    await bot.sendSticker(chatId, "./images/error.webp");
    bot.sendMessage(
      chatId,
      `Uzr xatolik ❌ bo'ldi Hurmatli ${msg.from?.first_name}✅`
    );
  });

  bot.on("callback_query", async (msg) => {
    console.log(msg);
    const data = msg.data;
    const chatId = msg.message.chat.id;

    // bot.on("callback_query", async (callback_query) => {
    //   console.log(callback_query);
    //   const data = callback_query.data;
    //   const chatId = callback_query.message.chat.id;

    if (data === "/again") {
      return startGame(chatId);
    }

    await bot.sendMessage(chatId, `Siz ${data} ni Tanladingiz`);
    if (data == obj[chatId]) {
      await bot.sendSticker(chatId, "./images/salyut.gif");
      await bot.sendMessage(
        chatId,
        `Siz tog'ri javob berdingiz. Kompyuter ${obj[chatId]} sonni tanlagan edi`,
        againOptions
      );
    } else {
      await bot.sendSticker(chatId, "./images/game-over-removebg-preview.png");
      await bot.sendMessage(
        chatId,
        `Siz tanlagan ${data} soni noto'g'ri. Kompyuter ${obj[chatId]} sonini tanlagan edi `,
        againOptions
      );
    }
  });
};

bootstrap();

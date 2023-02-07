require('dotenv').config();
const axios = require("axios");
const {Client, Events, GatewayIntentBits, ActivityType} = require("discord.js")

const textPrefix = "T "
const picturePrefix = "P "

// 設定 Discord 客戶端
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

// 設定 BOT 狀態
client.on(Events.ClientReady, client => {
    // ActivityType.Watching 正在看
    // ActivityType.Listening 正在聽
    // ActivityType.Streaming 正在直播
    // ActivityType.Playing 正在玩
    // ActivityType.Competing 競爭

    //串流直播專屬 不用設定status
    client.user.setActivity('色色的影片', {
        type: ActivityType.Streaming,
        url: "https://www.youtube.com/watch?v=tkYr3nY1WX8"
    });

    client.user.setStatus('online')
    // 'online'  | 'idle' | 'dnd' | 'invisible'
    console.log(`開啟成功 ${client.user.tag}`);
});

// 監聽訊息
client.on(Events.MessageCreate, message => {
    // console.log(message.author.bot) //發送者是否機器人
    // console.log(message.author.id) //發送者唯一ID
    // console.log(message.author.username) //發送者名稱
    // console.log(message.channelId) //發送到哪個頻道
    // console.log(message.content) //發送文字
    // console.log(message.createdTimestamp) //發送時間

    try {
        // 判斷發送者是否為機器人
        if (message.author.bot) return

        //嘴砲營頻道
        if (message.channelId === process.env.DISCORD_CHANNEL) {
            if (message.content.startsWith(textPrefix)) {
                callTextAPI(message)
            } else if (message.content.startsWith(picturePrefix)) {
                callPictureAPI(message)
            }
        }
    } catch (e) {
        console.log(e)
    }
});

client.login(process.env.DISCORD_TOKEN)

function callTextAPI(message) {
    const data = JSON.stringify({
        "model": "text-davinci-003",
        "prompt": message.content.slice(textPrefix.length),
        "max_tokens": 2048,
        "temperature": 0.9,
        "user": message.author.id
    });

    console.log(data)

    axios({
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
            'Authorization': process.env.OPENAPI_KEY,
            'Content-Type': 'application/json'
        },
        data: data
    }).then(function (response) {
        const AIResponse = response.data.choices[0].text
        console.log(AIResponse);

        if (AIResponse.length === 0) {
            message.reply("請再講一次 剛剛我恍神")
        } else {
            message.reply(`${AIResponse}`)
        }
    });
}

function callPictureAPI(message) {
    const data = JSON.stringify({
        "prompt": message.content.slice(picturePrefix.length),
        "n": 1,
        "size": "256x256",
        "user": message.author.id
    });

    console.log(data)

    axios({
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
            'Authorization': process.env.OPENAPI_KEY,
            'Content-Type': 'application/json'
        },
        data: data
    }).then(function (response) {
        const AIResponse = response.data.data[0].url
        console.log(AIResponse);

        if (AIResponse.length === 0) {
            message.reply("請再講一次 剛剛我恍神")
        } else {
            message.reply(`${AIResponse}`)
        }
    }).catch(function (e) {
        message.reply(`文字獄`)
    });
}
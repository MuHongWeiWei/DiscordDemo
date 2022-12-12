const {Client, Events, GatewayIntentBits, ActivityType } = require("discord.js")
const axios = require("axios");
require('dotenv').config();

const textPrefix = "T "
const picturePrefix = "P "

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

// Competing
// Custom
// Listening
// Playing
// Streaming
// Watching

client.on(Events.ClientReady, client => {
    //設定機器人狀態
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
    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    // console.log(message.author.bot) //發送者是否機器人
    // console.log(message.author.id) //發送者唯一ID
    // console.log(message.author.username) //發送者名稱
    // console.log(message.channelId) //發送到哪個頻道
    // console.log(message.content) //發送文字
    // console.log(message.createdTimestamp) //發送時間

    //嘴砲營頻道
    if (message.channelId === process.env.DISCORD_CHANNEL) {
        if (!message.author.bot) {
            if (message.content.startsWith(textPrefix)) {
                callTextAPI(message)
            } else if(message.content.startsWith(picturePrefix)) {
                callPictureAPI(message)
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN)

function callTextAPI(message) {
    const data = JSON.stringify({
        "model": "text-davinci-003",
        "prompt": message.content.slice(textPrefix.length).toString(),
        "max_tokens": 300,
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
        "prompt": message.content.slice(picturePrefix.length).split(" ").toString(),
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
    }).catch(function (exception) {
        console.log(exception)
        message.reply(`文字獄`)
    });
}
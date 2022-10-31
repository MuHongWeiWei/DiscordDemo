const { Client, Events, GatewayIntentBits, ActivityType  } = require("discord.js")
require('dotenv').config();

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
        url: "https://www.youtube.com/watch?v=RvpfVE3fEgY"
    });
    client.user.setStatus('online')
    // 'online'  | 'idle' | 'dnd' | 'invisible'

    console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, message => {
    // const prefix = "/" // 這個是機器人的前綴 (aka 開頭 aka 觸發符號)
    // if (!message.content.startsWith(prefix))
    //     return
    //
    // const args = message.content.slice(prefix.length).split(" ")

    // switch (args[0]) {
    //     case "dice":

    // }
    console.log(message)
    // console.log(message.author.bot) //發送者是否機器人
    // console.log(message.author.id) //發送者唯一ID
    // console.log(message.author.username) //發送者名稱
    // console.log(message.channelId) //發送到哪個頻道
    // console.log(message.content) //發送文字
    // console.log(message.createdTimestamp) //發送時間

    //嘴砲營頻道
    if(message.channelId === '963711657719246878') {
        if (!message.author.bot) {
            message.reply(`${message.author.username} 是在亂三小`)
        }
    }

    if(message.channelId === '951645592675840023') {
        if (!message.author.bot) {
            message.reply(`${message.author.username} 是在亂一小`)
        }
    }
});

client.login(process.env.DISCORD_TOKEN)
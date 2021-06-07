
const express = require('express');
const app = express();

app.get('/', (request, response) => {
     response.sendStatus(200);
});

let listener = app.listen(process.env.PORT, () => {
     console.log('Your app is currently listening on port: ' + listener.address().port);
});

const {Collection, Client, Discord} = require('discord.js');
const fs = require('fs');
const client = new Client({
    disableEveryone: true
})
const config = require('./config.json')
const prefix = config.prefix
const token = config.token
client.commands = new Collection();
const Trello = require('trello')
const trello = new Trello('4bdc68c398ef2e9afa07ad32acf75464', '7cd36bd68ed403f12add986461fc28b9d45a9a2d01f049da0aeb2c4a473529c7');
require('dotenv').config()
client.aliases = new Collection();
const axios = require('axios')
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
client.on('ready', () => {

    let memberCount = 0
  const guildArray = client.guilds.cache.array()
  guildArray.forEach(obj => {
    memberCount = memberCount + obj.memberCount
  })

  client.user.setActivity(`Snowflake Hotels & Resorts`, {
    type: `STREAMING`,
    url: `https://www.twitch.tv/clloudytears`
    
  }).catch(console.error);
    console.log(`${client.user.username} is online!`)
})

client.on('message', async message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) {
         command.run(client, message, args) 
    } else {
       message.reply("No commands found, please execute `s!help` command for all the command list.")
    }
})

client.login(token);

const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)


const listID = process.env.PROFILE_LINKING_LIST_ID
const groupID = process.env.ROBLOX_GROUP_ID
const staffMinRank = process.env.STAFF_MIN_RANK

const Discord = require('discord.js')

module.exports = {
  name: 'viewprofile',
  description: "View your or someone else's profile",
  usage: "[ping (omit if yourself)]",
  run: async (client,message,args) => {
    try {
      const user = message.mentions.users.first() || message.author;
      if (user == null) {
        const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Invalid Arguments')
      .setDescription("Please mention a user. if you are linking yourself, pass your Roblox username only.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }
      const cards = await trello.getCardsOnList(listID);
      const foundCard = cards.find((obj) => {
        return obj.name.split(":")[1] == user.id;
      });
      if (foundCard == null){
        const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, you or the person pinged doesn't seem to be linked.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }
      foundCard.desc = JSON.parse(foundCard.desc);

      const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setTitle(`Profile for ${foundCard.desc.roblox.username}`)
        .addFields(
          { name: "Roblox Username:", value: foundCard.desc.roblox.username },
          { name: "Roblox Id:", value: foundCard.desc.roblox.userId },
          { name: "Rank In Group:", value: foundCard.desc.roblox.Role },
          { name: "Discord tag:", value: foundCard.desc.discord.tag },
          { name: "Discord Id", value: foundCard.desc.discord.id },
          { name: "Sessions", value: foundCard.desc.data.sessions },
          { name: "Strikes", value: foundCard.desc.data.strikes }
        )
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`);
      return message.channel.send(embed);
    } catch (err) {
      const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Oof, an error occurred. Try again and if the problem persists, let the developer know \n \n " + err)
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    }
  }
}
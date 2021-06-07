const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)


const listID = process.env.PROFILE_LINKING_LIST_ID
const groupID = process.env.ROBLOX_GROUP_ID
const staffMinRank = process.env.STAFF_MIN_RANK

const Discord = require('discord.js')


module.exports = {
  name: 'unlink',
  description: 'Unlink your profile.',
  usage: "",
  run: async (client, message, args) => {

        if (!message.member.roles.cache.some(role => ["MR Team", "HR Team", "SHR Team", "Corporate"].includes(role.name))) {
    return message.channel.send({
      embed: {
        color: 16733013,
        title: '❌ Access Denied!',
        description: "You have to be an MR+ to run this command.",
        footer: {
          text: 'Snowflake Hotels & Resorts',
          icon_url: ``
        },
      }
    })
  }
  
    try {
      const cards = await trello.getCardsOnList(listID);
      const foundCard = cards.find((obj) => {
        return obj.name.split(":")[1] == message.author.id;
      });

      if (foundCard == null) {
        const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, you doesn't seem to be linked.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

      await trello.updateCardList(foundCard.shortLink, process.env.PROFILE_UNLINKED_LIST_ID);
      
      const embed = new Discord.MessageEmbed()
      .setColor(3066993)
      .setTitle("Success!")
      .setDescription("You have been unlinked successfully.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)

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
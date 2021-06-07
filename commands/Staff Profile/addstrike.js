const Discord = require('discord.js')

const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

const listID = process.env.PROFILE_LINKING_LIST_ID

module.exports = {
  name: "addstrike",
  description: "Add a strike to a profile.",
  usage: "[ping] [amount]",
  run: async (client, message, args) => {

    if (!message.member.roles.cache.some(role => ["Bot Developer", "Corporate"].includes(role.name))) {
    return message.channel.send({
      embed: {
        color: 16733013,
        title: '❌ Access Denied!',
        description: "You have to be an HR+ to run this command.",
        footer: {
          text: 'Snowflake Hotels & Resorts',
          icon_url: ``
        },
      }
    })
  }
  
    const target = message.mentions.users.first();
    const amount = Number(args[1]);
    if (target == null) {
      const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Invalid Arguments')
      .setDescription("Please mention a user.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    }

    if (target.id == message.author.id) {
      const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle("Error")
      .setDescription("Why are you trying to strike yourself?")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    }
    try {
      const cards = await trello.getCardsOnList(listID);
      const foundCard = cards.find((obj) => {
        return obj.name.split(":")[1] == target.id;
      });

      if (foundCard == null) {
        const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, the person pinged doesn't seem to be linked.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

      foundCard.desc = JSON.parse(foundCard.desc);
      foundCard.desc.data.strikes =
        Number(foundCard.desc.data.strikes) + amount;
      await trello.updateCardDescription(
        foundCard.shortLink,
        JSON.stringify(foundCard.desc)
      );
      
      const embed = new Discord.MessageEmbed()
      .setColor(3066993)
      .setTitle('Success')
      .setDescription("Successfully updated!")
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
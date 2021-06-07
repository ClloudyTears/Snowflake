const Discord = require('discord.js')

const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

const listID = process.env.PROFILE_LINKING_LIST_ID

module.exports = {
  name: 'removesession',
  description: "Remove a session off a profile",
  usage: "[ping (omit if yourself)] [amount]",
  run: async (client, message,args) => {

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
  
    const target = message.mentions.users.first() || message.author;
    const amount = Number(args[1]) || Number(args[0]);
    if (target == null) {
      const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Invalid Arguments')
      .setDescription("Please mention a user.")
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
      .setDescription("Hmm, you or the person pinged doesn't seem to be linked.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }
      foundCard.desc = JSON.parse(foundCard.desc);

      if (foundCard.desc.data.sessions == 0) {
        const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, this profile has no sessions.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

      foundCard.desc.data.sessions =
        Number(foundCard.desc.data.sessions) - amount;

      if (foundCard.desc.data.sessions < 0) {
        foundCard.desc.data.sessions = 0;
        await trello.updateCardDescription(
          foundCard.shortLink,
          JSON.stringify(foundCard.desc)
        );
        const embed = new Discord.MessageEmbed()
      .setColor(3066993)
      .setTitle('Success')
      .setDescription("Updated successfully but to `0`. Otherwise it would be a negative number.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

      await trello.updateCardDescription(
        foundCard.shortLink,
        JSON.stringify(foundCard.desc)
      );
      const embed = new Discord.MessageEmbed()
      .setColor(3066993)
      .setTitle('Success')
      .setDescription("Updated successfully!")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    } catch (err) {
      return message.channel.send("oof error " + err);
    }
  }
}
const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)


const listID = process.env.PROFILE_LINKING_LIST_ID

const Discord = require('discord.js')

module.exports = {
  name: 'points',
  description: "Show the top 10 users who hosted the most sessions!",
  usage: "",
  run: async (client, message, args) => {
    try {
      const cards = await trello.getCardsOnList(listID);
      const sortedCards = cards.sort((a, b) => {
        const aDesc = JSON.parse(a.desc);
        const bDesc = JSON.parse(b.desc);
        return bDesc.data.sessions - aDesc.data.sessions;
      });
      const top10Cards = sortedCards.slice(0, 10);

      const MessageEmbed = new Discord.MessageEmbed()
        .setTitle("Snowflake Session Point Leaderbaord")
        .setDescription(`Here's the top 10 session point that staff have been attended/hosted. Congrats to the person that is on number one for hosting lots of session.`)
        .setColor(3447003);
      top10Cards.forEach((obj, index) => {
        MessageEmbed.addField(
          `${index + 1}. ${JSON.parse(obj.desc).discord.tag}`,
          `Point: ${
            JSON.parse(obj.desc).data.sessions
          }`
        )
        .setFooter('Snowflake Hotels Session Leaderbaord')
      });
      message.reply(MessageEmbed);
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
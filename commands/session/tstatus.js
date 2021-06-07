const Discord = require('discord.js');

const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

module.exports = {
  name: `tstatus`,
	description: 'Edits the status of a training using the SessionID.',
	aliases: [],
	usage: '<SessionId> <newStatus>',
	rolesRequired: ["HR Team", "SHR Team", "Executive"],
	category: 'Session Commands',
	run: async (client, message, args) => {

    const rolesEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('❌ Access Denied!')
    .setDescription('You need to be am HR+ to run this command.')
    .setFooter('System Error')

      if (!message.member.roles.cache.some(role => ["HR Team", "SHR Team", "Corporate"].includes(role.name))) {
    return message.channel.send(rolesEmbed)
  }

  const sessionIDEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setDescription('The SessionID argument is required.')
  .setFooter('System Error')

    const sessionID = args[0]
    if (!sessionID) {
      return message.channel.send(sessionIDEmbed)
    }

    const statusEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setDescription('The new status argument is required.')
    .setFooter('System Error')

    const newStatus = args.slice(1).join(" ")
    if (!newStatus) {
      return message.channel.send(statusEmbed)
    }

    const tcEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setDescription(`An error occurred when getting the channel of the trainings. Please consult the bot owner or try again later.`)
    .setFooter('System Error')

    const trainingChannel = client.channels.cache.get('781091522858713129')
    if (!trainingChannel) {
      return message.channel.send(tcEmbed)
    }
    
    try {
      const cardList = await trello.getCardsOnList(process.env.TRELLO_SESSION_LIST_ID)
      const foundCard = cardList.find(obj => obj.shortLink == sessionID)

      const splitDescription = foundCard.desc.split('|')
      const trainingStatus = splitDescription[0].split(':')[1]
      const trainingMsgID = splitDescription[1].split(':')[1]

      const tmEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`The message associated with this session cannot be found.`)
      .setFooter(`System Error`)

      const targetMessage = await trainingChannel.messages.fetch(trainingMsgID, false, true)
      if (!targetMessage) {
        return message.channel.send(tmEmbed)
      }

      await trello.updateCardDescription(sessionID, `Training Status: ${newStatus} | MessageID:${targetMessage.id}`)
      message.channel.send('**Success :tada:!** Your session status has been edited!');

      const data = targetMessage.embeds[0]

      const targetEmbed = new Discord.MessageEmbed()
   .setColor('BLUE')
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
   .setTitle(`**Snowflake Hotels & Resorts | Training**`)
   .setDescription(data.description)
   .addFields(
     { name: `Status`, value: newStatus }
   )
   .setImage(`https://t0.rbxcdn.com/ee31a10e4522fffd07b28a6f29f89890`)
      .setFooter(`SessionID: ${sessionID}`)

      targetMessage.edit({content: `<@&781093439726026762>`, embed: targetEmbed});

    } catch(err) {
  const errorEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription("An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`")

      return message.channel.send(errorEmbed)
    }
	}
}


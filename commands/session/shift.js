const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)
const Discord = require('discord.js')

module.exports = {
  name : `shift`,
  description: `Host an shift!`,
  usage: ``,
  run : async (client, message, args) => {
    const rolesEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('❌ Access Denied!')
    .setDescription('You need to be am HR+ to run this command.')
    .setFooter('System Error')
  if (!message.member.roles.cache.some(role => ["HR Team", "SHR Team", "Corporate"].includes(role.name))) {
    return message.channel.send(rolesEmbed)
  }
  let channel = client.channels.cache.get('781091522858713129');

  try {

  const newEmbed = await channel.send({content: `<@&781093439726026762>`, embed: new Discord.MessageEmbed()
   .setColor('BLUE')
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
   .setTitle(`**Snowflake Hotels & Resorts | Shift**`)
   .setDescription(`A shift is currently being hosted by <@${message.author.id}>! Head down to the hotel for a nice shift! Sounds like a plan!\n\n:link: - [Hotel Link](https://www.roblox.com/games/5985009117)`)
   .addFields(
     { name: `Status`, value: `On-going` }
   )
   .setImage(`https://t6.rbxcdn.com/8888c0027525528ddd382a99bb85c8ff`)
  });

  const createdCard = await trello.addCard(`Shift Host: ${message.author.tag}`, `Shift Status:Awaiting | MessageID:${newEmbed.id}`, process.env.TRELLO_SESSION_LIST_ID)

  const sentEmbed = new Discord.MessageEmbed()
   .setColor('BLUE')
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
   .setTitle(`**Snowflake Hotels & Resorts | Shift**`)
   .setDescription(`A shift is currently being hosted by <@${message.author.id}>! Head down to the hotel for a nice shift! Sounds like a plan!\n\n:link: - [Hotel Link](https://www.roblox.com/games/5985009117)`)
   .addFields(
     { name: `Status`, value: `On-going` }
   )
   .setImage(`https://t6.rbxcdn.com/8888c0027525528ddd382a99bb85c8ff`)
   .setFooter(`SessionID: ${createdCard.shortLink}`)

   newEmbed.edit({content: `<@&781093439726026762>`, embed: sentEmbed})

  const successEmbed = new Discord.MessageEmbed()
  .setColor('RANDOM')
  .setTitle('Success!')
  .setDescription('Your session announcement has been posted! Session Info:')
  .addFields(
    { name: `Host`, value: `<@${message.author.id}>` },
    { name: `SessionID`, value: `${createdCard.shortLink}` },
  )
  .setFooter('Session System')

    message.channel.send(successEmbed);
  } catch (err) {

  const errorEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription("An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`")

    return message.channel.send(errorEmbed)
  }

}
}
const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)
const Discord = require('discord.js')

module.exports = {
  name: `training`,
  description: `Host a training session!`,
  usage: `<time_in_EST>`,
  run : async (client, message, args) => {

    const rolesEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('❌ Access Denied!')
    .setDescription('You need to be am HR+ to run this command.')
    .setFooter('System Error')

  if (!message.member.roles.cache.some(role => ["General Manager", "Relations Director", "SHR Team", "Corporate"].includes(role.name))) {
    return message.channel.send(rolesEmbed)
  }

  const timeEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription("The time argument is required. Make sure you used 24 Hours format for the time argument. For example: \`.training 14:30\`")
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  .setFooter('System Error')

  let channel = client.channels.cache.get('781091522858713129');
  let time = args[0];
  if (!time) {
    return message.channel.send(timeEmbed);
  }

  try {
    

   const newEmbed =  await channel.send({content: `<@&781093439726026762>`, embed: new Discord.MessageEmbed()
   .setColor('BLUE')
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
   .setTitle(`**Snowflake Hotels & Resorts | Training**`)
   .setDescription(`A training is currently being hosted by <@${message.author.id}>! Head down to the Training Center to get a promotion! MR+ are needed for assistant!\n\n:alarm_clock: ${time} EST\n:link: - [Training Center Link](https://www.roblox.com/games/5995033690)`)
   .addFields(
     { name: `Status`, value: `On-going` }
   )
   .setImage(`https://t0.rbxcdn.com/ee31a10e4522fffd07b28a6f29f89890`)
  });

  const createdCard = await trello.addCard(`Training Host: ${message.author.tag} | Training Time: ${time} EST`, `Training Status:Awaiting | MessageID:${newEmbed.id}`, process.env.TRELLO_SESSION_LIST_ID)

  const sentEmbed = new Discord.MessageEmbed()
   .setColor('BLUE')
   .setAuthor(message.author.tag, message.author.displayAvatarURL())
   .setTitle(`**Snowflake Hotels & Resorts | Training**`)
   .setDescription(`A training is currently being hosted by <@${message.author.id}>! Head down to the Training Center to get a promotion! MR+ are needed for assistant!\n\n:alarm_clock: ${time} EST\n:link: - [Training Center Link](https://www.roblox.com/games/5995033690)`)
   .addFields(
     { name: `Status`, value: `On-going` }
   )
   .setImage(`https://t0.rbxcdn.com/ee31a10e4522fffd07b28a6f29f89890`)
   .setFooter(`SessionID: ${createdCard.shortLink}`)

   newEmbed.edit({content: `<@&781093439726026762>`, embed: sentEmbed})

  const successEmbed = new Discord.MessageEmbed()
.setColor('RANDOM')
.setTitle('Success!')
.setDescription('Posted!')
.addFields(
  { name: `Host`, value: `<@${message.author.id}> (Staff Member)`},
  { name: `Time`, value: time + `EST` },
  { name: `SessionID`, value: createdCard.shortLink },
)
.setFooter('Session')

  message.channel.send(successEmbed);

  } catch (err) {
  const errorEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription("An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`")

    return message.channel.send(errorEmbed)
  }
  }
}
const prompter = require('discordjs-prompter');
const Discord = require('discord.js');

module.exports = {
    name : 'announce',
    category : 'utility',
    description : 'Announce command',
    run : async (client, message, args) => {
    const rolesEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('❌ Access Denied!')
    .setDescription('You need to be am HR+ to run this command.')
    .setFooter('System Error')
  if (!message.member.roles.cache.some(role => ["Bot Developer"].includes(role.name))) {
    return message.channel.send(rolesEmbed)
  }
  try {
    const questionOne = await prompter.message(message.channel, {
      question: "What is the title of the announcement? _Say `cancel` after any question prompted if you want to cancel._",
				userId: message.author.id,
				max: 1,
				timeout: 2000000
    })
    if (!questionOne.size) return message.channel.send("Prompt cancelled due to no response.")
    const responseOne = questionOne.first()
    if (responseOne.content.toLowerCase() == 'cancel') return message.channel.send("Prompt cancelled.")
    ///
    const questionTwo = await prompter.message(message.channel, {
      question: "What is the description of the announcement?",
				userId: message.author.id,
				max: 1,
				timeout: 2000000
    })
    if (!questionTwo.size) return message.channel.send("Prompt cancelled due to no response.")
    const responseTwo = questionTwo.first()
    if (responseTwo.content.toLowerCase() == 'cancel') return message.channel.send("Prompt cancelled.")
     // 
    ///
    const questionFive = await prompter.message(message.channel, {
      question: "What channel do you want the announcement to go?",
				userId: message.author.id,
				max: 1,
				timeout: 2000000
    })
    if (!questionFive.size) return message.channel.send("Prompt cancelled due to no response.")
    const responseFive = questionFive.first().content.slice(2, -1)
    if (responseFive.toLowerCase() == 'cancel') return message.channel.send("Prompt cancelled.")
    ///
    ///

    message.channel.send('**Success :tada:!** Your announcement has been posted!');

    const announceEmbed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(responseOne.content)
    .setDescription(responseTwo.content)
    .setTimestamp()
    .setFooter(`Sent by ${message.author.tag}`)

    client.channels.cache.find(channel => channel.id == responseFive).send(announceEmbed)
  } catch (err) {

  const errorEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription("An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`")

    return message.channel.send(errorEmbed)
  }
}
}

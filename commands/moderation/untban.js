require('dotenv').config()
const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)
const Discord = require('discord.js')

module.exports = {
  name: `untban`,
  description: `unTban a ROBLOX player.`,
  usage: `<username>`,
  run : async (client, message, args) => {
    const rolesEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('❌ Access Denied!')
    .setDescription('You need to the `TBan Permissions` to run this command.')
    .setFooter('Snowflake Hotels | System Error')
  if (!message.member.roles.cache.some(role => ["TBan Permissions"].includes(role.name))) {
    return message.channel.send(rolesEmbed)
  }

  const targetEmbed = new Discord.MessageEmbed()
  .setColor('#FF0000')
  .setDescription(`"Use this format: s!untban <username>`)
  .setFooter('Snowflake Hotels | System Error')

  const targetUsername = args[0]
  if (!targetUsername) {
    return message.channel.send(targetEmbed); 
  }
  try {
    const cardList = await trello.getCardsOnList(process.env.TRELLO_LIST_ID)
    if (cardList.length === 0) {
      return message.channel.send({embed: {
            color: 15406156,
            description: "There are no people to unban. Guess that's a good thing?",
            author: {
              name: message.author.tag,
              icon_url: message.author.displayAvatarURL
            },
            footer: {
              text: "Snowflake Hotels | System Error"
            }
        }}); 
    }
    const foundCard = cardList.find(obj => {
		return obj.name.split(':')[0] == targetUsername
	})
  if (foundCard == null) return message.channel.send({embed: {
                color: 15406156,
                description: "Username not found. Run `banlist` to see if the username is there.",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
  await trello.deleteCard(foundCard.shortLink)
  return message.channel.send({embed: {
                color: 3066993,
                description: "User has been untrello banned! If you wish to trello ban this user, feel free to do the tban command!",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
  } catch(err) {
    return message.channel.send({embed: {
      color: 15406156,
      description: "An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`"
    }})
  }
}
}

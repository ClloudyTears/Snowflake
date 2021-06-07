require('dotenv').config()
const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

const { Menu } = require('discord.js-menu')
const {MessageEmbed} = require('discord.js')


module.exports = {
  name: `checkban`,
  description: `Check someone tban status,`,
  aliases: ['cb'],
  usage: `<username>`,
  run : async (client, message, args) => {
  if(!message.member.roles.cache.some(role =>["TBan Permissions"].includes(role.name))){
        return message.channel.send({embed: {
            color: 16733013,
            title: '❌ Access Denied!',
            description: "You have to be an SHR+ to run this command.",
            footer: {
            text: 'Snowflake Hotels & Resorts',
            icon_url: ``
        },
        }})
    }
  try {
    const targetUsername = args[0]
    const cardList = await trello.getCardsOnList(process.env.TRELLO_LIST_ID)
    if (cardList.length == 0) return message.channel.send({embed: {
                color: 15406156,
                description: "There are no people that are banned. Guess that's a good thing?",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
    const foundCard = cardList.find(obj => {
      return obj.name.split(':')[0].toLowerCase() == targetUsername.toLowerCase()
    })
    return message.channel.send({embed: {
      color: 3447003,
      title: `Ban info for ${targetUsername}:`,
      description: "This is the ban information for this user:",
      timestamp: new Date(),
      fields: [
        {
          name: "Username:",
          value: foundCard.name.split(':')[0]
        },
        {
          name: 'User Id:',
          value: foundCard.name.split(':')[1]
        },
        {
          name: "Reason:",
          value: foundCard.desc
        }
      ]
    }
    })
  } catch(err) {
    return message.channel.send({embed: {
      color: 15406156,
      description: "An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`"
    }})
  }
  //message.channel.send('command under construction')
}
}

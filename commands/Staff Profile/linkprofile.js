const Discord = require('discord.js')

const Trello = require("trello");
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

const noblox = require("noblox.js");

const listID = process.env.PROFILE_LINKING_LIST_ID
const groupID = process.env.ROBLOX_GROUP_ID
const staffMinRank = process.env.STAFF_MIN_RANK

module.exports = {
  name: 'linkprofile',
  description: 'Link your discord account to a profile!',
  usage: "[ping (omit if yourself)] [robloxUsername]",
  run: async (client, message, args) => {

        if (!message.member.roles.cache.some(role => ["Bot Developerb", "HR Team", "MR Team", "SHR Team", "Corporate"].includes(role.name))) {
    return message.channel.send({
      embed: {
        color: 16733013,
        title: '❌ Access Denied!',
        description: "Command has been disabled. Only Bot Developer can use this for now.",
        footer: {
          text: 'Snowflake Hotels & Resorts',
          icon_url: ``
        },
      }
    })
  }
  
    const user = message.mentions.users.first() || message.author;
    if (user == null) {
       const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Invalid Arguments')
      .setDescription("Please mention a user. if you are doing this to yourself, pass the amount only.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    }
    const robloxUsername = args[1] || args[0];
    if (robloxUsername == null) {
       const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Invalid Arguments')
      .setDescription("Please pass your Roblox username.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
    }

    try {
      const robloxUserId = await noblox.getIdFromUsername(robloxUsername);

      if (robloxUserId == null) {
         const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, I can't find your Roblox account. Did you type your username correctly?")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

      const userGroups = await noblox.getGroups(robloxUserId);
      const targetGroup = userGroups.find((obj) => {
        return obj.Id == groupID;
      });
      if (targetGroup == null) {
         const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, can't find you inside the group.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
      }

       isPlayerAlreadyLinked(
        robloxUserId,
        message.author.id,
        async (returnedObject) => {
          if (returnedObject.error) {
            console.log(returnedObject.value)
            return message.channel.send(
              "Oof, an error occurred when checking if you were linked or not."
            );
          }
          if (returnedObject.value == true) {
             const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("Hmm, it seems you are already linked.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
          } else {
            if (targetGroup.Rank < staffMinRank) {
               const embed = new Discord.MessageEmbed()
      .setColor(15158332)
      .setTitle('Error')
      .setDescription("This command is for staff only.")
      .setTimestamp()
      .setFooter(`Requested by ${message.author.tag}`)
      return message.channel.send(embed)
            }

            const createdCard = await trello.addCard(
              `${robloxUserId}:${message.author.id}`,
              JSON.stringify({
                roblox: {
                  Rank: targetGroup.Rank,
                  Role: targetGroup.Role,
                  username: robloxUsername,
                  userId: robloxUserId,
                },
                discord: {
                  id: user.id,
                  tag: user.tag,
                },
                data: {
                  strikes: 0,
                  sessions: 0,
                },
              }),
              listID
            );
            const MessageEmbed = new Discord.MessageEmbed()
              .setColor(3066993)
              .setTitle(`Profile for ${robloxUsername}`)
              .addFields(
                { name: "Roblox Username:", value: robloxUsername },
                { name: "Roblox Id:", value: robloxUserId },
                { name: "Rank In Group:", value: targetGroup.Role },
                { name: "Discord tag:", value: message.author.tag },
                { name: "Discord Id", value: message.author.id }
              )
              .setTimestamp()
              .setFooter("Snowflake Hotels Staff Manager");
            return message.channel.send("Profile created!", MessageEmbed);
          }
        }
      );
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

async function isPlayerAlreadyLinked(robloxID, discordID, callback) {
  try {
    const currentCardList = await trello.getCardsOnList(listID);
    const foundCardIfAlreadyCreated = currentCardList.find((obj) => {
      return obj.name == `${robloxID}:${discordID}`;
    });
    if (foundCardIfAlreadyCreated == null) {
      callback({
        error: false,
        value: false,
      });
    } else {
      callback({
        error: false,
        value: true,
      });
    }
  } catch (err) {
    callback({
      error: true,
      value: "ERROR when checking if user is already linked: " + err,
    });
  }
};
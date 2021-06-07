const Trello = require('trello')
const trello = new Trello(process.env.TRELLO_APP_KEY, process.env.TRELLO_TOKEN)

module.exports = { 
	name: `setmg`,
	category: `utility`,
	description: `Set member goal!`,
	run : async (client, message, args) => {
  if (!message.member.roles.cache.some(role => ["Bot Developer","Corporate Team"].includes(role.name))) {
    return message.channel.send({
      embed: {
        color: 16733013,
        title: '❌ Access Denied!',
        description: "You have to be an ESHR or have the `Bot Developer` to run this command.",
        footer: {
          text: 'Snowflake Hotels & Resorts',
          icon_url: ``
        },
      }
    })
  }
  const newGoal = args[0]
  if (!newGoal) {
    return message.channel.send({embed: {
                color: 15406156,
                description: "Use this format: s!setmg <newGoal>`",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }}); 
  }
  if (newGoal.includes(',')) return message.channel.send('No commas for the new goal please.')
  try {
    const memberGoalList = await trello.getCardsOnList('6027c44a27dc24762456961b')
    const cardToEdit = memberGoalList[0]
	  await trello.updateCardName(cardToEdit.shortLink, newGoal)
    return message.channel.send({embed: {
                color: 3066993,
                description: "Member Goal change has been successful!",
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL
                }
            }})
  } catch (err) {
    return message.channel.send({embed: {
      color: 15406156,
      description: "An error occurred! Please try again later or consult the bot owner. \n **Error:** `" + err + "`"
    }})
  }
}
}

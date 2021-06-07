const { MessageEmbed } = require('discord.js')
module.exports = {
    name : 'haspass',
    category : 'info',
    description : 'Check gamepass',
    usage: ``,

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    run : async(client, message, args) => {
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`https://inventory.roblox.com/docs#!/Inventory/get_v2_users_userId_items_itemType_itemTargetId
        
        **How To Use The Link Above**
        - Scroll down and change asset to gamepass.
        - Enter the userid and gamepassid.
        - Press "Try it Out!"
        
        **How Do I Know If They Have The Gamepass?**
        If the box below looks like the image attach below, they do **NOT** own the gamepass.`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setImage('https://cdn.discordapp.com/attachments/804209915023065098/804471491075768330/8723bddcefa48a22ae3a3684109bbb52.png')
            message.channel.send(embed)

    }
}

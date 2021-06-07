module.exports= {
  name: `staffcall`,
  description: `Request for a staff member.`,
  usage: `<message>`,
  run : async (client, message, args) => {
  if(!message.member.roles.cache.some(role =>["Relations Director", "SHR Team", "Corporate Team"].includes(role.name))){
        return message.channel.send({embed: {
            color: 16733013,
            title: '❌ Access Denied!',
            description: "You need to be Relations Director+ role to run this command.",
            footer: {
            text: 'Snowflake Hotels & Resorts',
            icon_url: ``
        },
        }})
    }
  let channel = client.channels.cache.get('789703412031160320');
  
  const tosend = args.slice(0).join(" ");
    if(!tosend){
        return message.channel.send({embed: {
            color: 16733013,
            description: "The detail argument is required.",
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL()
            }
        }});
    }
    
  message.channel.send('**Success :tada:!** Your request has been posted!');

channel.send({content: "@here", embed: {
        color: "BLUE",
        title: `:mega: **Staff Callout**`,
        description: `${message.author.username} is requesting staff to assist!\n`
        + `\n`
        + `Help Information:\n`
        + `Details: ${tosend}\n`
        + `\n`
        + `Staff Information:\n`
        + `Discord Username: ${message.author.username}\n`
        + `Discord ID: ${message.author.id}\n`
        + `Discord Tag: <@${message.author.id}>\n`
        + `\n`
        + `If you are available, come on down to help us out!`,
          author: {
          name: "",
        },
        footer: {
          text: "Snowflake Hotels | Staff Callout"
        }
      }
   });
}
}
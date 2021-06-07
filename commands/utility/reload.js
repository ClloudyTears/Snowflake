const glob = require('glob');
const Discord = require('discord.js');
const Client = require('discord.js')

module.exports = {
    name : 'reload',
    category : 'utility',
    description : 'Reload all commands',
    run : async (client, message, args) => {
      if(message.author.id !== "774284073212051468") return;

      glob(`${__dirname}/../**/*.js`, async(err, filePaths) => {
        if(err) return console.log(err);
        client.commands.sweep(() => true)
        filePaths.forEach((file) => {
          delete require.cache[require.resolve(file)];

          const pull = require(file);

          if(pull.name) {
            console.log(`Reloaded ${pull.name} (cmd)`)
            client.commands.set(pull.name, pull)
          }

          if(pull.aliases && Array.isArray(pull.aliases)) {
            pull.aliases.forEach((alias) => {
              client.aliases.set(alias, pull.name)
            });
          }
        });
      });
      message.channel.send(`All commands has been succesfully reloaded.`)
    },
};
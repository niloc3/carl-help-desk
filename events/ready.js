
const fs = require('fs')

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log('Ready!')


    // SLASH COMMAND REGISTER START

    // const { REST } = require('@discordjs/rest');
    // const { Routes } = require('discord-api-types/v9');

    // const commands = [];
    // const slashCommands = fs.readdirSync('././commands').filter(file => file.endsWith('.js'));



    // for (const file of slashCommands) {
    //   const command = require(`../commands/${file}`);
    //   commands.push(command.data.toJSON());
    // }

    // const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    // (async () => {
    //   try {
    //     console.log('Started refreshing application (/) commands.');

    //     await rest.put(
    //       Routes.applicationGuildCommands('938977067901542440', '759066524517400636'),
    //       { body: commands },
    //     );

    //     console.log('Successfully reloaded application (/) commands.');
    //   } catch (error) {
    //     console.error(error);
    //   }
    // })();

    // SLASH COMMAND REGISTER END

  },
};
const {
    Collection,
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');
const fs = require('fs')
let data = JSON.parse(fs.readFileSync('./data.json'));
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {


/////////////////////////////////////////
//  START OF NORMAL SLASH COMMANDS //////
/////////////////////////////////////////

        client.slashCommand = new Collection();

        const commandFiles = fs.readdirSync('././commands').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.slashCommand.set(command.data.name, command);
        }

        if (interaction.isCommand()) {
            if (!client.slashCommand.has(interaction.commandName)) return;

            try {
                client.slashCommand.get(interaction.commandName).execute(interaction, client);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        } else {
/////////////////////////////////////////
//    END OF NORMAL SLASH COMMANDS //////
/////////////////////////////////////////

      if (interaction.componentType == 'SELECT_MENU') {
        if (interaction.customId == 'category') {
          const selects = data[interaction.values[0]].resources.map((u, i) => JSON.parse(`{"label":"${u.name}", "value":"${interaction.values[0]}-${i}"}`))

          console.log(data[interaction.values[0]])
          const categoryEmbed = new MessageEmbed()
            .setTitle(data[interaction.values[0]].name)
            .setDescription(data[interaction.values[0]].category.url)

		      const row = new MessageActionRow()
		      	.addComponents(
		      		new MessageSelectMenu()
		      			.setCustomId('resources')
		      			.setPlaceholder('Nothing selected')
		      			.addOptions(selects),
		      	);

          interaction.reply({embeds: [categoryEmbed], components: [row], ephemeral: true})
          
        }

        if (interaction.customId == 'resources') {
          const indexes =  interaction.values[0].split('-')

          console.log()
          interaction.reply({embeds: [data[indexes[0]].resources[indexes[1]].embed], ephemeral: true})

          
        }
        


      }
        }
    },
};
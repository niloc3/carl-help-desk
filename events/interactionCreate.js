const {
    Collection,
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');
const startEmbed = new MessageEmbed()
var resourceRow;
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
                    const categoryEmbed = new MessageEmbed()
                        .setTitle(data[interaction.values[0]].name)
                        .setDescription(data[interaction.values[0]].category.url)
                     var categoryRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                            .setCustomId('resources')
                            .setPlaceholder('Nothing selected')
                            .addOptions(selects),

                        );
                     var categoryRow2 = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('back')
                            .setStyle('SECONDARY')
                            .setLabel('Back')

                        );
                    interaction.update({
                        embeds: [categoryEmbed],
                        components: [categoryRow, categoryRow2],
                        ephemeral: true
                    })
                }

                if (interaction.customId == 'resources') {
                    const indexes = interaction.values[0].split('-')
                    interaction.update({
                        embeds: [data[indexes[0]].resources[indexes[1]].embed],
                        ephemeral: true
                    })
                }
            }
            if (interaction.componentType == 'BUTTON') {
                if (interaction.customId == 'start') {
                    const selects = data.map((u, i) => JSON.parse(`{"label":"${u.name.replaceAll(`*`,``)}", "value":"${i}"}`))
                    
                        startEmbed.setTitle('Carl-Bot Help Desk')
                        startEmbed.setDescription('Select a category below to get help about it')
                     resourceRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                            .setCustomId('category')
                            .setPlaceholder('Nothing selected')
                            .addOptions(selects),
                        );
                    interaction.reply({
                        embeds: [startEmbed],
                        components: [resourceRow],
                        ephemeral: true
                    })
                } else {
                    // go back
                      
                      interaction.update({
                        embeds: [startEmbed],
                        components: [resourceRow],
                        ephemeral: true
                    })
                }
            }
        }
    },
};
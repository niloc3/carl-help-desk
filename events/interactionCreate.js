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
                var categoryRow2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                        .setCustomId('home')
                        .setStyle('SECONDARY')
                        .setLabel('Home')
                        .setEmoji('🏠')
                    );

            var categoryRow3 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('back')
                    .setStyle('PRIMARY')
                    .setLabel('Back'),
                    new MessageButton()
                    .setCustomId('home')
                    .setStyle('SECONDARY')
                    .setLabel('Home')
                    .setEmoji('🏠'),
                );
      
        if (interaction.componentType == 'SELECT_MENU') {

            if (interaction.customId == 'category') {

                const selects = data[interaction.values[0]].resources.map((u, i) => JSON.parse(`{"label":"${u.name}", "value":"${interaction.values[0]}-${i}"}`))
                    .sort((a, b) => {
                        var textA = a.label.toUpperCase();
                        var textB = b.label.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                    })

                if (selects.length == 1) {
                    interaction.update({
                        embeds: [data[interaction.values[0]].resources[0].embed],
                        components: [categoryRow2],
                        ephemeral: true
                    })
                } else {
                    var categoryRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                            .setCustomId('resources')
                            .setPlaceholder('Select a resource')
                            .addOptions(selects),
                        );
                    const categoryEmbed = new MessageEmbed()
                        .setColor(0x5865F2)
                        .setTitle(data[interaction.values[0]].name)
                    if (data[interaction.values[0]].category.url) {
                        categoryEmbed.setDescription(`Select a resource from the dropdown menu below to get help.\nMore info can be found in the [documentation](${data[interaction.values[0]].category.url}).`)
                    } else {
                        categoryEmbed.setDescription(`Select a resource from the dropdown menu below to get help.\nMore info can be found in the [documentation](https://docs.carl.gg).`)
                    }
                    interaction.update({
                        embeds: [categoryEmbed],
                        components: [categoryRow, categoryRow2],
                        ephemeral: true
                    })
                }
            }
            if (interaction.customId == 'resources') {
                const indexes = interaction.values[0].split('-')
                var newSelectMenu = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId(interaction.message.components[0].components[0].customId)
                        .setPlaceholder(data[indexes[0]].resources[indexes[1]].name)
                        .addOptions(interaction.message.components[0].components[0].options),
                    );
                interaction.update({
                    embeds: [data[indexes[0]].resources[indexes[1]].embed],
                    components: [newSelectMenu, categoryRow3],
                    ephemeral: true
                })
            }
        }
        if (interaction.componentType == 'BUTTON') {
            if (interaction.customId == 'start') {
                const selects = data.map((u, i) => JSON.parse(`{"label":"${u.name.replaceAll(`*`,``)}", "value":"${i}"}`)).sort((a, b) => {
                    var textA = a.label.toUpperCase();
                    var textB = b.label.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                startEmbed.setTitle('Carl-Bot Help Desk')
                startEmbed.setColor(0x5865F2)
                startEmbed.setDescription('Select a category below to get help about it.\n\nCan’t find what you’re looking for? Ask a human in another support channel.\nSee <#805888259934257203>')
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
            } else if (interaction.customId == 'home') {
                interaction.update({
                    embeds: [startEmbed],
                    components: [resourceRow],
                    ephemeral: true
                })
            } else if (interaction.customId == 'back') {
                const placeholder = interaction.message.components[0].components[0].placeholder
                var category;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].resources.filter(a => a.name == placeholder).length > 0) {
                        category = data[i]
                    }
                }
                var newSelectMenu = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                        .setCustomId(interaction.message.components[0].components[0].customId)
                        .setPlaceholder('Select a resource')
                        .addOptions(interaction.message.components[0].components[0].options),
                    );
                const newEmbed = new MessageEmbed()
                    .setTitle(category.name)
                    .setDescription(`Select a resource from the dropdown menu below to get help.\nMore info can be found in the [documentation](${category.category.url || 'https://docs.carl.gg'}).`)
                interaction.update({
                    embeds: [newEmbed],
                    components: [newSelectMenu, categoryRow2],
                    ephemeral: true
                })

            }
        }
    },
};
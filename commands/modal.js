const {
    Collection,
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');

module.exports = {
    name: 'modal',
    description: 'Modal!',
    execute(message, args) {
        // if (message.author.id !== '626916199783071750') return;

        var row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('blah3')
                .setPlaceholder('Select a resource')
                .addOptions([{
                        label: 'Select me',
                        description: 'This is a description',
                        value: 'first_option',
                    },
                    {
                        label: 'You can select me too',
                        description: 'This is also a description',
                        value: 'second_option',
                    },
                ]),
            );
        var row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('blah')
                .setStyle('PRIMARY')
                .setLabel('Back'),
                new MessageButton()
                .setCustomId('blah1')
                .setStyle('SECONDARY')
                .setLabel('Home')
                .setEmoji('🏠'),
                new MessageButton()
                .setCustomId('feedback')
                .setStyle('SUCCESS')
                .setLabel('Give Feedback')
            );
        const embed = new MessageEmbed()
            .setTitle('Some random support resource')
            .setDescription('Just a placeholder support resource. The home and back buttons below do nothing, we are just here to test the feedback flow.')

        message.reply({
            embeds: [embed],
            components: [row, row2],
            ephemeral: true
        });
    },
};
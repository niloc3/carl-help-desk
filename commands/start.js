const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');

module.exports = {
    name: 'start',
    execute(message, args) {
        if (message.author.id !== '626916199783071750') return;
        const embed = new MessageEmbed()
            .setTitle('Carl-Bot Help Desk')
            .setColor(0x5865F2)
            .setDescription('Click the button below to start an interactive help desk.\nFrom there, you will be able to select a category and then find specific resources about it.\n\nCan’t find what you’re looking for? Ask a human in another support channel.\nSee <#805888259934257203>')

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('start')
                .setLabel('Start')
                .setStyle('PRIMARY')
            );

        message.channel.send({
            embeds: [embed],
            components: [row]
        })
    },
};
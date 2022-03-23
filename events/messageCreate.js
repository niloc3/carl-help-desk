const fs = require('fs')
const {
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');
let data = JSON.parse(fs.readFileSync('./data.json'));
module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (message.content == '!start') {
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
        }

    },
};
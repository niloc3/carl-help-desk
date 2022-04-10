const fs = require('fs')
const prefix = `,`
const {
    Permissions,
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    MessageSelectMenu
} = require('discord.js');
module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }

    },
};
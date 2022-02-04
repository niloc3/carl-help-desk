const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data.json'));


module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Sends starting embed.'),
    async execute(message, client) {

message.reply('Help Desk Sent Below')
const selects = data.map((u, i) => JSON.parse(`{"label":"${u.name}", "value":"${i}"}`))
const embed = new MessageEmbed()
  .setTitle('Carl-Bot Help Desk')
  .setDescription('Pick a carl-bot feature you need help with below to get help with a specific issue.')
  .setFooter('ONLY select the last option if you have read all other info.')

		const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('category')
					.setPlaceholder('Nothing selected')
					.addOptions(selects),
			);

  message.channel.send({embeds: [embed], components: [row]})

    },
};
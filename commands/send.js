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
const embed = new MessageEmbed()
  .setTitle('Carl-Bot Help Desk')
  .setDescription('Click the button below to start an interactive help desk.')

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('start')
					.setLabel('Start')
          .setStyle('PRIMARY')
			);

  message.channel.send({embeds: [embed], components: [row]})

    },
};
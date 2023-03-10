const fs = require('fs')
const { MessageEmbed, ThreadChannel } = require('discord.js')
const SOLVED_TAG_ID = "1083454388154142750" // I'm not even sure if this is right

module.exports = {
	name: 'solved',
	execute(message, args, client) {
    if (!message.member.roles.cache.has(process.env.MODROLE)) return;

    if (!message.channel.type == ThreadChannel) return; // I think this is right?

    let thread = message.channel;

    let tagsAndSolved = [...thread.tags, SOLVED_TAG_ID];

    thread.setAppliedTags(tagsAndSolved, "Marked as solved.");
    thread.setArchived(true);

    const solvedEmbed = new MessageEmbed()
      .setTitle('Solved')
      .setDescription('Marked as solved.')
      .setColor(0x00ff00)

      message.reply({embeds: [solvedEmbed]})
	},
};

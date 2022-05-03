const fs = require('fs')
const { MessageEmbed } = require('discord.js')
module.exports = {
	name: 'blacklist',
	execute(message, args, client) {
    if (!message.member.roles.cache.has(process.env.MODROLE)) return;
    let rawBlacklistedUsers = fs.readFileSync('./blacklisted_users.txt')
    let blacklistedUsers = JSON.parse(rawBlacklistedUsers);


    const blacklistEmbed = new MessageEmbed()
      .setTitle('Blacklisted Users')
      .setDescription(blacklistedUsers?.map((p, i) => `${i + 1}. <@${p}>`)?.join('\n') || "None")
      .setColor(0x5865F2)
      if (blacklistedUsers.length == 1) {
        blacklistEmbed.setFooter({ text: `${blacklistedUsers.length} blacklisted user`})
      } else {
        blacklistEmbed.setFooter({ text: `${blacklistedUsers.length} blacklisted users`})
      }
      


      message.reply({embeds: [blacklistEmbed]})

	},
};


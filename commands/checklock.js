const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'checklock',
	execute(message, args) {
    if (message.author.id !== '626916199783071750') return;
		const isLocked = !message.guild.roles.everyone.permissions.has(Permissions.FLAGS.SEND_MESSAGES)

    const lockEmbed = new MessageEmbed()
      .setColor(0x2F3136)

    if (isLocked) {
      lockEmbed.setTitle(':lock: Locked')
      lockEmbed.setDescription('The `@everyone` role is **not** able to `Send Messages`, therefore the server is currently **locked**.')
    } else {
      lockEmbed.setTitle(':unlock: Not Locked')
      lockEmbed.setDescription('The `@everyone` role **is** able to `Send Messages`, therefore the server is currently **not locked**.')
    }


    message.reply({
      embeds: [lockEmbed],
    });
    
	},
};
const { MessageEmbed } = require('discord.js')
module.exports = {
  name: 'modalSubmit',
  execute(modal, client) {

    const embed = new MessageEmbed()
      .setTitle('New Feedback Response')
	    .addFields(
	    	{ name: 'Username', value: modal.user.username + "#" + modal.user.discriminator },
	    	{ name: 'User ID', value: modal.user.id },
        { name: 'Was their question answered', value: modal.customId },
	    	{ name: 'Justify Your Response', value: modal.fields[0].value },
	    )
    client.channels.cache.get('961848341271019550').send({embeds: [embed]});
    modal.update({ content: 'Thank you! Your response has been recorded.', components: [], ephemeral: true })

  },
};
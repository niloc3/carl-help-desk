const {Interaction, MessageEmbed} = require('discord.js');
var fs = require('fs');
/**
 * Send a feedback embed
 * @param {Interaction} interaction The interaction that triggered this
 * @param {boolean} wasAnswerwed Was the question answered?
 * @param {string | null} [feedback = null] Additional feedback
 * @param {string | null} [editID = null] ID of the feedback to edit, or null to create new
 * @returns {Promise<string>} ID of the feedback message
 */

async function sendFeedbackEmbed(
	interaction,
	wasAnswerwed,
	feedback = null,
	editID = null,
) {
  var data = fs.readFileSync('feedback_num.txt', 'utf-8');
	let embed = new MessageEmbed()
    .setTitle(`Feedback #${data}`)
    .addFields(
		{
			name: 'Was their question answered?',
			value: wasAnswerwed ? 'Yes' : 'No',
		},
		{
			name: 'Additional comment',
			value: feedback || 'None',
		},
	)
    .setFooter({ 
      text: interaction.user.username + '#' + interaction.user.discriminator + ' ─ ' + interaction.user.id,
      iconURL: interaction.user.displayAvatarURL()
        })
    .setColor(wasAnswerwed ? '0x3fd141' : '0xb81c11')


	let channel = interaction.client.channels.cache.get('961848341271019550');
	let message;

	if (editID) {
		message = await channel.messages.fetch(editID);
		message = await message.edit({embeds: [embed]});
	} else {
		message = await channel.send({
			embeds: [embed],
		});
	}

  if (!feedback) {
    fs.writeFileSync('feedback_num.txt', JSON.stringify(parseInt(data) + 1), 'utf-8');
  }
  
	return message.id;
}

module.exports = {sendFeedbackEmbed};

const {Interaction, MessageEmbed} = require('discord.js');

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
	let embed = new MessageEmbed().setTitle('New Feedback Response').addFields(
		{
			name: 'Username',
			value:
				interaction.user.username +
				'#' +
				interaction.user.discriminator,
		},
		{
			name: 'User ID',
			value: interaction.user.id,
		},
		{
			name: 'Was their question answered',
			value: wasAnswerwed ? 'Yes' : 'No',
		},
		{
			name: 'Your Feedback',
			value: feedback || 'None',
		},
	);

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

	return message.id;
}

module.exports = {sendFeedbackEmbed};

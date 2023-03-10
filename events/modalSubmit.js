const { MessageEmbed } = require('discord.js');
const { sendfile } = require('express/lib/response');
const { sessions, sendFeedbackEmbed } = require('../helpers');

module.exports = {
	name: 'modalSubmit',
	async execute(modal, client, Discord, mixpanel) {
		let id = modal.customId;
		let msgid = id.split('-')[1];
		let wasAnswerwed = id.split('-')[0] == 'Yes';

		await sendFeedbackEmbed(
			modal,
			wasAnswerwed,
			modal.fields[0].value,
			msgid,
		);
		const feedbackSubmitNo = new MessageEmbed()
			.setTitle('Automated Support Feedback')
			.setDescription('Thank you! Your response has been recorded.')
			.setColor(0x5865f2);

		modal.update({
			embeds: [feedbackSubmitNo],
			components: [],
			ephemeral: true,
		});
		// mixpanel.track('Feedback Modal Submitted', {
		// 	distict_id: modal.user.id,
		// });
	},
};

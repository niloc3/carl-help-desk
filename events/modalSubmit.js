const {MessageEmbed} = require('discord.js');
const {sendfile} = require('express/lib/response');
const {sendFeedbackEmbed} = require('../helpers');

module.exports = {
	name: 'modalSubmit',
	async execute(modal, client) {
		let id = modal.customId;
		let msgid = id.split('-')[1];
		let wasAnswerwed = id.split('-')[0] == 'Yes';

		await sendFeedbackEmbed(
			modal,
			wasAnswerwed,
			modal.fields[0].value,
			msgid,
		);
		modal.update({
			content: 'Thank you! Your response has been recorded.',
			components: [],
			ephemeral: true,
		});
	},
};

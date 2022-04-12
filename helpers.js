const {Interaction, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
let Mixpanel = require('mixpanel');
let mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
let fs = require('fs');

class SessionManager {
	/**
	 * @type Map<string, string[][]>
	 */
	sessions = new Map();

	/**
	 * @type Map<string, Timeout>
	 */
	sessionTimeouts = new Map();

	/**
	 * Add page to user session
	 * @param {string} userID Discord ID
	 * @param {string[]} page Array of category name and page name
	 */
	addSessionPage(userID, page) {
		if (!this.sessions.has(userID)) {
			this.sessions.set(userID, []);
		} else {
			clearTimeout(this.sessionTimeouts.get(userID));
		}
		this.sessions.get(userID).push(page);
		this.sessionTimeouts.set(
			userID,
			setTimeout(() => this.removeSession(userID), 1000 * 60 * 10),
		);
	}

	/**
	 * Get session pages for user
	 * @param {string} userID Discord ID
	 * @returns {string[][] | null} Array of category name and page name, or null if no session
	 */
	getSessionPages(userID) {
		if (!this.sessions.has(userID)) return null;
		return this.sessions.get(userID);
	}

	/**
	 * Remove session
	 * @param {string} userID Discord ID
	 */
	removeSession(userID) {
		clearTimeout(this.sessionTimeouts.delete(userID));
		this.sessionTimeouts.delete(userID);
		this.sessions.delete(userID);
	}
}

let sessions = new SessionManager();

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
	if (feedback) feedback = feedback.replace(/`/g, '\\`');

	let channel = interaction.client.channels.cache.get(process.env.FEEDBACK_CHANNEL);
	let message;

	if (editID) message = await channel.messages.fetch(editID);

	let data;
	try {
		data = fs.readFileSync('feedback_num.txt', 'utf-8');
	} catch (e) {}

	if (!data) data = 1;
	else data = parseInt(data);

	let title;
	if (message) {
		title = message.embeds[0].title;
	} else {
		title = `Feedback #${data}`;
		fs.writeFileSync('feedback_num.txt', (data + 1).toString(), 'utf-8');
	}

	let session = sessions.getSessionPages(interaction.user.id);

  const blacklistButtonRow = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId(`blacklist-${interaction.user.id}`)
        .setLabel('Blacklist User')
        .setStyle('DANGER'),
    );

	let embed = new MessageEmbed()
		.setTitle(title)
		.addFields(
			{
				name: 'Was their question answered?',
				value: wasAnswerwed ? 'Yes' : 'No',
			},
			{
				name: 'Answers viewed',
				value: session
					? session
							.map((x, i) => `${i + 1}. ${x.join(' > ')}`)
							.join('\n')
					: 'Unknown',
			},
			{
				name: 'Additional comment',
				value: feedback || 'None',
			},
		)
		.setFooter({
			text:
				interaction.user.username +
				'#' +
				interaction.user.discriminator +
				' ─ ' +
				interaction.user.id,
			iconURL: interaction.user.displayAvatarURL(),
		})
		.setColor(wasAnswerwed ? '0x3ba45c' : '0xeb4346');

	if (feedback) {
		const blacklistedWords = ['darn', 'shucks'];
		let containedWords = false;
		for (let i = 0; i < blacklistedWords.length; i++) {
			if (feedback.includes(blacklistedWords[i])) containedWords = true;
		}

		const containsLink = feedback.match(/((https:|http:|www\.)\S*)/gm);

		let issues = [];
		if (containsLink) issues.push('`link(s)`');
		if (containedWords) issues.push(`\`blacklisted word(s)\``);
		let sanitizedFeedback = embed.fields[2].value;
		sanitizedFeedback = sanitizedFeedback.replace(
			/((https:|http:|www\.)\S*)/gm,
			'`$1`',
		);
		sanitizedFeedback = sanitizedFeedback.replace(
			/(darn|shucks)/gm,
			'`$1`',
		);

		if (issues.length > 0) {
			embed.fields[2].value = `||${sanitizedFeedback}||`;
			embed.setDescription(
				`:warning: Contains ${issues.join(
					' and ',
				)}. Feedback has been censored`,
			);
		}
	}

	if (message) {
		message = await message.edit({
      embeds: [embed],
      components: [blacklistButtonRow]
    });
	} else {
		message = await channel.send({
			embeds: [embed],
      components: [blacklistButtonRow]
		});
	}

	return message.id;
}

module.exports = {sessions, sendFeedbackEmbed};

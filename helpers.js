const {Interaction, MessageEmbed} = require('discord.js');
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN)
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
  if (feedback) feedback = feedback.replace(/`/g, '\\`')
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
    .setColor(wasAnswerwed ? '0x57F287' : '0xED4245')

    if (!feedback) {
    fs.writeFileSync('feedback_num.txt', JSON.stringify(parseInt(data) + 1), 'utf-8');
  } else {
    const blacklistedWords = ['darn', 'shucks']
    var containedWords = []
    for (var i = 0; i < blacklistedWords.length; i++) {
      console.log(feedback.includes(blacklistedWords[i]))
      if (feedback.includes(blacklistedWords[i])) containedWords.push(blacklistedWords[i])
    }
    const containsLink = feedback.match(/((https:|http:|www\.)\S*)/gm)

    var issues = []
      
    if (containsLink) issues.push('`link(s)`')
    if (containedWords) issues.push(`\`blacklisted word(s)\``)
    var sanitizedFeedback = embed.fields[1].value
    sanitizedFeedback = sanitizedFeedback.replace(/((https:|http:|www\.)\S*)/gm, '`$1`')
    sanitizedFeedback = sanitizedFeedback.replace(/(darn|shucks)/gm, '`$1`')

    if (issues.length > 0) {
      embed.fields[1].value = `||${sanitizedFeedback}||`
      embed.setDescription(`:warning: Contains ${issues.join(' and ')}. Feedback has been censored`)
    }
  }

  
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

const {
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	MessageSelectMenu,
} = require('discord.js');
const {
  Modal,
  TextInputComponent,
  showModal
} = require('discord-modals');
const {
  sendFeedbackEmbed,
  sessions
} = require('../helpers');


const startEmbed = new MessageEmbed();
let resourceRow;
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data.json'));

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, Discord, mixpanel) {
		let categoryRow2 = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('home')
				.setStyle('SECONDARY')
				.setLabel('Home')
				.setEmoji('🏠'),
		);

		let categoryRow4 = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('home')
				.setStyle('SECONDARY')
				.setLabel('Home')
				.setEmoji('🏠'),
			new MessageButton()
				.setCustomId('feedback')
				.setStyle('SUCCESS')
				.setLabel('Give Feedback'),
		);

		let categoryRow3 = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('back')
				.setStyle('PRIMARY')
				.setLabel('Back'),
			new MessageButton()
				.setCustomId('home')
				.setStyle('SECONDARY')
				.setLabel('Home')
				.setEmoji('🏠'),
			new MessageButton()
				.setCustomId('feedback')
				.setStyle('SUCCESS')
				.setLabel('Give Feedback'),
		);

		if (interaction.componentType == 'SELECT_MENU') {
			if (interaction.customId == 'category') {
				mixpanel.track('Category Selected', {
					distinct_id: interaction.user.id,
					item_selected: data[interaction.values[0]].name,
				});
				const selects = data[interaction.values[0]].resources
					.map((u, i) =>
						JSON.parse(
							`{"label":"${u.name}", "value":"${interaction.values[0]}-${i}"}`,
						),
					)
					.sort((a, b) => {
						let textA = a.label.toUpperCase();
						let textB = b.label.toUpperCase();
						return textA < textB ? -1 : textA > textB ? 1 : 0;
					});

				if (selects.length == 1) {
					interaction.update({
						embeds: [
							data[interaction.values[0]].resources[0].embed,
						],
						components: [categoryRow4],
						ephemeral: true,
					});
					mixpanel.track('Resource Selected', {
						distinct_id: interaction.user.id,
						item_selected:
							data[interaction.values[0]].resources[0].name,
					});
					sessions.addSessionPage(interaction.user.id, [
						data[interaction.values[0]].name,
						data[interaction.values[0]].resources[0].name,
					]);
				} else {
					let categoryRow = new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.setCustomId('resources')
							.setPlaceholder('Select a resource')
							.addOptions(selects),
					);
					const categoryEmbed = new MessageEmbed()
						.setColor(0x5865f2)
						.setTitle(data[interaction.values[0]].name);
					if (data[interaction.values[0]].category.url) {
						categoryEmbed.setDescription(
							`Select a resource from the dropdown menu below to get help.\nMore info can be found in the [documentation](${
								data[interaction.values[0]].category.url
							}).`,
						);
					} else {
						categoryEmbed.setDescription(
							`Select a resource from the dropdown menu below to get help.\nMore info can be found in the [documentation](https://docs.carl.gg).`,
						);
					}
					interaction.update({
						embeds: [categoryEmbed],
						components: [categoryRow, categoryRow2],
						ephemeral: true,
					});
				}
			}
			if (interaction.customId == 'resources') {
				const indexes = interaction.values[0].split('-');
				let newSelectMenu = new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId(
							interaction.message.components[0].components[0]
								.customId,
						)
						.setPlaceholder(
							data[indexes[0]].resources[indexes[1]].name,
						)
						.addOptions(
							interaction.message.components[0].components[0]
								.options,
						),
				);
				interaction.update({
					embeds: [data[indexes[0]].resources[indexes[1]].embed],
					components: [newSelectMenu, categoryRow3],
					ephemeral: true,
				});
				mixpanel.track('Resource Selected', {
					distinct_id: interaction.user.id,
					item_selected: data[indexes[0]].resources[indexes[1]].name,
				});
				sessions.addSessionPage(interaction.user.id, [
					data[indexes[0]].name,
					data[indexes[0]].resources[indexes[1]].name,
				]);
			}
		}
		if (interaction.componentType == 'BUTTON') {
			if (interaction.customId == 'start') {
				mixpanel.track('Start Button Clicked', {
					distinct_id: interaction.user.id,
				});
				const selects = data
					.map((u, i) =>
						JSON.parse(
							`{"label":"${u.name.replaceAll(
								`*`,
								``,
							)}", "value":"${i}"}`,
						),
					)
					.sort((a, b) => {
						let textA = a.label.toUpperCase();
						let textB = b.label.toUpperCase();
						return textA < textB ? -1 : textA > textB ? 1 : 0;
					});
				startEmbed.setTitle('Carl-Bot Help Desk');
				startEmbed.setColor(0x5865f2);
				startEmbed.setDescription(
					'Select a category from the dropdown menu below to get help.\n\nCan’t find what you’re looking for? Ask a human in another support channel.\n\nSee <#805888259934257203>',
				);
				resourceRow = new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId('category')
						.setPlaceholder('Nothing Selected')
						.addOptions(selects),
				);
				interaction.reply({
					embeds: [startEmbed],
					components: [resourceRow],
					ephemeral: true,
				});
			} else if (interaction.customId == 'home' || interaction.customId == 'feedbackBack') {
				mixpanel.track('Home Button Clicked', {
					distinct_id: interaction.user.id,
				});
				interaction.update({
					embeds: [startEmbed],
					components: [resourceRow],
					ephemeral: true,
				});
			} else if (interaction.customId == 'back') {
				mixpanel.track('Back Button Clicked', {
					distinct_id: interaction.user.id,
				});
				const placeholder =
					interaction.message.components[0].components[0].placeholder;
				let category;
				for (let i = 0; i < data.length; i++) {
					if (
						data[i].resources.filter(a => a.name == placeholder)
							.length > 0
					) {
						category = data[i];
					}
				}
				let newSelectMenu = new MessageActionRow().addComponents(
					new MessageSelectMenu()
						.setCustomId(
							interaction.message.components[0].components[0]
								.customId,
						)
						.setPlaceholder('Select a resource')
						.addOptions(
							interaction.message.components[0].components[0]
								.options,
						),
				);
				const newEmbed = new MessageEmbed()
					.setTitle(category.name)
					.setDescription(
						`Select a resource from the dropdown menu below to get help.\n\nMore info can be found in the [documentation](${
							category.category.url || 'https://docs.carl.gg'
						}).`,
					);
				interaction.update({
					embeds: [newEmbed],
					components: [newSelectMenu, categoryRow2],
					ephemeral: true,
				});
			} else if (interaction.customId.startsWith('modalYes-')) {
				mixpanel.track('Clicked Modal Open Button', {
					distinct_id: interaction.user.id,
					answered_question: true,
				});
				let msgid = interaction.customId.split('-')[1];
				const modal = new Modal()
					.setCustomId(`Yes-${msgid}`)
					.setTitle('Give us Some Feedback')
					.addComponents(
						new TextInputComponent()
							.setCustomId('justify')
							.setLabel('Your Feedback')
							.setStyle('LONG')
							.setRequired(true),
					);
				showModal(modal, {
					client: client,
					interaction: interaction,
				});
			} else if (interaction.customId.startsWith('modalNo-')) {
				mixpanel.track('Clicked Modal Open Button', {
					distinct_id: interaction.user.id,
					answered_question: true,
				});
				let msgid = interaction.customId.split('-')[1];
				const modal = new Modal()
					.setCustomId(`No-${msgid}`)
					.setTitle('Give us Some Feedback')
					.addComponents(
						new TextInputComponent()
							.setCustomId('justify')
							.setLabel('Your Feedback')
							.setStyle('LONG')
							.setRequired(true),
					);
				showModal(modal, {
					client: client,
					interaction: interaction,
				});
			} else if (interaction.customId == 'feedback') {
        let rawBlacklistedUsers = fs.readFileSync('./blacklisted_users.txt')
        let blacklistedUsers = JSON.parse(rawBlacklistedUsers);
        if (blacklistedUsers.includes(interaction.user.id)) return interaction.reply({
          content: 'You have been blacklisted from using this feature.',
          ephemeral: true
        })
				mixpanel.track('Clicked Feedback Button', {
					distinct_id: interaction.user.id,
				});
				const feedbackButtons = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('feedbackYes')
						.setStyle('SUCCESS')
						.setLabel('Yes'),
					new MessageButton()
						.setCustomId('feedbackNo')
						.setStyle('DANGER')
						.setLabel('No'),
          new MessageButton()
				    .setCustomId('feedbackBack')
				    .setStyle('SECONDARY')
				    .setLabel('Back'),
				);
        
        const isQuestionAnsweredEmbed = new MessageEmbed()
          .setTitle('Automated Support Feedback')
          .setDescription('Did you find what you were looking for?')
          .setColor(0x5865F2)
				interaction.update({
					components: [feedbackButtons],
					embeds: [isQuestionAnsweredEmbed],
					ephemeral: true,
				});
			} else if (interaction.customId == 'feedbackYes') {
				mixpanel.track('Clicked Feedback Description Button', {
					distinct_id: interaction.user.id,
					answered_question: true,
				});
				let msgid = await sendFeedbackEmbed(interaction, true);
				const feedbackYesRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId(`modalYes-${msgid}`)
						.setStyle('SECONDARY')
						.setLabel('Add additional comments (optional)'),
					new MessageButton()
						.setCustomId('submitYes')
						.setStyle('PRIMARY')
						.setLabel('Submit'),
				);
        const questionWasAnsweredEmbed = new MessageEmbed()
          .setTitle('Automated Support Feedback')
          .setDescription('Glad I could help! Feel free to give additional feedback below. If not, just press submit.')
          .setColor(0x5865F2)
				interaction.update({
					embeds: [questionWasAnsweredEmbed],
					components: [feedbackYesRow],
					ephemeral: true,
				});
			} else if (interaction.customId == 'feedbackNo') {
				mixpanel.track('Clicked Feedback Description Button', {
					distinct_id: interaction.user.id,
					answered_question: false,
				});
				let msgid = await sendFeedbackEmbed(interaction, false);
				const feedbackNoRow = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId(`modalNo-${msgid}`)
						.setStyle('SECONDARY')
						.setLabel('Add additional comments (optional)'),
					new MessageButton()
						.setCustomId('submitNo')
						.setStyle('PRIMARY')
						.setLabel('Submit'),
				);

        const questionWasNotAnsweredEmbed = new MessageEmbed()
          .setTitle('Automated Support Feedback')
          .setDescription('Sorry I couldn\'t help! Please ask in another support channel and a human will help you out. Feel free to give additional feedback below. If not, just press submit.')
          .setColor(0x5865F2)
				interaction.update({
					embeds: [questionWasNotAnsweredEmbed],
					components: [feedbackNoRow],
					ephemeral: true,
				});
			} else if (interaction.customId == 'submitNo') {
				mixpanel.track('Clicked Feedback Submit Button', {
					distinct_id: interaction.user.id,
					answered_question: false,
				});
        const feedbackSubmitNo = new MessageEmbed()
          .setTitle('Automated Support Feedback')
          .setDescription('Thank you! Your response has been recorded.')
        .setColor(0x5865F2)
        
				interaction.update({
					embeds: [feedbackSubmitNo],
					components: [],
					ephemeral: true,
				});
				sessions.removeSession(interaction.user.id);
			} else if (interaction.customId == 'submitYes') {
				mixpanel.track('Clicked Feedback Submit Button', {
					distinct_id: interaction.user.id,
					answered_question: true,
				});
        
        const feedbackSubmitYes = new MessageEmbed()
          .setTitle('Automated Support Feedback')
          .setDescription('Thank you! Your response has been recorded.')
        .setColor(0x5865F2)
        
				interaction.update({
					embeds: [feedbackSubmitYes],
					components: [],
					ephemeral: true,
				});
				sessions.removeSession(interaction.user.id);
			} else if (interaction.customId.startsWith('blacklist-')) {
        let userid = interaction.customId.split('-')[1];
        let rawBlacklistedUsers = fs.readFileSync('./blacklisted_users.txt')
        let blacklistedUsers = JSON.parse(rawBlacklistedUsers);

        const blacklistButtonDisabled = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId(`blacklist-disabled`)
              .setLabel('Blacklist User')
              .setDisabled(true)
              .setStyle('DANGER'),
          );
        client.users.fetch(userid).then(async user => {
          await interaction.update({
            components: [blacklistButtonDisabled]
          })
          await interaction.followUp(`**${user.username}** has been blacklisted from sending feedback.`)
          blacklistedUsers.push(userid)
          fs.writeFileSync('./blacklisted_users.txt', JSON.stringify(blacklistedUsers));

          
          
        })
      }
		}
	},
};

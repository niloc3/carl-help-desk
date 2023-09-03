const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	StringSelectMenuBuilder,
} = require('discord.js');

const startEmbed = new EmbedBuilder();
let resourceRow;
const fs = require('fs');
let data = JSON.parse(fs.readFileSync('/home/colin/help-desk/carl-help-desk/data.json'));

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client, Discord, mixpanel) {

		let categoryRow2 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('home')
				.setStyle('Primary')
				.setLabel('Home'),
		);

		let categoryRow4 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('home')
				.setStyle('Primary')
				.setLabel('Home'),
		);

		let categoryRow3 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('back')
				.setStyle('Primary')
				.setLabel('Back'),
			new ButtonBuilder()
				.setCustomId('home')
				.setStyle('Primary')
				.setLabel('Home'),
		);

		if (interaction.componentType == 3) {
			if (interaction.customId == 'category') {
				// mixpanel.track('Category Selected', {
				// 	distinct_id: interaction.user.id,
				// 	item_selected: data[interaction.values[0]].name,
				// });
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
					// mixpanel.track('Resource Selected', {
					// 	distinct_id: interaction.user.id,
					// 	item_selected:
					// 		data[interaction.values[0]].resources[0].name,
					// });

				} else {
					let categoryRow = new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('resources')
							.setPlaceholder('Select a resource')
							.addOptions(selects),
					);
					const categoryEmbed = new EmbedBuilder()
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
				let newSelectMenu = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
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
				// mixpanel.track('Resource Selected', {
				// 	distinct_id: interaction.user.id,
				// 	item_selected: data[indexes[0]].resources[indexes[1]].name,
				// });

			}
		}
		if (interaction.componentType == 2) {
			if (interaction.customId == 'start') {
				// mixpanel.track('Start Button Clicked', {
				// 	distinct_id: interaction.user.id,
				// });
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
				resourceRow = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('category')
						.setPlaceholder('Nothing Selected')
						.addOptions(selects),
				);
				interaction.reply({
					embeds: [startEmbed],
					components: [resourceRow],
					ephemeral: true,
				});
			} else if (
				interaction.customId == 'home'
			) {
				// mixpanel.track('Home Button Clicked', {
				// 	distinct_id: interaction.user.id,
				// });
				interaction.update({
					embeds: [startEmbed],
					components: [resourceRow],
					ephemeral: true,
				});
			} else if (interaction.customId == 'back') {
				// mixpanel.track('Back Button Clicked', {
				// 	distinct_id: interaction.user.id,
				// });
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
				let newSelectMenu = new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
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
				const newEmbed = new EmbedBuilder()
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
			} 
		}
	},
};

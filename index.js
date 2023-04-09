require('dotenv').config()
const fs = require('fs');
const Discord = require("discord.js");
const { Client, GatewayIntentBits  } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    'CHANNEL'
  ],
  allowedMentions: { parse: [], repliedUser: false }
});
const cooldown = new Set();

let mixpanel = require('mixpanel');
mixpanel.init(process.env.MIXPANEL_TOKEN)

client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, Discord, mixpanel, cooldown));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, Discord, mixpanel, cooldown));
	}
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

process.on('unhantdledRejection', error => {
	console.log('Unhandled promise rejection:');
  console.error(error)
});

client.login(process.env.TOKEN)
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.send('hey')
  
});

app.listen(port);
console.log('Server started at port: ' + port);


//---------------------------------------------

const fs = require('fs');
const Discord = require("discord.js");
const { Client, MessageEmbed, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: [
    'CHANNEL'
  ],
  allowedMentions: { parse: [], repliedUser: false }
});
const modal = require('discord-modals')
modal(client)
let Mixpanel = require('mixpanel');
let mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN)

client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, Discord, mixpanel));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, Discord, mixpanel));
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
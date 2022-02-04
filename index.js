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
const axios = require("axios");
const { Client, MessageEmbed, Intents } = require("discord.js");
const backup = require("discord-backup")
const schedule = require('node-schedule');
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: [
    'CHANNEL'
  ]
});
client.login(process.env.TOKEN)

client.commands = new Discord.Collection();


client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, Discord));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, Discord));
	}
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}



process.on('unhandledRejection', error => {
	console.log('Unhandled promise rejection:');
  console.error(error)
});
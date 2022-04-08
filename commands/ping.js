module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
    if (message.author.id !== '626916199783071750') return;
		message.channel.send('Pong.');
	},
};
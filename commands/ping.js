module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, client) {
    if (!message.member.roles.cache.has(process.env.MODROLE)) return;
		message.channel.send('Loading data').then (async (msg) =>{
    msg.delete()
    message.channel.send(`🏓Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  })
	},
};
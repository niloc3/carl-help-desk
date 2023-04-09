const fs = require('fs')
const prefix = `,`
module.exports = {
    name: 'messageCreate',
    execute(message, client, Discord, mixpanel, cooldown) {
        const replyPingEmbed = new Discord.EmbedBuilder()
        .setTitle(`Oi <a:pingSockRed:551609387660214302>`)
        .setDescription('It appears you are pinging someone using the reply feature.\nPlease make sure you turn **off** the author mention before sending the message.')
        .setImage(`https://i.imgur.com//2yd71kA.png`)
        .setColor(0xD0021B)
        .setFooter({text: `Refer to rule 3, we will reply when we get to it, we don't want to be pinged.`})
        
      
        if (message.reference && message.mentions.users.has(message.mentions.repliedUser?.id) && !new RegExp(`<@!?${message.mentions.repliedUser?.id}>`).test(message.content)) {
          if (message.member.roles.cache.has('209797471608635392') || // Moderators
              message.member.roles.cache.has('195025754864484352') || // Dev
              message.member.roles.cache.has('219776153613893632')) return // Administrators
          if (message.mentions.repliedUser?.id == '235148962103951360') return // Ignore replies to carl
          if (cooldown.has(message.author.id)) {
            
          } else {
          // message.reply({
          //   embeds: [replyPingEmbed],
          //   allowed_mentions: {
          //     replied_user: false
          //   },
          // })
            cooldown.add(message.author.id);
            setTimeout(() => {
              cooldown.delete(message.author.id);
            }, 60000);
          }

        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return;

        try {
            client.commands.get(command).execute(message, args, client);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }

    },
};
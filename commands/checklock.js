const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: 'checklock',
	execute(message, args) {
    console.log(PermissionsBitField)
    if (!message.member.permissions.has([PermissionsBitField.Flags.BanMembers])) return;

    const server = message.guild
		const role = server.roles.everyone;  // the @everyone role's ID is the same as the server ID.

    let perms = role.permissions

    let flagsArr = perms.toArray() // array containing flags names or role perm

    const sendMsg = 'SEND_MESSAGES'

    let isLocked = !flagsArr.includes(sendMsg)
		// Checks if the everyone role doesn't have the permission to send messages, so if the server is locked

		let outputMsg = {
			locked: {
				title: ":lock: Locked",
				description: "The `@everyone` role is **not** able to `Send Messages`, therefore the server is currently **locked**."
			},
			notLocked: {
				title: ":unlock: Not Locked",
				description: "The `@everyone` role **is** able to `Send Messages`, therefore the server is **not locked**."
			}
		}

    let emTitle = isLocked ? outputMsg.locked.title : outputMsg.notLocked.title
		let emDesc = isLocked ? outputMsg.locked.description : outputMsg.notLocked.description

    let embed = {
			color: 0x2f3136,
			title: emTitle,
			description: emDesc
		}

		return message.channel.send({embeds: [embed]})

    
	},
};
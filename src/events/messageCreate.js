const { EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'messageCreate',
	once: false,

	execute: (message, client) => {

		if (message.author.bot == true) return;
		if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content.trim())) {

			const embed = new EmbedBuilder()
				.setTitle('Hello there!')
				.setDescription('I\'m the bot for Discord Creators! I operate on slash commands, so enter a slash (`/`) to use my features! You can start with `/help`!')
				.setColor('#7289DA');

			message.channel.send({ embeds: [embed] });

		}
	},
};

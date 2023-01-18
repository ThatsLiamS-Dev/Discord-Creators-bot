const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


const fitString = (str, length) => (str + ' '.repeat(length -= str.length));
const makeGrid = (results) => {
	const rows = [];

	for (let y = 0; y < results[0].length; y++) {
		const values = [y + 1];

		for (let x = 0; x < 3; x++) {
			if (x == '0') {
				const num = results[x][y].toString();
				values.push(`${num.length == 2 ? 0 + num.toString() : num.toString()} ms  `);
			}
			else { values.push(fitString(results[x][y].toString(), [8, 7, 7][x])); }
		}
		rows[y] = `| ${values[0]}  |  ${values[1]}|   ${values[2]}|  ${values[3]}|`;
	}

	const border = '+----+----------+----------+---------+';
	const title = '| ID |   PING   | SERVERS  |  USERS  |';

	return [border, title, border].concat(rows).concat(border).join('\n');
};


module.exports = {
	name: 'about',
	description: 'Shows lots of cool information about the bot!',
	usage: '/about',

	permissions: [],
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Shows lots of cool information about the bot!')
		.setDMPermission(false),

	execute: async ({ interaction, client }) => {

		/* Gather stats from across ALL Shards */
		const promises = [
			[client.ws.ping],
			[client.guilds.cache.size],
			[client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)],

			client.shard.fetchClientValues('ws.ping'),
			client.shard.fetchClientValues('guilds.cache.size'),
			client.shard.broadcastEval(() => this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
		];
		const results = await Promise.all(promises);

		/* Formats the data into an Embed */
		const embed = new EmbedBuilder()
			.setTitle('My Information')
			.setColor('Green')
			.setDescription('Hey, I\'m **' + client.user.username + '**!\n```\n' + makeGrid(results) + '```')
			.addFields(
				{ name: '**Total Servers:**', value: results[1].reduce((acc, guildCount) => acc + guildCount, 0).toString(), inline: true },
				{ name: '**Total Users:**', value: results[2].reduce((acc, memberCount) => acc + memberCount, 0).toString(), inline: true },
				{ name: '**Total Commands:**', value: '5', inline: true },

				{ name: '**Uptime:**', value: `\`${Math.floor(client.uptime / 86400000)}d ${Math.floor(client.uptime / 3600000) % 24}h ${Math.floor(client.uptime / 60000) % 60}m ${Math.floor(client.uptime / 1000) % 60}s\``, inline: true },
				{ name: '**Shard ID:**', value: '`#1 of 1`', inline: true },
				{ name: '**Developer:**', value: '**[ThatsLiamS#6950](https://liamskinner.co.uk)**', inline: true },
			)
			.setFooter({ text: 'Do /help to get started.' });

		interaction.followUp({ embeds: [embed] });
		return true;

	},
};
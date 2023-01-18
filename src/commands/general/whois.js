const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
	name: 'whois',
	description: 'Shows information about a user',
	usage: '/whois [user]',

	permissions: [],
	defer: { defer: true, ephemeral: false },

	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Shows information about a user!')

		.setDMPermission(false)
		// .setDefaultMemberPermissions()
		.addUserOption(option => option.setName('user').setDescription('The user to fetch the information for').setRequired(false)),

	execute: async ({ interaction }) => {

		const member = interaction.options.getMember('user') || interaction.member;
		const user = await member.user.fetch(true);

		const ageTimestamp = new Date() - member.joinedTimestamp;
		const age = `${Math.floor(ageTimestamp / 86400000)}d ${Math.floor(ageTimestamp / 3600000) % 24}h ${Math.floor(ageTimestamp / 60000) % 60}m ${Math.floor(ageTimestamp / 1000) % 60}s`;

		const roles = [];
		member.roles.cache.forEach(r => roles.push(r.toString()));

		const embed = new EmbedBuilder()
			.setColor(user.hexAccentColor)
			.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.displayAvatarURL() })
			.setTitle(`${member.displayName}'s Information`)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: '**Username**', value: `${user.username}`, inline: true },
				{ name: '**User ID**', value: `${user.id}`, inline: true },
				{ name: '**Account Ping**', value: `${user}`, inline: true },

				{ name: '**Created At**', value: `${moment(user.createdAt).format('DD/MM/YYYY LTS')}`, inline: true },
				{ name: '**Joined At**', value: `${moment(member.joinedAt).format('DD/MM/YYYY LTS')}`, inline: true },
				{ name: '**Server Age**', value: `${age}`, inline: true },

				{ name: '**Roles**', value: `${roles.join(' ')}`, inline: false },
			)
			.setFooter({ text: `Requested by ${interaction.member.user.tag}, ID ${interaction.member.id}` })
			.setTimestamp();


		interaction.reply({ embeds: [embed] });

	},
};


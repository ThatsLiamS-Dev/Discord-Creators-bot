const { InteractionType } = require('discord.js');

module.exports = {
	name: 'interactionCreate',
	once: false,

	execute: async (interaction, client) => {

		/* Is the interaction an ApplicationCommand? */
		if (interaction.type === InteractionType.ApplicationCommand) {

			const cmd = client.commands.get(interaction.commandName);
			if (!cmd) return;

			if (cmd['error'] == true) {
				interaction.reply({ content: 'Sorry, this command is currently unavailable. Please try again later.', ephemeral: true });
				return;
			}

			/* Does the command need deferring */
			if (cmd['defer']['defer'] == true) await interaction.deferReply({ ephemeral: cmd['defer']['ephemeral'] ? true : false });

			/* Executes command file */
			await cmd.execute({ interaction, client });

		}

	},
};

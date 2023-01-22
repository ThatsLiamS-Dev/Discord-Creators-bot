const { InteractionType, Collection } = require('discord.js');
const { formatTime } = require('./../utils/functions.js');
const cooldowns = new Collection();

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

			/* Work out the appropriate cooldown time */
			if (!cooldowns.has(cmd.name)) cooldowns.set(cmd.name, new Collection());
			const timestamps = cooldowns.get(cmd.name);
			const cooldownAmount = (cmd?.cooldown?.time || 0) * 1000;

			/* Are they in the cooldown */
			if (timestamps.has(interaction.user.id)) {

				/* How long is left? */
				const expiration = Number(timestamps.get(interaction.user.id)) + Number(cooldownAmount);
				const secondsLeft = Math.floor((Number(expiration) - Number(Date.now())) / 1000);

				/* Alert the user */
				interaction.reply({ content: `Please wait **${formatTime(secondsLeft > 1 ? secondsLeft : 1)}** to use this command again.` });
				return false;
			}


			/* Does the command need deferring */
			if (cmd['defer']['defer'] == true) await interaction.deferReply({ ephemeral: cmd['defer']['ephemeral'] ? true : false });


			/* Execute the command file */
			try {
				cmd.execute({ interaction, client }).then((res) => {
					if (res == true) {
						/* Set and delete the cooldown */
						timestamps.set(interaction.user.id, Date.now());
						setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
					}
				}).catch((err) => console.log(err));
			}
			catch (err) { console.log(err); }

		}

	},
};

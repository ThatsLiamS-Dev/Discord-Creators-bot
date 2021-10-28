const time = new Date();
console.log(`Last restart: ${time.getHours()}:${time.getMinutes()}, ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`);


const Discord = require('discord.js');
const client = new Discord.Client({
	intents: ['GUILD_MESSAGES'],
	partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
});


const fs = require('fs');

const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`${__dirname}/events/${file}`);
	if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
	else client.on(event.name, (...args) => event.execute(...args, client));
}


require('dotenv').config();
client.login(process.env['BotToken']);

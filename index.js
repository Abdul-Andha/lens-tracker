//Requires
require('dotenv').config();
const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');

//Setting new client
const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});

//Message Command Handler
bot.msgCommands = new Collection();
const msgCommandFiles = fs.readdirSync('./msgCommands/').filter(file => file.endsWith('.js'));
for (const file of msgCommandFiles) {
	const command = require(`./msgCommands/${file}`);
	bot.msgCommands.set(command.name, command);
}

//Event Handler
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args))
	} else if (event.name === "messageCreate") {
		bot.on("messageCreate", receivedMessage => event.execute(receivedMessage, bot.msgCommands, bot))
	} else {
		bot.on(event.name, (...args) => event.execute(...args, commands))
	}

}

//Login
bot.login(process.env.TOKEN);
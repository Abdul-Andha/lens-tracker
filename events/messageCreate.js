const { Collection } = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./../creds.json') || process.env.creds;
let doc;

const prefix = "`";
module.exports = {
  name: "messageCreate",
  async execute(receivedMessage, commands, bot) {
    if (receivedMessage.author.bot)
      return;
    if (receivedMessage.content.startsWith(prefix)) {
      doc = new GoogleSpreadsheet('1R62604Ce737T8xCprDFvCaNoJhZ-63V_VmtSGfgVHvY');
      await doc.useServiceAccountAuth(creds);
      processCommand(receivedMessage, commands, bot);
    }
  }
}

function processCommand(receivedMessage, commands, bot) {
	let fullCommand = receivedMessage.content.substr(1);
	let splitCommand = fullCommand.split(" ");
	let mainCommand = splitCommand[0].toLowerCase();
	let args = splitCommand.slice(1);
	if (mainCommand === "ping")
		commands.get('ping').execute(receivedMessage);
	else if (mainCommand === "wearlens" || mainCommand === "wl")
    commands.get('wearLens').execute(receivedMessage, doc);
	else if (mainCommand === "removeLens" || mainCommand === "rl")
    commands.get('removeLens').execute(receivedMessage, doc);
	else receivedMessage.channel.send("Unknown Command");
}
const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Setlogs extends Command {
  constructor(client) {
    super(client, {
      name: "setlogs",
      description: "Setup un channel de logs",
      usage: "setlogs [#channel]",
      aliases: [
        "setlog",
        "setuplogs",
        "setuplog",
        "setlogschannel",
        "setlogchannel"
      ],
      permLevel: "Staff"
    });
  }

  async run(message, args) {}
}

module.exports = Setlogs;

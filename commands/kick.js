const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Kick extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Affiche des infos sur les utilisateurs d'un serveur",
      usage: "kick <utilisateur> [raison]",
      aliases: ["mc", "members"]
    });
  }

  run(message, args) {}
}

module.exports = Kick;

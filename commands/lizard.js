const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Lizard extends Command {
  constructor(client) {
    super(client, {
      name: "lizard",
      description: "Affiche une image de lézard aléatoire",
      usage: `lizard`,
      aliases: ["lezard"]
    });
  }

  run(message, args) {
    try {
      get("https://nekos.life/api/v2/img/lizard").then(res => {
        const lizardEmbed = new MessageEmbed()
          .setColor("#eeaa22")
          .setTitle("🦎 Lézard")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        return message.channel.send(lizardEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Lizard;

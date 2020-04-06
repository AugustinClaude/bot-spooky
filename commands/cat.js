const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Cat extends Command {
  constructor(client) {
    super(client, {
      name: "cat",
      description: "Affiche une image de chat aléatoire",
      usage: `cat`,
      aliases: ["chat"]
    });
  }

  run(message, args) {
    try {
      get(
        "https://aws.random.cat/meow" || "https://nekos.life/api/v2/img/meow"
      ).then(res => {
        const catEmbed = new MessageEmbed()
          .setColor("#88aa44")
          .setTitle("🐱 Chat")
          .setImage(res.body.file || res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        return message.channel.send(catEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Cat;

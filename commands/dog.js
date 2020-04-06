const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Dog extends Command {
  constructor(client) {
    super(client, {
      name: "dog",
      description: "Affiche une image de chien aléatoire",
      usage: `dog`,
      aliases: ["chien"]
    });
  }

  run(message, args) {
    try {
      get("http://random.dog/woof.json").then(res => {
        const dogEmbed = new MessageEmbed()
          .setColor("#eeaa22")
          .setTitle("🐶 Chien")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        return message.channel.send(dogEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Dog;

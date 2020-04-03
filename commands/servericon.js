const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Servericon extends Command {
  constructor(client) {
    super(client, {
      name: "servericon",
      description: "Affiche l'icône du serveur",
      usage: `servericon`,
      aliases: ["icon", "i"]
    });
  }

  run(message, args) {
    const iconEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setColor("#8877ee")
      .setImage(message.guild.iconURL())
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp();
    message.channel.send(iconEmbed);
  }
}

module.exports = Servericon;

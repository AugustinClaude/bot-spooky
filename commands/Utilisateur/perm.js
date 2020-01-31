const Command = require("../../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Perm extends Command {
  constructor(client) {
    super(client, {
      name: "perm",
      description: "Affiche votre niveau de permission.",
      usage: "perm",
      guildOnly: true,
      aliases: ["perms", "myperm", "permission"]
    });
  }

  run(message, args, level) {
    const perm = this.client.config.permLevels.find(l => l.level === level)
      .name;
    const permEmbed = new MessageEmbed()
      .setAuthor(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .setTitle("📕 Permissions")
      .addField("▶️ Niveau de permission", level)
      .addField("📝 Nom de la permission", perm)
      .setColor("#9988ff")
      .setFooter(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL()
      )
      .setTimestamp();
    message.channel.send(permEmbed);
  }
}

module.exports = Perm;

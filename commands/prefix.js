const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const sql = require("../sql.js");

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      description: "Affiche le prefix actuel du serveur",
      usage: "prefix",
    });
  }

  async run(message, args) {
    sql.guildSettings(message.guild.id, async (err, results) => {
      let custom_prefix = results[0].prefix;

      const prefEmbed = new MessageEmbed()
        .setAuthor(
          `Demandé par ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          `Pour plus d'aide, faites \`${message.settings.prefix}help\``
        )
        .addField("💻 **Préfix :**", `\`${message.settings.prefix}\``)
        .setColor("#ddaaff")
        .setFooter(
          this.client.user.username + " ©",
          this.client.user.displayAvatarURL()
        )
        .setTimestamp();

      if (custom_prefix !== message.settings.prefix)
        prefEmbed.addField(
          "🗂️ **Préfix du serveur** (modifiable avec la commande setprefix)",
          `\`${custom_prefix}\``
        );

      return message.channel.send(prefEmbed);
    });
  }
}

module.exports = Prefix;

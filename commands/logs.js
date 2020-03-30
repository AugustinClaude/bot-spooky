const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const db = require("../db.js");

class Logs extends Command {
  constructor(client) {
    super(client, {
      name: "logs",
      description: "Affiche les infos sur le channel de logs",
      usage: "logs",
      aliases: ["log", "logsinfo", "loginfo"],
      permLevel: "Staff"
    });
  }

  async run(message, args) {
    // Récupération des infos du channel de logs

    const logsEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .addField("\u200B", "\u200B")
      .setColor("#55d55d")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("📜 Logs");

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      logsEmbed
        .addField("#️⃣ Channel de logs", `<#${logChannel.id}>`)
        .addField("🏷️ Nom", logChannel.name)
        .addField("✏️ Id", logChannel.id);
      message.channel.send(logsEmbed);
    });
  }
}

module.exports = Logs;

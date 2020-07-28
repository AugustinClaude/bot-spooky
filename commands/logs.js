const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const db = require("../db/db.js");

class Logs extends Command {
  constructor(client) {
    super(client, {
      name: "logs",
      description: "Affiche les infos sur le channel de logs",
      usage: "logs",
      aliases: ["log", "logsinfo", "loginfo"],
      permLevel: "Staff",
    });
  }

  async run(message, args) {
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

    // Récupération des infos du channel de logs

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      let channel;

      if (
        results[0].logChannel_id == undefined ||
        results[0].logChannel_name == undefined
      ) {
        channel = ":warning:  Il n'y a pas de channel de logs";
      } else {
        channel = `<#${logChannel.id}>`;
        logsEmbed
          .addField("✏️ Id", logChannel.id, true)
          .addField("🏷️ Nom", logChannel.name, true)
          .addField("\u200B", "\u200B");
      }

      logsEmbed.addField("#️⃣ Channel de logs", channel);

      message.channel.send(logsEmbed);
    });
  }
}

module.exports = Logs;

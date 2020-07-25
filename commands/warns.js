const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("../db.js");

class Warns extends Command {
  constructor(client) {
    super(client, {
      name: "warns",
      description: "Affiche les infos à propos des warns d'un utilisateur",
      usage: "warns",
      aliases: ["warnings", "warning", "warnlist"],
      permLevel: "Mod",
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let warnUser;
    try {
      warnUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) warnUser = message.member;
      else if (!warnUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      warnUser = message.member;
    }

    const warnEmbed = new MessageEmbed()
      .setAuthor(
        warnUser.user.tag,
        warnUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(warnUser.user.displayAvatarURL({ dynamic: true }))
      .setColor("#66ccff")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("❌ Warns");

    // Récupération des infos à propos des warns d'un utilisateur

    let getWarnSetting = `SELECT * FROM warns WHERE guild_id = '${message.guild.id}' AND user_id = '${warnUser.id}';`;

    db.query(getWarnSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      if (results[0] == undefined)
        warnEmbed.setDescription(":warning: Aucun warns");
      else {
        warnEmbed.addField(
          "⚠️ Membre warn",
          `${results[0].user_name} (ID: ${results[0].user_id})`
        );

        for (let i = 0; i < results.length; i++) {
          warnEmbed
            .addField("\u200B", "\u200B")
            .addField(
              `❓ Warn (ID: ${results[i].id})`,
              `${results[i].warn_reason} | ${moment(
                results[i].createdAt
              ).format("Do MMMM YYYY à LTS")}\n\n**Warn par :**\n${
                results[i].warner_name
              } (ID: ${results[i].warner_id})`
            );
        }
      }

      message.channel.send(warnEmbed);
    });
  }
}

module.exports = Warns;

const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("../db/db.js");

class DelWarn extends Command {
  constructor(client) {
    super(client, {
      name: "delwarn",
      description: "Supprime un warn d'un utilisateur",
      usage: "delwarn <utilisateur> <id du warn>",
      permLevel: "Staff",
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
      if (!args[0] || !warnUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    let warnMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");

    if (isNaN(args[1]))
      return message.channel.send(":x: L'ID doit être un nombre !");

    const delwarnEmbed = new MessageEmbed()
      .setTitle(`✅ Suppression de warn d'ID ${args[1]}`)
      .setColor("#66cc44")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "⚠️ Membre concerné",
        `**${warnUser.user.username}** (ID: ${warnUser.id})`
      )
      .addField(
        "🌀 Warn supprimé par",
        `${message.author} (ID: ${message.author.id})`
      )
      .addField("🕑 Warn supprimé le", warnMoment)
      .setAuthor(
        `${warnUser.user.tag}`,
        warnUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(warnUser.user.displayAvatarURL());

    // Récupération des infos du channel de logs

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, async function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      // Récupération de la raison du warn supprimé
      let getWarnInfo = `SELECT * FROM warns WHERE id = '${args[1]}';`;
      db.query(getWarnInfo, function (err, results, fields) {
        if (err) console.log(err.message);
        //console.log(results);
        if (results[0] == undefined) return;

        message.channel.send(
          `:white_check_mark: Le warn d'ID \`${args[1]}\` de **${warnUser.user.username}** a été supprimé avec succès par **${message.author.username}**`
        );

        warnUser.send(
          `:warning: Votre warn d'ID \`${args[1]}\` du serveur **${message.guild.name}** a été supprimé avec succès par **${message.author.username}**\n\nLa raison de celui-ci était : \`${results[0].warn_reason}\``
        );
      });

      if (logChannel) {
        db.query(getWarnInfo, function (err, results, fields) {
          if (err) console.log(err.message);
          //console.log(results);
          if (results[0] == undefined)
            return message.channel.send(
              ":x: Cette ID n'est pas attribuée à un warn existant !"
            );

          delwarnEmbed.addField(
            "❓ La raison du warn était",
            results[0].warn_reason
          );
          logChannel.send(delwarnEmbed);
        });
      } else
        message.channel.send(
          `⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${message.settings.prefix}setlogs <#channel>\``
        );

      // Suppression du warn de la db

      let delWarn = `DELETE FROM warns WHERE id = '${args[1]}';`;
      db.query(delWarn, function (err, results, fields) {
        if (err) console.log(err.message);

        //console.log(results);
      });
    });
  }
}

module.exports = DelWarn;

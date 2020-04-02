const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("../db.js");

class Warn extends Command {
  constructor(client) {
    super(client, {
      name: "warn",
      description: "Warn un utilisateur",
      usage: "warn <utilisateur> [raison]",
      permLevel: "Mod"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let warnUser;
    try {
      warnUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !warnUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    let warnMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");
    let warnReason = `${args.join(" ").slice(args[0].length + 1)}`;

    if (!warnReason) {
      warnReason = "❌ Aucune raison spécifiée";
    }

    const warnEmbed = new MessageEmbed()
      .setTitle("❌ Warn")
      .setColor("#f2b63b")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "⚠️ Membre warn",
        `**${warnUser.user.username}** (ID: ${warnUser.id})`
      )
      .addField("🌀 Warn par", `${message.author} (ID: ${message.author.id})`)
      .addField("🕑 Warn le", warnMoment)
      .addField("💬 Channel", message.channel)
      .addField("❓ Raison", warnReason)
      .setAuthor(
        `${warnUser.user.tag}`,
        warnUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(warnUser.user.displayAvatarURL());

    // Récupération des infos du channel de logs

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, async function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      if (logChannel) {
        logChannel.send(warnEmbed);
      } else message.channel.send(`⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${this.client.config.defaultSettings.prefix}setlogs [#channel]\``);

      message.channel.send(
        `:white_check_mark: **${warnUser.user.username}** a été **warn** avec succès pour la raison suivante :\n\`${warnReason}\``
      );
      warnUser.send(
        `:warning: Vous avez été **warn** du serveur **${message.guild.name}** par **${message.author.username}** pour la raison suivante :\n\`${warnReason}\``
      );
    });

    // Stockage des warns dans la db

    let setWarnSettings = `INSERT INTO warns(guild_id, guild_name, user_id, user_name, warn_reason, warner_id, warner_name) VALUES('${message.guild.id}', '${message.guild.name}', '${warnUser.id}', '${warnUser.user.username}', '${warnReason}', '${message.author.id}', '${message.author.username}')`;
    db.query(setWarnSettings, async function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
    });
  }
}

module.exports = Warn;

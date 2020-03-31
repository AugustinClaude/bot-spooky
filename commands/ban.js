const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const db = require("../db.js");

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: "ban",
      description:
        "Ban un utilisateur définitivement où pendant un temps donné",
      usage: "ban <utilisateur> [temps] [raison]",
      permLevel: "Staff"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let bannedUser;
    try {
      bannedUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !bannedUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    if (
      bannedUser.hasPermission(
        "MANAGE_GUILD" ||
          "KICK_MEMBERS" ||
          "BAN_MEMBERS" ||
          "MANAGE_MESSAGES" ||
          "ADMINISTRATOR"
      )
    ) {
      return message.reply(":x: Vous ne pouvez pas bannir cette personne !");
    }

    let TimeUntilUnban = false;
    let bannedReason;
    let bannedTime;
    let bannedTime_Txt;
    let bannedMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");
    let unbanMoment;

    try {
      bannedTime = ms(ms(args[1]));
      bannedTime_Txt = `\`${bannedTime}\``;
      bannedReason = `${args
        .join(" ")
        .slice(args[0].length + args[1].length + 2)}`;
      TimeUntilUnban = true;
      unbanMoment = moment(message.createdAt)
        .add(ms(args[1]), "milliseconds")
        .format("Do MMMM YYYY à LTS");
    } catch (e) {
      bannedTime = ":x: Indéfinie";
      bannedTime_Txt = "une durée indéfinie";
      bannedReason = `${args.join(" ").slice(args[0].length + 1)}`;
      TimeUntilUnban = false;
    }

    if (!bannedReason) {
      bannedReason = "❌ Aucune raison spécifiée";
    }

    const bannedEmbed = new MessageEmbed()
      .setTitle("❌ Ban")
      .setColor("#ff4a4a")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "⛔ Membre banni",
        `**${bannedUser.user.username}** (ID: ${bannedUser.id})`
      )
      .addField("🌀 Banni par", `${message.author} (ID: ${message.author.id})`)
      .addField("🕑 Banni le", bannedMoment)
      .addField("⏳ Durée", bannedTime)
      .addField("💬 Channel", message.channel)
      .addField("❓ Raison", bannedReason)
      .setAuthor(
        `${bannedUser.user.tag}`,
        bannedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(bannedUser.user.displayAvatarURL());

    const unbanEmbed = new MessageEmbed()
      .setTitle("✅ Unban")
      .setColor("#66cc44")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "⛔ Membre unban",
        `**${bannedUser.user.username}** (ID: ${bannedUser.id})`
      )
      .addField("🕑 Unban le", unbanMoment)
      .addField("❓ Raison", "Expiration du bannissement")
      .setAuthor(
        `${bannedUser.user.tag}`,
        bannedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(bannedUser.user.displayAvatarURL());

    // Création d'une invitation

    let channel = message.guild.channels.cache
      .filter(
        channel =>
          channel.type === "text" &&
          channel
            .permissionsFor(message.guild.me)
            .has(["VIEW_CHANNEL", "SEND_MESSAGES"])
      )
      .random();
    let link;
    const invite = await channel
      .createInvite({ maxAge: 0, maxUses: 0 })
      .then(invite => {
        link = invite.code;
      });

    // Récupération des infos du channel de logs

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      if (logChannel) {
        logChannel.send(bannedEmbed);
      } else message.channel.send(`⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${this.client.config.defaultSettings.prefix}setlogs [#channel]\``);

      message.guild.member(bannedUser).ban(bannedReason);
      message.channel.send(
        `:white_check_mark: **${bannedUser.user.username}** a été **banni** avec succès pendant ${bannedTime_Txt} pour la raison suivante :\n\`${bannedReason}\``
      );
      bannedUser.send(
        `:warning: Vous avez été **banni** du serveur **${message.guild.name}** pendant ${bannedTime_Txt} par **${message.author.username}** pour la raison suivante :\n\`${bannedReason}\`\n\nVous pourrez rejoindre le serveur à nouveau lorsque vous serez unban (un message vous sera alors envoyé) : https://discord.gg/${link}`
      );

      if (TimeUntilUnban == true) {
        setTimeout(() => {
          message.guild.members.unban(bannedUser.id);

          message.channel.send(
            `✅ **${bannedUser.user.username}** a été **unban** car le bannissement a expiré`
          );
          bannedUser.send(
            `:white_check_mark: Vous avez été **unban** du serveur **${message.guild.name}** car votre bannissement a expiré`
          );
          if (logChannel) logChannel.send(unbanEmbed);
        }, ms(args[1]));
      }
    });
  }
}

module.exports = Ban;

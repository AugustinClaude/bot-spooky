const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const db = require("../db.js");

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: "mute",
      description:
        "Mute un utilisateur définitivement où pendant un temps donné",
      usage: "mute <utilisateur> [temps] [raison]",
      permLevel: "Mod"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let mutedUser;
    try {
      mutedUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !mutedUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    if (
      mutedUser.hasPermission(
        "MANAGE_GUILD" ||
          "KICK_MEMBERS" ||
          "BAN_MEMBERS" ||
          "MANAGE_MESSAGES" ||
          "ADMINISTRATOR"
      )
    ) {
      return message.reply(":x: Vous ne pouvez pas mute cette personne !");
    }

    let TimeUntilUnmute = false;
    let mutedReason;
    let muteTime;
    let muteTime_Txt;
    let mutedMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");
    let unmuteMoment;

    try {
      muteTime = ms(ms(args[1]));
      muteTime_Txt = `\`${muteTime}\``;
      mutedReason = `${args
        .join(" ")
        .slice(args[0].length + args[1].length + 2)}`;
      TimeUntilUnmute = true;
      unmuteMoment = moment(message.createdAt)
        .add(ms(args[1]), "milliseconds")
        .format("Do MMMM YYYY à LTS");
    } catch (e) {
      muteTime = ":x: Indéfinie";
      muteTime_Txt = "une durée **indéfinie**";
      mutedReason = `${args.join(" ").slice(args[0].length + 1)}`;
      TimeUntilUnmute = false;
    }

    if (!mutedReason) {
      mutedReason = "❌ Aucune raison spécifiée";
    }

    const mutedEmbed = new MessageEmbed()
      .setTitle("❌ Mute")
      .setColor("#ff4a4a")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "🔇 Membre muté",
        `**${mutedUser.user.username}** (ID: ${mutedUser.id})`
      )
      .addField("🌀 Mute par", `${message.author} (ID: ${message.author.id})`)
      .addField("🕑 Mute le", mutedMoment)
      .addField("⏳ Durée", muteTime)
      .addField("💬 Channel", message.channel)
      .addField("❓ Raison", mutedReason)
      .setAuthor(
        `${mutedUser.user.tag}`,
        mutedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(mutedUser.user.displayAvatarURL());

    const unmuteEmbed = new MessageEmbed()
      .setTitle("✅ Unmute")
      .setColor("#66cc44")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "🔊 Membre unmute",
        `**${mutedUser.user.username}** (ID: ${mutedUser.id})`
      )
      .addField("🕑 Unmute le", unmuteMoment)
      .addField("❓ Raison", "Expiration du mute")
      .setAuthor(
        `${mutedUser.user.tag}`,
        mutedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(mutedUser.user.displayAvatarURL());

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
        logChannel.send(mutedEmbed);
      } else message.channel.send(`⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${this.client.config.defaultSettings.prefix}setlogs [#channel]\``);

      let muteRole = message.guild.roles.cache.find(n => n.name === "Mute");
      if (!muteRole) {
        try {
          muteRole = await message.guild.roles.create({
            data: {
              name: "Mute",
              color: "#d83f3b",
              permissions: []
            }
          });
          message.guild.channels.cache.forEach(async (channel, id) => {
            await channel.overwritePermissions(muteRole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        } catch (e) {
          console.log(e.stack);
        }
      }

      await mutedUser.roles.add(muteRole.id);
      message.channel.send(
        `:white_check_mark: **${mutedUser.user.username}** a été **mute** avec succès pendant ${muteTime_Txt} pour la raison suivante :\n\`${mutedReason}\``
      );
      mutedUser.send(
        `:warning: Vous avez été 🔇 **mute** du serveur **${message.guild.name}** pendant ${muteTime_Txt} par **${message.author.username}** pour la raison suivante :\n\`${mutedReason}\``
      );

      if (TimeUntilUnmute == true) {
        setTimeout(() => {
          mutedUser.roles.remove(muteRole.id);

          message.channel.send(
            `:white_check_mark: **${mutedUser.user.username}** a été 🔊 **unmute** car son mute a expiré`
          );
          mutedUser.send(
            `:white_check_mark: Vous avez été **unmute** du serveur **${message.guild.name}** car votre mute a expiré`
          );
          if (logChannel) logChannel.send(unmuteEmbed);
        }, ms(args[1]));
      }
    });
  }
}

module.exports = Mute;

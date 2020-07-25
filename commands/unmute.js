const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("../db.js");

class Unmute extends Command {
  constructor(client) {
    super(client, {
      name: "unmute",
      description: "Unmute un utilisateur",
      usage: "unmute <utilisateur> [raison]",
      permLevel: "Staff",
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let unmutedUser;
    try {
      unmutedUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !unmutedUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    let unmuteMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");

    let unmutedReason = `${args.join(" ").slice(args[0].length + 1)}`;
    if (!unmutedReason) {
      unmutedReason = "❌ Aucune raison spécifiée";
    }

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
        `**${unmutedUser.user.username}** (ID: ${unmutedUser.id})`
      )
      .addField("🌀 Unmute par", `${message.author} (ID: ${message.author.id})`)
      .addField("🕑 Unmute le", unmuteMoment)
      .addField("❓ Raison", unmutedReason)
      .setAuthor(
        `${unmutedUser.user.tag}`,
        unmutedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(unmutedUser.user.displayAvatarURL());

    // Récupération des infos du channel de logs

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, async function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      let muteRole = message.guild.roles.cache.find((n) => n.name === "Mute");
      if (!muteRole)
        return message.channel.send(
          ":x: Il m'est impossible d'unmute cet utilisateur car je ne trouve pas le rôle de mute !"
        );

      try {
        await unmutedUser.roles.remove(muteRole.id);
        message.channel.send(
          `:white_check_mark: **${unmutedUser.user.username}** a été  🔊 **unmute**  avec succès pour la raison suivante :\n\`${unmutedReason}\``
        );
        unmutedUser.send(
          `:white_check_mark: Vous avez été  🔊 **unmute**  du serveur **${message.guild.name}** par **${message.author.username}** pour la raison suivante :\n\`${unmutedReason}\``
        );

        if (logChannel) {
          logChannel.send(unmuteEmbed);
        } else message.channel.send(`⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${message.settings.prefix}setlogs <#channel>\``);
      } catch (e) {
        return message.channel.send(
          ":warning: Cet utilisateur n'est pas mute !"
        );
      }
    });
  }
}

module.exports = Unmute;

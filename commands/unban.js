const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const db = require("../db.js");

class Unban extends Command {
  constructor(client) {
    super(client, {
      name: "unban",
      description: "Unban un utilisateur grâce à son ID",
      usage: "unban <id> [raison]",
      permLevel: "Staff"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let userInGuild;
    let unbannedUser;
    try {
      userInGuild = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      unbannedUser = this.client.users.cache.get(args[0]);
      if (!unbannedUser)
        return message.channel.send(
          ":x: Je n'ai pas trouvé cet utilisateur, merci d'indiquer l'ID du membre à unban"
        );
    } catch (e) {
      return message.channel.send(":x: Je n'ai pas trouvé cet utilisateur");
    }

    if (userInGuild) {
      return message.reply(
        ":warning: Ce membre appartient déjà au serveur ! Vous ne pouvez pas l'unban !"
      );
    }

    let unbanMoment = moment(message.createdAt).format("Do MMMM YYYY à LTS");

    let unbannedReason = `${args.join(" ").slice(args[0].length + 1)}`;
    if (!unbannedReason) {
      unbannedReason = "❌ Aucune raison spécifiée";
    }

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
        `**${unbannedUser.username}** (ID: ${unbannedUser.id})`
      )
      .addField("🌀 Unban par", `${message.author} (ID: ${message.author.id})`)
      .addField("🕑 Unban le", unbanMoment)
      .addField("❓ Raison", unbannedReason)
      .setAuthor(
        `${unbannedUser.tag}`,
        unbannedUser.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(unbannedUser.displayAvatarURL());

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

    db.query(getGuildSetting, async function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let logChannel = message.guild.channels.cache.get(
        results[0].logChannel_id
      );

      try {
        await message.guild.members.unban(unbannedUser.id);
        message.channel.send(
          `:white_check_mark: **${unbannedUser.username}** a été **unban** avec succès !`
        );
        unbannedUser.send(
          `:white_check_mark: Vous avez été **unban** du serveur **${message.guild.name}** par un modérateur.\n\nVous pouvez rejoindre le serveur ici : https://discord.gg/${link}`
        );

        if (logChannel) {
          logChannel.send(unbanEmbed);
        } else message.channel.send(`⚠️ Vous n'avez setup aucun channel de logs. Je ne peux donc pas envoyer le message de logs. Vous pouvez le faire avec la commande \`${this.client.config.defaultSettings.prefix}setlogs [#channel]\``);
      } catch (e) {
        return message.channel.send(
          ":warning: Cet utilisateur n'est pas banni !"
        );
      }
    });
  }
}

module.exports = Unban;

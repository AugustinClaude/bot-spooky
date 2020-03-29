const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

class Kick extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      description: "Kick un utilisateur",
      usage: "kick <utilisateur> [raison]",
      permLevel: "Mod"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    let kickedUser;
    try {
      kickedUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !kickedUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    if (
      kickedUser.hasPermission(
        "MANAGE_GUILD" ||
          "KICK_MEMBERS" ||
          "BAN_MEMBERS" ||
          "MANAGE_MESSAGES" ||
          "ADMINISTRATOR"
      )
    ) {
      return message.reply("Vous ne pouvez pas kick cette personne !");
    }

    let kickedReason = `${args.join(" ").slice(args[0].length + 1)}`;
    if (!kickedReason) {
      kickedReason = "❌ Aucune raison spécifiée";
    }

    const kickedEmbed = new MessageEmbed()
      .setTitle("❌ Kicks")
      .setColor("#ff4a4a")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .addField(
        "⛔️ Membre kické",
        `**${kickedUser.user.username}** (ID: ${kickedUser.id})`
      )
      .addField("🌀 Kick par", `${message.author} (ID: ${message.author.id})`)
      .addField(
        "🕑 Kick le",
        moment(message.createdAt).format("Do MMMM YYYY à LTS")
      )
      .addField("💬 Channel", message.channel)
      .addField("❓ Raison", kickedReason)
      .setAuthor(
        `${kickedUser.user.tag}`,
        kickedUser.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(kickedUser.user.displayAvatarURL());

    const kickChannel = message.guild.channels.cache.find(
      c => c.name === "logs" || c.name === "log"
    );
    if (!kickChannel) {
      message.channel.send(":x: Channel **logs / log** introuvable.");
    }

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
      .createInvite({ maxAge: 0, maxUses: 1 })
      .then(invite => {
        link = invite.code;
      });

    message.guild.member(kickedUser).kick(kickedReason);
    kickChannel.send(kickedEmbed);
    message.channel.send(
      `**${kickedUser.user.username}** a été kick avec succès pour :\n\`${kickedReason}\``
    );
    kickedUser.send(
      `Vous avez été kick du serveur **${message.guild.name}** pour :\n\`${kickedReason}\`\n\nVous pouvez rejoindre à nouveau le serveur ici : https://discord.gg/${link}`
    );
  }
}

module.exports = Kick;

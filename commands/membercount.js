const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Math extends Command {
  constructor(client) {
    super(client, {
      name: "membercount",
      description: "Affiche des infos sur les utilisateurs d'un serveur",
      usage: "membercount",
      aliases: ["mc", "members"]
    });
  }

  run(message, args) {
    let servIcon = message.guild.iconURL;
    let servName = message.guild.name;
    let nbMember = message.guild.memberCount;
    let roles = message.guild.roles.size;

    let humains = message.guild.members.cache.filter(member => !member.user.bot)
      .size;
    let bots = message.guild.members.cache.filter(member => member.user.bot)
      .size;

    let botoffline = message.guild.members.cache.filter(
      member => member.user.bot && member.presence.status === "offline"
    ).size;

    let streaming = 0;
    message.guild.members.cache.forEach(member => {
      if (member.presence.game && member.presence.game.type == 1) {
        streaming = streaming + 1;
      }
    });

    let dnd = message.guild.members.cache.filter(
      o => o.presence.status === "dnd"
    ).size;
    let idle = message.guild.members.cache.filter(
      o => o.presence.status === "idle"
    ).size;
    let offline = message.guild.members.cache.filter(
      o => o.presence.status === "offline"
    ).size;
    let online = message.guild.members.cache.filter(
      o => o.presence.status === "online"
    ).size;

    let noRole;
    let hasRoles = false;
    let roles1 = 0;
    message.guild.members.cache.each(member => {
      if (member.roles.size > 1) {
        hasRoles = true;
        roles1 = roles1 + 1;
      } else hasRoles = false;
    });
    if (hasRoles == true) {
      noRole = nbMember - roles1;
    }

    if (botoffline == 0) botoffline = ":x: Aucun bots offline";

    const servEmbed = new MessageEmbed()
      .setAuthor(servName, servIcon)
      .setColor("#8815DF")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL
      )
      .setTimestamp()
      .addField("🥝 Membres", nbMember, true)
      .addField("👻 Membres sans rôle(s)", noRole, true)
      .addBlankField()
      .addField("😄 Humains", humains, true)
      .addField("🤖 Bots", bots, true)
      .addBlankField()
      .addField(
        "⚙️ Statut des membres",
        `<:online:679396291456925697> **Online :** ${online}\n<:offline:492994318072807424> **Offline :** ${offline}\n<:idle:492993972277608448> **Inactif :** ${idle}\n<:dnd:492774462400364556> **Ne pas déranger :** ${dnd}\n<:streaming:492994618942685214> **Streaming :** ${streaming}`,
        true
      )
      .addField("🍏 Membres connectés", online + dnd + idle, true)
      .addBlankField()
      .addField("🌍 Nombre de rôle(s)", roles, true)
      .addField("📁 Bots offline", botoffline, true);

    message.channel.send(servEmbed);
    message.delete();
  }
}

module.exports = Math;

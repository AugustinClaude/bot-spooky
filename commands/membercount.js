const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class MemberC extends Command {
  constructor(client) {
    super(client, {
      name: "membercount",
      description: "Affiche des infos sur les utilisateurs d'un serveur",
      usage: "membercount",
      aliases: ["mc", "members"]
    });
  }

  run(message, args) {
    // ------ Vars ------
    let nbMember = message.guild.memberCount;
    let roles = message.guild.roles.cache.size - 1;
    let humains = message.guild.members.cache.filter(member => !member.user.bot)
      .size;
    let bots = message.guild.members.cache.filter(member => member.user.bot)
      .size;
    let botoffline = message.guild.members.cache.filter(
      member => member.user.bot && member.presence.status === "offline"
    ).size;

    if (botoffline == 0) botoffline = ":x: Aucun bots offline";

    // ------ Status ------
    let streaming = 0;
    message.guild.members.cache.forEach(member => {
      let memArr = member.presence.activities;

      for (let i = 0; i < memArr.length; i++) {
        if (memArr[i].type == "STREAMING") {
          streaming++;
        }
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
    let online =
      message.guild.members.cache.filter(o => o.presence.status === "online")
        .size - streaming;

    // ------ No roles ------
    let noRole;
    let hasRoles = false;
    let roles1 = 0;
    message.guild.members.cache.each(member => {
      if (member.roles.cache.size > 1) {
        hasRoles = true;
        roles1 = roles1 + 1;
      } else hasRoles = false;
    });
    noRole = nbMember - roles1;

    // ------ Embed setup & envoi ------
    const servEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .addField("\u200B", "\u200B")
      .setColor("#33aa55")
      .setFooter(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setTitle("📊 Members stats")

      .addField("🥝 Membres", nbMember, true)
      .addField("👻 Membres sans rôle(s)", noRole, true)
      .addField("\u200B", "\u200B")
      .addField("😄 Humains", humains, true)
      .addField("🤖 Bots", bots, true)
      .addField("\u200B", "\u200B")
      .addField(
        "⚙️ Statut des membres",
        `<:online:679396291456925697> **En ligne :** ${online}\n<:offline:679396291251404801> **Hors ligne :** ${offline}\n<:idle:679396291226370060> **Inactif :** ${idle}\n<:dnd:679396291167649814> **Ne pas déranger :** ${dnd}\n<:streaming:679396291721297960> **Streaming :** ${streaming}`,
        true
      )
      .addField("🍏 Membres connectés", online + dnd + idle + streaming, true)
      .addField("\u200B", "\u200B")
      .addField("🌍 Nombre de rôle(s)", roles, true)
      .addField("📁 Bots offline", botoffline, true);

    message.channel.send(servEmbed);
  }
}

module.exports = MemberC;

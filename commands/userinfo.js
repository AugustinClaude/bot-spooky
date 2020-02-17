const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

class Userinfo extends Command {
  constructor(client) {
    super(client, {
      name: "userinfo",
      description: "Affiche des informations à propos d'un utilisateur",
      usage: "userinfo [utilisateur]",
      aliases: ["ui", "user"]
    });
  }

  run(message, args) {
    moment.locale("fr");

    // Mention d'utilisateur / id / pseudo, hashtag
    let user;
    try {
      user = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) user = message.author;
      else if (!user)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      user = message.author;
    }

    // Définition des variables
    let pseudo = user.username;
    let discriminator = user.discriminator;
    let nickname = user.nickname;
    let id = user.id;
    let activity = user.presence.activities.name || ":x: Ne joue à rien";
    let nbRoles = user.roles.cache.size - 1;
    let highestRole = user.roles.highest;
    let joined = moment(user.joinedAt).format("Do MMMM YYYY, LTS");
    let created = moment(user.createdAt).format("Do MMMM YYYY, LTS");

    let isBot;
    if (user.bot == true) isBot = "🤖 Bot";
    else isBot = "😁 Humain";

    let status;
    if (user.presence.status == "online") {
      status = "<:online:492774463398477834> En ligne";
    } else if (user.presence.status == "offline") {
      status = "<:offline:492994318072807424> Hors ligne";
    } else if (user.presence.status == "idle") {
      status = "<:idle:492993972277608448> Inactif";
    } else if (user.presence.status == "dnd") {
      status = "<:dnd:492774462400364556> Ne pas déranger";
    } else if (user.presence.status == "streaming") {
      status = "<:streaming:492994618942685214> Streaming";
    }

    let roles;
    let disp = false;
    if (nbRoles == 0) roles = ":x: Aucun rôle";
    else {
      roles = `${user.roles.cache
        .filter(r => r.id !== message.guild.id)
        .array()
        .map(g => g)
        .join(", ")}`;

      if (roles.length > 1024) {
        roles = `:x: Trop de rôles (${nbRoles})`;
        disp = true;
      }
    }

    let dispRoles;
    if (disp == true) dispRoles = "";
    else dispRoles = `[${nbRoles == 1 ? " rôle" : " rôles"}]`;

    /*
    try {
      const userEmbed = new MessageEmbed()
        .setColor("#b7db24")
        .setThumbnail(message.member.displayAvatarURL)
        .setFooter(bot.user.username + " ©", bot.user.displayAvatarURL)
        .setThumbnail(getvalueof.displayAvatarURL)
        .setTimestamp()
        .addField("👤 Pseudo", `${getvalueof}`, true)
        .addField("👥 #", `#${getvalueof.discriminator}`, true)
        .addBlankField()
        .addField("✏️ ID", `${mentionned.id}`, true)
        .addField("🕵 Type", checkbot, true)
        .addBlankField()
        .addField("🔘 Status", status, true)
        .addField(
          "🎮 Jeu",
          `${
            mentionned.presence.game
              ? `${mentionned.presence.game.name}`
              : "Ne joue à rien"
          }`,
          true
        )
        .addBlankField()
        .addField(
          `<:bing_slime:477106597756141569> Rôle(s) [${mentionned.roles.cache
            .size - 1} rôle(s)]`,
          `${roles}`,
          true
        )
        .addBlankField()
        .addField("⬆ Plus haut rôle", mentionned.highestRole, true)
        .addBlankField()
        .addField(
          "🚪 Arrivée sur le serveur",
          moment(mentionned.joinedAt).format("Do MMMM YYYY, LTS"),
          true
        )
        .addField(
          "🛠 Compte créé le",
          moment(getvalueof.createdAt).format("Do MMMM YYYY, LTS"),
          true
        )
        .addBlankField()
        .addField(
          "⭕ Kickable",
          `${mentionned.kickable ? "✅ Oui" : "❌ Non"}`,
          true
        )
        .addField(
          "⭕ Bannable",
          `${mentionned.bannable ? "✅ Oui" : "❌ Non"}`,
          true
        )
        .addBlankField();

      message.channel.send(userEmbed);
    } catch (e) {
      return message.channel.send(
        "Une erreur est survenue et il m'est impossible d'exécuter cette commande ! Il est possible que vous ayez trop de rôles par rapport au nombre de caractères maximum que demande un embed (``<google / <ggl Qu'est ce qu'un embed Discord ?``). Attention, cela peut aussi être lié à un autre problème dont je ne connais pas forcément l'existence !"
      );
    }
    */
  }
}

module.exports = Userinfo;

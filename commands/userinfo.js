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

    var mentionned = message.guild.member(
      message.mentions.users.first() || message.guild.members.cache.get(args[0])
    );

    var mentionnedbot = message.mentions.users.first();
    var getvalueof;

    if (mentionnedbot) {
      getvalueof = mentionnedbot;
    } else {
      getvalueof = message.author;
    }

    var checkbot;
    if (getvalueof.bot == true) {
      checkbot = "🤖 Bot";
    } else {
      checkbot = "😁 Humain";
    }

    if (!mentionned) {
      return message.channel.send("L'utilisateur n'existe pas !");
    }

    var status;
    if (mentionned.presence.status == "online") {
      status = "<:online:492774463398477834> En ligne";
    } else if (mentionned.presence.status == "offline") {
      status = "<:offline:492994318072807424> Hors ligne";
    } else if (mentionned.presence.status == "idle") {
      status = "<:idle:492993972277608448> Inactif";
    } else if (mentionned.presence.status == "dnd") {
      status = "<:dnd:492774462400364556> Ne pas déranger";
    } else if (mentionned.presence.status == "streaming") {
      status = "<:streaming:492994618942685214> Streaming";
    }

    var roles;
    if (mentionned.roles.size == 1) {
      roles = ":x: Aucun rôles";
    } else {
      roles = `- ${mentionned.roles.cache
        .filter(role => role.id !== message.guild.id)
        .array()
        .map(g => g)
        .join("\n- ")}`;
    }

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
  }
}

module.exports = Userinfo;

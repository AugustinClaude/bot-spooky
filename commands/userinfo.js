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
      if (!args[0]) user = message.member;
      else if (!user)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      user = message.member;
    }

    // Définition des variables
    let pseudo = user.user.username;
    let discriminator = user.user.discriminator;
    let nickname = user.nickname || ":x: Aucun surnom";
    let id = user.id;
    let nbRoles = user.roles.cache.size - 1;
    let highestRole = user.roles.highest;
    let joinedTime = moment(user.joinedAt).format("Do MMMM YYYY, LTS");
    let createdTime = moment(user.user.createdAt).format("Do MMMM YYYY, LTS");

    let activity;
    for (let i = 0; i < user.presence.activities.length; i++) {
      activity = `\`${user.presence.activities[i].state}\``;
    }
    if (activity == undefined) activity = ":x: Aucun jeu";

    let isBot;
    if (user.user.bot == true) isBot = "<:bot:679402162194743306>";
    else isBot = "";

    let status;
    if (user.presence.status == "online") {
      status = "<:online:679396291456925697> En ligne";
    } else if (user.presence.status == "offline") {
      status = "<:offline:679396291251404801> Hors ligne";
    } else if (user.presence.status == "idle") {
      status = "<:idle:679396291226370060> Inactif";
    } else if (user.presence.status == "dnd") {
      status = "<:dnd:679396291167649814> Ne pas déranger";
    }
    for (let i = 0; i < user.presence.activities.length; i++) {
      if (user.presence.activities[i].type == "STREAMING") {
        status = "<:streaming:679396291721297960> Streaming";
      }
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
    else dispRoles = `(${nbRoles})`;

    const joinedSorted = message.guild.members.cache
      .array()
      .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
      .map(g => g.user.username);

    let arrivalPosition;
    let orderArrival;
    for (let i = 0; i < joinedSorted.length; i++) {
      if (joinedSorted[i].toString() == user.user.username) {
        arrivalPosition = i + 1;

        if (joinedSorted[i - 3] == undefined) joinedSorted[i - 3] = "";
        else joinedSorted[i - 3] = `${joinedSorted[i - 3]} >`;
        if (joinedSorted[i - 2] == undefined) joinedSorted[i - 2] = "";
        else joinedSorted[i - 2] = `${joinedSorted[i - 2]} >`;
        if (joinedSorted[i - 1] == undefined) joinedSorted[i - 1] = "";
        else joinedSorted[i - 1] = `${joinedSorted[i - 1]} >`;
        if (joinedSorted[i + 1] == undefined) joinedSorted[i + 1] = "";
        else joinedSorted[i + 1] = `> ${joinedSorted[i + 1]}`;
        if (joinedSorted[i + 2] == undefined) joinedSorted[i + 2] = "";
        else joinedSorted[i + 2] = `> ${joinedSorted[i + 2]}`;
        if (joinedSorted[i + 3] == undefined) joinedSorted[i + 3] = "";
        else joinedSorted[i + 3] = `> ${joinedSorted[i + 3]}`;

        orderArrival = `${joinedSorted[i - 3]}  ${joinedSorted[i - 2]}  ${
          joinedSorted[i - 1]
        }  **${joinedSorted[i]}**  ${joinedSorted[i + 1]}  ${
          joinedSorted[i + 2]
        }  ${joinedSorted[i + 3]}`;
      }
    }

    try {
      const userEmbed = new MessageEmbed()
        .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .setColor("#ffbb55")
        .addField("👤 Pseudo", `${isBot} ${pseudo}`, true)
        .addField("👥 #", discriminator, true)
        .addField("🏷️ Surnom", nickname, true)
        .addField("✏️ ID", id, true)
        .addField("⚙️ Statut", status, true)
        .addField("🎮 Jeu", activity, true)
        .addBlankField()
        .addField(
          `<:bing_slime:585135069908434944> ${
            nbRoles == 1 ? "Rôle" : "Rôles"
          } ${dispRoles}`,
          roles,
          true
        )
        .addField("⬆ Rôle le plus haut", highestRole, true)
        .addBlankField()
        .addField("📊 Position d'arrivée", arrivalPosition, true)
        .addField("📚 Ordre d'arrivée", orderArrival, true)
        .addBlankField()
        .addField("🚪 A rejoint le", joinedTime, true)
        .addField("🛠 Compte créé le", createdTime, true)
        .setFooter(
          this.client.user.username + " ©",
          this.client.user.displayAvatarURL()
        )
        .setTimestamp();
      message.channel.send(userEmbed);
    } catch (e) {
      message.channel.send(
        ":x: Une erreur s'est produite lors de l'envoi de l'embed !"
      );
    }

    /*
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
    */
  }
}

module.exports = Userinfo;

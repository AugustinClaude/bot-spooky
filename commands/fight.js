const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Fight extends Command {
  constructor(client) {
    super(client, {
      name: "fight",
      description: "Démarre un combat entre deux utilisateurs",
      usage: `fight <utilisateur>`,
      aliases: ["combat"],
    });
  }

  run(message, args) {
    let fightUser;
    try {
      fightUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0] || !fightUser)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      return message.channel.send(":x: L'utilisateur n'existe pas !");
    }

    let joueurs = [
      `:one: **${message.author.username}**`,
      `:two: **${fightUser.user.username}**`,
    ];
    let gagnant = Math.floor(Math.random() * joueurs.length);

    const fightEmbed = new MessageEmbed()
      .setColor("#eeaa11")
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("⚔️ Un combat a commencé !")
      .setDescription(
        `:one: ${message.author.username}   **VS**   :two: ${fightUser.user.username}`
      )
      .addField("\u200B", "\u200B")
      .addField("🏆 Gagnant", joueurs[gagnant]);

    message.channel.send(fightEmbed);
  }
}

module.exports = Fight;

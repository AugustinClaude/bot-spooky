const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Pat extends Command {
  constructor(client) {
    super(client, {
      name: "pat",
      description: "Tapote un utilisateur",
      usage: `pat [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const patEmbed = new MessageEmbed();

    let patUser;
    try {
      patUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        patUser = message.member;
      } else if (!patUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      patUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (patUser) random = patUser.user.username;

    get("https://nekos.life/api/v2/img/pat")
      .then((res) => {
        patEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (patUser == message.member)
          patEmbed.setTitle(
            `**${message.author.username}** se tapote... Pourquoi pas ¯\\_(ツ)_/¯`
          );
        else
          patEmbed.setTitle(
            `**${message.author.username}** tapote **${random}** :D`
          );

        return message.channel.send(patEmbed);
      })
      .catch(() => {
        console.error();
        return message.channel.send(":x: Une erreur est survenue !");
      });
  }
}

module.exports = Pat;

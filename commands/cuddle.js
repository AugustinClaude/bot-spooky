const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Cuddle extends Command {
  constructor(client) {
    super(client, {
      name: "cuddle",
      description: "Caline un utilisateur",
      usage: `cuddle [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const cuddleEmbed = new MessageEmbed();

    let cuddleUser;
    try {
      cuddleUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        cuddleUser = message.member;
      } else if (!cuddleUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      cuddleUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (cuddleUser) random = cuddleUser.user.username;

    try {
      get("https://nekos.life/api/v2/img/cuddle").then((res) => {
        cuddleEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (cuddleUser == message.member)
          cuddleEmbed.setTitle(
            `**${message.author.username}** se caline lui même O_o`
          );
        else
          cuddleEmbed.setTitle(
            `**${message.author.username}** caline **${random}** ! Trop mignon :)`
          );

        return message.channel.send(cuddleEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Cuddle;

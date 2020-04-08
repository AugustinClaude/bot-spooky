const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Hug extends Command {
  constructor(client) {
    super(client, {
      name: "hug",
      description: "Fais un calin à un utilisateur",
      usage: `hug [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const hugEmbed = new MessageEmbed();

    let hugUser;
    try {
      hugUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        hugUser = message.member;
      } else if (!hugUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      hugUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (hugUser) random = hugUser.user.username;

    try {
      get("https://nekos.life/api/v2/img/hug").then((res) => {
        hugEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (hugUser == message.member)
          hugEmbed.setTitle(
            `**${message.author.username}** s'auto caline... Why not`
          );
        else
          hugEmbed.setTitle(
            `**${message.author.username}** fait un calin à **${random}** ! C'est meugnon :3`
          );

        return message.channel.send(hugEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Hug;

const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Tickle extends Command {
  constructor(client) {
    super(client, {
      name: "tickle",
      description: "Chatouille un utilisateur",
      usage: `tickle [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const tickleEmbed = new MessageEmbed();

    let tickleUser;
    try {
      tickleUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        tickleUser = message.member;
      } else if (!tickleUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      tickleUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (tickleUser) random = tickleUser.user.username;

    try {
      get("https://nekos.life/api/v2/img/tickle").then((res) => {
        tickleEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (tickleUser == message.member)
          tickleEmbed.setTitle(
            `**${message.author.username}** se chatouille .-. Ils sont fous ces romains !`
          );
        else
          tickleEmbed.setTitle(
            `**${message.author.username}** chatouille **${random}** ... héhé :)`
          );

        return message.channel.send(tickleEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Tickle;

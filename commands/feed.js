const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Feed extends Command {
  constructor(client) {
    super(client, {
      name: "feed",
      description: "Nourri un utilisateur",
      usage: `feed [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const feedEmbed = new MessageEmbed();

    let feedUser;
    try {
      feedUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        feedUser = message.member;
      } else if (!feedUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      feedUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (feedUser) random = feedUser.user.username;

    get("https://nekos.life/api/v2/img/feed")
      .then((res) => {
        feedEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (feedUser == message.member)
          feedEmbed.setTitle(
            `**${message.author.username}** a faim et s'auto nourri`
          );
        else
          feedEmbed.setTitle(
            `**${message.author.username}** donne à manger **${random}** ! Rom nom nom...`
          );

        return message.channel.send(feedEmbed);
      })
      .catch(() => {
        console.error();
        return message.channel.send(":x: Une erreur est survenue !");
      });
  }
}

module.exports = Feed;

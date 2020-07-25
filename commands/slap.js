const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Slap extends Command {
  constructor(client) {
    super(client, {
      name: "slap",
      description: "Gifle un utilisateur",
      usage: `slap [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const slapEmbed = new MessageEmbed();

    let slapUser;
    try {
      slapUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        slapUser = message.member;
      } else if (!slapUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      slapUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (slapUser) random = slapUser.user.username;

    get("https://nekos.life/api/v2/img/slap")
      .then((res) => {
        slapEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (slapUser == message.member)
          slapEmbed.setTitle(
            `**${message.author.username}** se gifle ? ... Ok ...`
          );
        else
          slapEmbed.setTitle(
            `**${message.author.username}** gifle **${random}** è_é c'est vraiment méchant !`
          );

        return message.channel.send(slapEmbed);
      })
      .catch(() => {
        console.error();
        return message.channel.send(":x: Une erreur est survenue !");
      });
  }
}

module.exports = Slap;

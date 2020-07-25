const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Kiss extends Command {
  constructor(client) {
    super(client, {
      name: "kiss",
      description: "Embrasse un utilisateur",
      usage: `kiss [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const kissEmbed = new MessageEmbed();

    let kissUser;
    try {
      kissUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        kissUser = message.member;
      } else if (!kissUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      kissUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (kissUser) random = kissUser.user.username;

    get("https://nekos.life/api/v2/img/kiss")
      .then((res) => {
        kissEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (kissUser == message.member)
          kissEmbed.setTitle(`**${message.author.username}** s'embrasse..`);
        else
          kissEmbed.setTitle(
            `**${message.author.username}** embrasse **${random}** ❤️`
          );

        return message.channel.send(kissEmbed);
      })
      .catch(() => {
        console.error();
        return message.channel.send(":x: Une erreur est survenue !");
      });
  }
}

module.exports = Kiss;

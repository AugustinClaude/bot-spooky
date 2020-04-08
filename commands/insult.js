const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Insult extends Command {
  constructor(client) {
    super(client, {
      name: "insult",
      description: "Insulte un utilisateur",
      usage: `insult [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const insultEmbed = new MessageEmbed();

    let insultUser;
    try {
      insultUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        insultUser = message.member;
      } else if (!insultUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      insultUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (insultUser) random = insultUser.user.username;

    try {
      get("https://nekos.life/api/v2/img/baka").then((res) => {
        insultEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (insultUser == message.member)
          insultEmbed.setTitle(
            `**${message.author.username}** s'insulte... D'accord.`
          );
        else
          insultEmbed.setTitle(
            `**${message.author.username}** insulte **${random}** ! C'est pas gentil d'être méchant :(`
          );

        return message.channel.send(insultEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Insult;

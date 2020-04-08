const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const { get } = require("snekfetch");

class Poke extends Command {
  constructor(client) {
    super(client, {
      name: "poke",
      description: "Poke un utilisateur",
      usage: `poke [utilisateur / random]`,
    });
  }

  run(message, args) {
    let random;
    const pokeEmbed = new MessageEmbed();

    let pokeUser;
    try {
      pokeUser = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find((u) =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) {
        pokeUser = message.member;
      } else if (!pokeUser && args[0] !== "random")
        return message.channel.send(
          ":x: L'utilisateur n'existe pas ou vous avez mal écrit `random`!"
        );
    } catch (e) {
      pokeUser = message.member;
    }

    if (args[0] == "random") {
      random = message.guild.members.cache.random().user.username;
    } else if (pokeUser) random = pokeUser.user.username;

    try {
      get("https://nekos.life/api/v2/img/poke").then((res) => {
        pokeEmbed
          .setColor("RANDOM")
          .setImage(res.body.url)
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (pokeUser == message.member)
          pokeEmbed.setTitle(
            `**${message.author.username}** se poke ¯\\_(ツ)_/¯`
          );
        else
          pokeEmbed.setTitle(
            `**${message.author.username}** poke **${random}** .-.`
          );

        return message.channel.send(pokeEmbed);
      });
    } catch (e) {
      return message.channel.send(":x: Une erreur est survenue !");
    }
  }
}

module.exports = Poke;

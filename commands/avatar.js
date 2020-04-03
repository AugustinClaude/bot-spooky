const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Avatar extends Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      description: "Affiche l'avatar d'un utilisateur",
      usage: `avatar [utilisateur]`,
      aliases: ["pp", "profil", "a"]
    });
  }

  run(message, args) {
    let user;
    try {
      user = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[0]) ||
          this.client.users.cache.find(u =>
            u.tag.toLowerCase().includes(args[0].toLowerCase())
          )
      );
      if (!args[0]) user = message.member;
      else if (!user)
        return message.channel.send(":x: L'utilisateur n'existe pas !");
    } catch (e) {
      user = message.member;
    }

    const avatarEmbed = new MessageEmbed()
      .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
      .setColor("#88bb55")
      .setImage(user.user.displayAvatarURL({ dynamic: true }))
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp();
    message.channel.send(avatarEmbed);
  }
}

module.exports = Avatar;

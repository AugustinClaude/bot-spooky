const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Serverinfo extends Command {
  constructor(client) {
    super(client, {
      name: "serverinfo",
      description: "Affiche les informations du serveur",
      usage: "serverinfo",
      aliases: ["si", "is", "infoserver"]
    });
  }

  run(message) {
    moment.locale("fr");

    let textChannels = message.guild.channels.cache.filter(
      t => t.type == "text"
    ).size;
    let voiceChannels = message.guild.channels.cache.filter(
      v => v.type == "voice"
    ).size;
    let categories = message.guild.channels.cache.filter(
      c => c.type == "category"
    ).size;
    let createdAt = moment(message.guild.createdAt).format(
      "Do MMMM YYYY à LTS"
    );
    let lastMember = message.guild.members.cache
      .sort((a, b) => b.joinedAt - a.joinedAt)
      .map(m => `**${m.user.username}**`)
      .splice(0, 1);

    const siEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .setColor("#eecc11")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("📋 Informations du serveur")
      .addField("🌐 Nom", message.guild.name, true)
      .addField("✏️ ID", message.guild.id, true)
      .addField("🏆 Propriétaire", message.guild.owner, true)
      .addField("\u200B", "\u200B")
      .addField("🥝 Membres", message.guild.memberCount, true)
      .addField(
        `📚 Channels **[${message.guild.channels.cache.size}]**`,
        `💬 Textuels : **${textChannels}**\n🔊 Vocaux : **${voiceChannels}**\n🗂️ Catégories : **${categories}**`,
        true
      )
      .addField(
        "<:bing_slime:585135069908434944> Rôles",
        message.guild.roles.cache.size - 1,
        true
      )
      .addField("\u200B", "\u200B")
      .addField("🚪 Dernier membre", lastMember, true)
      .addField("🌎 Créé le", createdAt, true);

    message.channel.send(siEmbed);
  }
}

module.exports = Serverinfo;

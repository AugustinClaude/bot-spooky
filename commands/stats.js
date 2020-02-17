const Command = require("../modules/Command.js");
const { version, MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Stats extends Command {
  constructor(client) {
    super(client, {
      name: "stats",
      description: "Affiche les statistiques du bot.",
      usage: "stats",
      aliases: ["stat", "statistics"]
    });
  }

  run(message) {
    const duration = moment
      .duration(this.client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");

    const users = [];
    let nb = 0;
    this.client.guilds.cache.array().forEach(guild => {
      users.push(guild.memberCount);
    });
    users.forEach(n => {
      nb += n;
    });

    const statsEmbed = new MessageEmbed()
      .setAuthor(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .addBlankField()
      .setColor("#99dd11")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("🗂 Statistiques")
      .addField(
        "📥 Mémoire utilisée",
        `**${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}** MB`,
        true
      )
      .addField("⬆ Uptime", `**${duration}**`, true)
      .addBlankField()
      .addField("🍪 Utilisateurs", `**${nb.toLocaleString()}**`, true)
      .addField(
        "💬 Channels",
        `**${this.client.channels.cache.size.toLocaleString()}**`,
        true
      )
      .addField(
        "🌐 Serveurs",
        `**${this.client.guilds.cache.size.toLocaleString()}**`,
        true
      )
      .addBlankField()
      .addField("📋 Discord.js Version", `**v${version}**`, true)
      .addField("📄 Node Version", `**${process.version}**`, true);
    message.channel.send(statsEmbed);
  }
}

module.exports = Stats;

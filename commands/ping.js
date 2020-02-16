const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Affiche le temps de réponse et la latence de l'API",
      usage: "ping",
      aliases: ["pong"]
    });
  }

  async run(message) {
    const msg = message.editedTimestamp
      ? message.editedTimestamp
      : message.createdTimestamp;
    const m = await message.channel.send("🏓 Ping!");
    const pingEmbed = new MessageEmbed()
      .setColor("#aa4411")
      .setTitle("🏓 Pong!")
      .setAuthor(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setThumbnail(
        "https://images-ext-1.discordapp.net/external/1gz-8O12UyQwspa1A-ckkiG4WJMib7ocS3DEFHF6-jo/https/cdn.discordapp.com/attachments/490819311376531456/493850711076110360/pingpong.png"
      )
      .addField(
        "⏳ Temps de réponse",
        `**${m.createdTimestamp - msg}** ms`,
        true
      )
      .addField(
        "📶 Latence de l'API",
        `**${Math.round(this.client.ws.ping)}** ms`,
        true
      );

    m.edit(pingEmbed);
  }
}

module.exports = Ping;

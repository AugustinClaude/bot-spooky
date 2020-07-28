const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const db = require("../db/db.js");

class Welcome extends Command {
  constructor(client) {
    super(client, {
      name: "welcome",
      description: "Affiche les infos sur le channel de bienvenue",
      usage: "welcome",
      aliases: ["welcomeinfo", "winfo"],
      permLevel: "Staff",
    });
  }

  async run(message, args) {
    const welcomeEmbed = new MessageEmbed()
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setThumbnail(message.guild.iconURL())
      .addField("\u200B", "\u200B")
      .setColor("#33aabb")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setTitle("🚪 Bienvenue");

    // Récupération des infos du channel de bienvenue

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      let welcomeChannel = message.guild.channels.cache.get(
        results[0].welcomeChannel_id
      );

      let channel;

      if (
        results[0].welcomeChannel_id == undefined ||
        results[0].welcomeChannel_name == undefined
      ) {
        channel = ":warning:  Il n'y a pas de channel de bienvenue";
      } else {
        channel = `<#${welcomeChannel.id}>`;
        welcomeEmbed
          .addField("✏️ Id", welcomeChannel.id, true)
          .addField("🏷️ Nom", welcomeChannel.name, true)
          .addField("\u200B", "\u200B");
      }

      welcomeEmbed.addField("#️⃣ Channel de bienvenue", channel);

      message.channel.send(welcomeEmbed);
    });
  }
}

module.exports = Welcome;

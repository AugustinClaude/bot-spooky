const Command = require("../modules/Command.js");
const db = require("../db.js");

class Setlogs extends Command {
  constructor(client) {
    super(client, {
      name: "setlogs",
      description: "Setup un channel de logs ou le désactive",
      usage: "setlogs <#channel / off>",
      aliases: [
        "setlog",
        "setuplogs",
        "setuplog",
        "setlogschannel",
        "setlogchannel",
        "setup"
      ],
      permLevel: "Staff"
    });
  }

  run(message, args) {
    if (!args[0]) {
      return message.channel.send(
        ":x: Veuillez préciser le channel où vous voulez setup vos logs !"
      );
    } else if (args[0] == "off") {
      message.channel.send(
        ":white_check_mark: Le channel de logs a été désactivé ! Il n'y a désormais plus de channel de logs"
      );

      // Désactive le channel de logs

      let setLogChannelId = `UPDATE guildSettings SET logChannel_id = '${null}' WHERE guildSettings.guildId = '${
        message.guild.id
      }';`;

      db.query(setLogChannelId, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });

      let setLogChannelName = `UPDATE guildSettings SET logChannel_name = '${null}' WHERE guildSettings.guildId = '${
        message.guild.id
      }';`;

      db.query(setLogChannelName, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });
    } else {
      let channelID = args[0].slice(2, -1);
      let channel = message.guild.channels.cache.find(n => n.id == channelID);

      if (!channel)
        return message.channel.send(":x: Ce channel n'existe pas !");

      // Récupération infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, function(err, results, fields) {
        if (err) console.log(err.message);
        //console.log(results);
        if (results[0] == undefined) return;
        if (results[0].logChannel_id == channel.id)
          return message.channel.send(
            ":warning: Ce salon est déjà défini comme channel de logs !"
          );

        // Finalisation
        if (channel)
          message.channel.send(
            `:white_check_mark: Le channel <#${channel.id}> a bien été défini comme channel de logs !`
          );
      });

      // Stockage de channel dans base de donnée

      let setLogChannelId = `UPDATE guildSettings SET logChannel_id = '${channel.id}' WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setLogChannelId, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });

      let setLogChannelName = `UPDATE guildSettings SET logChannel_name = '${channel.name}' WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setLogChannelName, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });
    }
  }
}

module.exports = Setlogs;

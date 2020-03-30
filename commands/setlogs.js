const Command = require("../modules/Command.js");
const fs = require("fs");

class Setlogs extends Command {
  constructor(client) {
    super(client, {
      name: "setlogs",
      description: "Setup un channel de logs",
      usage: "setlogs [#channel]",
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
    if (!args[0])
      return message.channel.send(
        ":x: Veuillez préciser le channel où vous voulez setup vos logs !"
      );

    let channelID = args[0].slice(2, -1);
    let channel = message.guild.channels.cache.find(n => n.id == channelID);

    if (channel)
      message.channel.send(
        `:white_check_mark: Le channel <#${channel.id}> a bien été défini comme channel de logs !`
      );
    else return message.channel.send(":x: Ce channel n'existe pas !");

    // Stockage de channel dans base de donnée

    /*let channels = {          // JSON pas terrible (à éviter)
      log_channel: {
        guildid: message.guild.id,
        channel: {
          id: channel.id,
          name: channel.name
        }
      }
    };
    console.log(channels);

    fs.writeFile("../channels.json", JSON.stringify(channels), err => {
      if (err) console.log(err);
    });*/

    module.exports.channel = channel; // Temporaire
  }
}

module.exports = Setlogs;

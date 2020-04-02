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

  async run(message, args) {
    if (!args[0]) {
      return message.channel.send(
        ":x: Veuillez préciser le channel où vous voulez setup vos logs !"
      );
    } else if (args[0] == "off") {
      // Récupèration infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, function(err, results, fields) {
        if (err) console.log(err.message);
        if (
          results[0].logChannel_id == undefined ||
          results[0].logChannel_name == undefined
        )
          return message.channel.send(
            ":warning: Le channel de logs est déjà désactivé !"
          );
        else
          message.channel.send(
            ":white_check_mark: Le channel de logs a été désactivé ! Il n'y a désormais plus de channel de logs"
          );
      });

      // Désactive le channel de logs

      let setLogChannelId = `UPDATE guildSettings SET logChannel_id = DEFAULT WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setLogChannelId, function(err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });

      let setLogChannelName = `UPDATE guildSettings SET logChannel_name = DEFAULT WHERE guildSettings.guildId = '${message.guild.id}';`;

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

      db.query(getGuildSetting, async function(err, results, fields) {
        if (err) console.log(err.message);
        //console.log(results);
        if (results[0] == undefined) return;
        if (results[0].logChannel_id == channel.id)
          return message.channel.send(
            ":warning: Ce salon est déjà défini comme channel de logs !"
          );

        let logChannelText;
        let logChannelConf;
        if (
          results[0].logChannel_id == undefined ||
          results[0].logChannel_name == undefined
        ) {
          logChannelText = `ℹ️ Vous n'avez pas de channel de logs. Voulez-vous le setup pour <#${channel.id}> ?`;
          logChannelConf =
            "ℹ️ Vous n'avez pas setup de channel de logs. Il n'y en a donc aucun.";
        } else {
          logChannelText = `ℹ️ Voulez-vous remplacer le channel de logs <#${results[0].logChannel_id}> **(ancien)** par <#${channel.id}> **(nouveau)** ?`;
          logChannelConf = `ℹ️ Le channel de logs reste donc l'ancien : <#${results[0].logChannel_id}>`;
        }

        // Finalisation
        if (channel) {
          const m = await message.channel.send(logChannelText);

          try {
            m.react("✅");
            m.react("❌");
            const filter = (reaction, user) => {
              return (
                ["✅", "❌"].includes(reaction.emoji.name) &&
                user.id === message.author.id
              );
            };

            m.awaitReactions(filter, {
              max: 1,
              time: 30000,
              errors: ["time"]
            }).then(collected => {
              const reaction = collected.first();
              if (reaction.emoji.name === "✅") {
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

                m.edit(
                  `:white_check_mark: Le channel <#${channel.id}> a bien été défini comme channel de logs !`
                );
              } else {
                m.edit(logChannelConf);
              }

              m.reactions.cache.forEach(r => r.remove());
            });
          } catch (e) {
            return message.channel.send(
              ":x: Je n'ai pas la permission d'ajouter des réactions ! J'ai donc gardé l'ancien channel de logs"
            );
          }
        }
      });
    }
  }
}

module.exports = Setlogs;

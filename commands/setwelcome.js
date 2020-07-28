const Command = require("../modules/Command.js");
const db = require("../db.js");

class Setwelcome extends Command {
  constructor(client) {
    super(client, {
      name: "setwelcome",
      description: "Setup un channel de bienvenue ou le désactive",
      usage: "setwelcome <#channel / off>",
      aliases: ["setupwelcome", "setwelcomechannel", "setwc"],
      permLevel: "Staff",
      clientPermissions: ["ADD_REACTIONS"],
    });
  }

  async run(message, args) {
    if (!args[0]) {
      return message.channel.send(
        ":x: Veuillez préciser le channel où vous voulez setup votre salon de bienvenue !"
      );
    } else if (args[0] == "off") {
      // Récupèration infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, function (err, results, fields) {
        if (err) console.log(err.message);
        if (
          results[0].welcomeChannel_id == undefined ||
          results[0].welcomeChannel_name == undefined
        )
          return message.channel.send(
            ":warning: Le channel de bienvenue est déjà désactivé !"
          );
        else
          message.channel.send(
            ":white_check_mark: Le channel de bienvenue a été désactivé ! Il n'y a désormais plus de channel de bienvenue"
          );
      });

      // Désactive le channel de bienvenue

      let setWelcomeChannelId = `UPDATE guildSettings SET welcomeChannel_id = DEFAULT WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setWelcomeChannelId, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });

      let setWelcomeChannelName = `UPDATE guildSettings SET welcomeChannel_name = DEFAULT WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setWelcomeChannelName, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });
    } else {
      let channelID = args[0].slice(2, -1);
      let channel = message.guild.channels.cache.find((n) => n.id == channelID);

      if (!channel)
        return message.channel.send(":x: Ce channel n'existe pas !");

      // Récupération infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, async function (err, results, fields) {
        if (err) console.log(err.message);
        //console.log(results);
        if (results[0] == undefined) return;
        if (results[0].welcomeChannel_id == channel.id)
          return message.channel.send(
            ":warning: Ce salon est déjà défini comme channel de bienvenue !"
          );

        let welcomeChannelText;
        let welcomeChannelConf;
        if (
          results[0].welcomeChannel_id == undefined ||
          results[0].welcomeChannel_name == undefined
        ) {
          welcomeChannelText = `ℹ️ Vous n'avez pas de channel de bienvenue. Voulez-vous le setup pour <#${channel.id}> ?`;
          welcomeChannelConf =
            "ℹ️ Vous n'avez pas setup de channel de bienvenue. Il n'y en a donc aucun.";
        } else {
          welcomeChannelText = `ℹ️ Voulez-vous remplacer le channel de bienvenue <#${results[0].welcomeChannel_id}> **(ancien)** par <#${channel.id}> **(nouveau)** ?`;
          welcomeChannelConf = `ℹ️ Le channel de bienvenue reste donc l'ancien : <#${results[0].welcomeChannel_id}>`;
        }

        // Finalisation
        if (channel) {
          const m = await message.channel.send(welcomeChannelText);

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
              errors: ["time"],
            }).then((collected) => {
              const reaction = collected.first();
              if (reaction.emoji.name === "✅") {
                // Stockage de channel dans base de donnée

                let setWelcomeChannelId = `UPDATE guildSettings SET welcomeChannel_id = '${channel.id}' WHERE guildSettings.guildId = '${message.guild.id}';`;

                db.query(setWelcomeChannelId, function (err, results, fields) {
                  if (err) {
                    console.log(err.message);
                  }
                });

                let setWelcomeChannelName = `UPDATE guildSettings SET welcomeChannel_name = '${channel.name}' WHERE guildSettings.guildId = '${message.guild.id}';`;

                db.query(setWelcomeChannelName, function (
                  err,
                  results,
                  fields
                ) {
                  if (err) {
                    console.log(err.message);
                  }
                });

                m.edit(
                  `:white_check_mark: Le channel <#${channel.id}> a bien été défini comme channel de bienvenue !`
                );
              } else {
                m.edit(welcomeChannelConf);
              }

              m.reactions.cache.forEach((r) => r.remove());
            });
          } catch (e) {
            return message.channel.send(
              ":x: Je n'ai pas la permission d'ajouter des réactions ! J'ai donc gardé l'ancien channel de bienvenue"
            );
          }
        }
      });
    }
  }
}

module.exports = Setwelcome;

const Command = require("../modules/Command.js");
const db = require("../db/db.js");

class Setprefix extends Command {
  constructor(client) {
    super(client, {
      name: "setprefix",
      description: "Setup le préfix du bot",
      usage: "setprefix <prefix / default>",
      permLevel: "Staff",
      clientPermissions: ["ADD_REACTIONS"],
    });
  }

  async run(message, args) {
    if (!args[0]) {
      return message.channel.send(":x: Veuillez préciser le nouveau préfix !");
    } else if (args[0] == "default") {
      // Récupèration infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, function (err, result, fields) {
        if (err) console.log(err.message);

        let getDefaultPrefix = `SELECT DEFAULT( prefix ) FROM guildSettings WHERE guildId = '${message.guild.id}';`;
        db.query(getDefaultPrefix, function (err, results, fields) {
          if (err) console.log(err.message);

          if (result[0].prefix == results[0]["DEFAULT( prefix )"])
            return message.channel.send(
              `:warning: Le préfix est déjà celui par défaut : \`${results[0]["DEFAULT( prefix )"]}\` !`
            );
          else
            message.channel.send(
              `:white_check_mark: Le préfix est maintenant celui par défaut : \`${results[0]["DEFAULT( prefix )"]}\` !`
            );
        });
      });

      // Remet le préfix par défaut

      let setPrefix = `UPDATE guildSettings SET prefix = DEFAULT WHERE guildSettings.guildId = '${message.guild.id}';`;

      db.query(setPrefix, function (err, results, fields) {
        if (err) {
          console.log(err.message);
        }
      });
    } else {
      // Récupération infos guild

      let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

      db.query(getGuildSetting, async function (err, results, fields) {
        if (err) console.log(err.message);
        //console.log(results);
        if (results[0] == undefined) return;
        if (results[0].prefix == args[0])
          return message.channel.send(
            ":warning: Ce préfix est déjà défini comme le préfix actuel !"
          );

        let prefixText = `ℹ️ Voulez-vous remplacer le préfix \`${results[0].prefix}\` **(ancien)** par \`${args[0]}\` **(nouveau)** ?`;
        let prefixConf = `ℹ️ Le préfix reste donc l'ancien : \`${results[0].prefix}\``;

        // Finalisation
        const m = await message.channel.send(prefixText);

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
              // Stockage du prefix dans base de donnée

              let setPrefix = `UPDATE guildSettings SET prefix = '${args[0]}' WHERE guildSettings.guildId = '${message.guild.id}';`;

              db.query(setPrefix, function (err, results, fields) {
                if (err) {
                  console.log(err.message);
                }
              });

              m.edit(
                `:white_check_mark: Le préfix est maintenant : \`${args[0]}\` !`
              );
            } else {
              m.edit(prefixConf);
            }

            m.reactions.cache.forEach((r) => r.remove());
          });
        } catch (e) {
          return message.channel.send(
            ":x: Je n'ai pas la permission d'ajouter des réactions ! J'ai donc gardé l'ancien préfix"
          );
        }
      });
    }
  }
}

module.exports = Setprefix;

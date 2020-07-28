const { MessageEmbed } = require("discord.js");
const db = require("../db.js");
const sql = require("../sql.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
      const errorEmbed = new MessageEmbed()
        .setColor("#AD0003")
        .setDescription(
          "⛔️ Cette commande n'est utilisable que sur serveur ! ⛔️"
        );
      return message.author.send(errorEmbed);
    }

    // Paramètres DB
    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) {
        console.log(
          `Création de la ligne de config pour le serveur : ${message.guild.name}`
        );

        let setDefaultSettings = `INSERT INTO guildSettings(guildId, guildName) VALUES('${message.guild.id}', '${message.guild.name}')`;

        db.query(setDefaultSettings, function (err, results, fields) {
          if (err) console.log(err.message);
        });
      } else {
        if (results[0].guildName !== message.guild.name) {
          let updateGuildName = `UPDATE guildSettings SET guildName = '${message.guild.name}' WHERE guildSettings.guildId = '${message.guild.id}';`;

          db.query(updateGuildName, function (err, results, fields) {
            if (err) {
              console.log(err.message);
            }
          });
        }

        if (results[0].logChannel_id !== null) {
          let logChannelId = results[0].logChannel_id;
          let logChannelName = message.guild.channels.cache.get(logChannelId)
            .name;
          if (results[0].logChannel_name !== logChannelName) {
            let updateLogChannelName = `UPDATE guildSettings SET logChannel_name = '${logChannelName}' WHERE guildSettings.guildId = '${message.guild.id}';`;

            db.query(updateLogChannelName, function (err, results, fields) {
              if (err) {
                console.log(err.message);
              }
            });
          }
        }

        if (results[0].welcomeChannel_id !== null) {
          let welcomeChannelId = results[0].welcomeChannel_id;
          let welcomeChannelName = message.guild.channels.cache.get(
            welcomeChannelId
          ).name;
          if (results[0].welcomeChannel_name !== welcomeChannelName) {
            let updateWelcomeChannelName = `UPDATE guildSettings SET welcomeChannel_name = '${welcomeChannelName}' WHERE guildSettings.guildId = '${message.guild.id}';`;

            db.query(updateWelcomeChannelName, function (err, results, fields) {
              if (err) {
                console.log(err.message);
              }
            });
          }
        }
      }
    });

    sql.guildSettings(message.guild.id, async (err, results) => {
      let custom_prefix = results[0].prefix;

      // Paramètres
      const settings = this.client.getSettings(message.guild);
      message.settings = settings;

      // Détecte la mention du bot
      let spooky = false;
      if (message.content.startsWith("<@!672141573076811818>")) spooky = true;

      // Ignore le message s'il ne commence pas par le préfix
      if (
        message.content.indexOf(settings.prefix) !== 0 &&
        spooky == false &&
        !message.content.startsWith(custom_prefix)
      )
        return;

      // Mention bot => affiche préfix
      if (spooky == true && message.content.length == 22) {
        const prefEmbed = new MessageEmbed()
          .setAuthor(
            `Demandé par ${message.author.tag}`,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(this.client.user.displayAvatarURL())
          .setDescription(`Pour plus d'aide, faites \`${settings.prefix}help\``)
          .addField("💻 **Préfix :**", `\`${settings.prefix}\``)
          .setColor("#ddaaff")
          .setFooter(
            this.client.user.username + " ©",
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        if (custom_prefix !== settings.prefix)
          prefEmbed.addField(
            "🗂️ **Préfix du serveur** (modifiable avec la commande setprefix)",
            `\`${custom_prefix}\``
          );

        return message.channel.send(prefEmbed);
      }

      // Détecte la longueur du préfix selon s'il correspond à la mention du bot ou non
      let prefixL;
      if (spooky == true) prefixL = 22;
      else if (!message.content.startsWith(custom_prefix))
        prefixL = settings.prefix.length;
      else prefixL = custom_prefix.length;

      // Setup args
      const args = message.content.slice(prefixL).trim().split(/ +/g);
      const command = args.shift().toLowerCase();

      // Setup cmd et permLevel
      if (message.guild && !message.member)
        await message.guild.fetchMember(message.author);

      const level = this.client.permLevel(message);

      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));
      if (!cmd) return;

      if (level < this.client.levelCache[cmd.conf.permLevel]) {
        if (settings.systemNotice === "true") {
          const permEmbed = new MessageEmbed()
            .setAuthor(
              `Demandé par ${message.author.tag}`,
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setThumbnail(this.client.user.displayAvatarURL())
            .setTitle("📕 Permissions non suffisantes")
            .addField("\u200B", "\u200B")
            .addField(
              "▶️ Votre niveau de permission",
              `**Niveau :** ${level} | **Nom :** ${
                this.client.config.permLevels.find((l) => l.level === level)
                  .name
              }`
            )
            .addField(
              "<:Warn:675783882469015632> Permissions requises",
              `**Niveau :** ${
                this.client.levelCache[cmd.conf.permLevel]
              } | **Nom :** ${cmd.conf.permLevel}`
            )
            .setColor("#9977ff")
            .setFooter(
              this.client.user.username + " ©",
              this.client.user.displayAvatarURL()
            )
            .setTimestamp();
          return message.channel.send(permEmbed);
        } else {
          return;
        }
      }

      message.member.permLevel = level;

      message.flags = [];
      while (args[0] && args[0][0] === "-") {
        message.flags.push(args.shift().slice(1));
      }

      // Check des permissions du bot
      let missingPermissions = [];
      cmd.conf.clientPermissions.forEach((neededPerm) => {
        if (!message.channel.permissionsFor(message.guild.me).has(neededPerm)) {
          missingPermissions.push(neededPerm);
        }
      });

      if (missingPermissions[0]) {
        return message.channel.send(
          `:x: Je ne peux pas exécuter cette commande car il me manque ces permissions :\n\`${missingPermissions
            .map((p) => "`" + p + "`")
            .join(", ")}\``
        );
      }

      // Lancement de la commande
      this.client.logger.log(
        `${message.guild.name} | #${message.channel.name}:\n[${
          this.client.config.permLevels.find((l) => l.level === level).name
        }] ${message.author.username}#${message.author.discriminator} (ID: ${
          message.author.id
        }) a lancé la commande ${settings.prefix}${cmd.help.name} ${args.join(
          " "
        )}`
      );
      cmd.run(message, args, level, custom_prefix);
    });
  }
};

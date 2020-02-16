const { MessageEmbed } = require("discord.js");

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

    if (
      !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
    )
      return;

    // Paramètres
    const settings = this.client.getSettings(message.guild);
    message.settings = settings;

    // Détecte la mention du bot
    let spooky = false;
    let mentionned = message.guild.member(message.mentions.users.first());
    if (mentionned && mentionned.id == "672141573076811818") spooky = true;

    // Ignorer le message s'il ne commence pas par le préfix
    if (
      message.content.indexOf(settings.prefix) !== 0 &&
      !message.content.startsWith(";") &&
      spooky == false
    )
      return;

    // Mention bot => préfix
    if (spooky == true && message.content.length == 22) {
      const prefEmbed = new MessageEmbed()
        .setAuthor(
          `Demandé par ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(`💻 **Préfix :** \`${settings.prefix}\``)
        .setColor("#ddaaff")
        .setFooter(
          this.client.user.username + " ©",
          this.client.user.displayAvatarURL()
        )
        .setTimestamp();
      return message.channel.send(prefEmbed);
    }

    // Setup args etc...
    const args = message.content
      .slice(settings.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

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
          .addBlankField()
          .addField(
            "▶️ Votre niveau de permission",
            `**Niveau :** ${level} | **Nom :** ${
              this.client.config.permLevels.find(l => l.level === level).name
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

    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === "-") {
      message.flags.push(args.shift().slice(1));
    }

    // Lancement de la commande
    this.client.logger.log(
      `${message.guild.name} | #${message.channel.name}:\n[${
        this.client.config.permLevels.find(l => l.level === level).name
      }] ${message.author.username}#${message.author.discriminator} (ID: ${
        message.author.id
      }) a lancé la commande ${settings.prefix}${cmd.help.name} ${args.join(
        " "
      )}`
    );
    cmd.run(message, args, level);
  }
};

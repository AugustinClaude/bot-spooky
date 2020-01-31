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
      message.author.send(errorEmbed);
      return;
    }

    if (
      !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
    )
      return;

    // Paramètres
    const settings = this.client.getSettings(message.guild);
    message.settings = settings;

    if (message.content.indexOf(settings.prefix) !== 0) return;

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
        return message.channel.send(
          `:x: **Vous n'avez pas la permission pour utiliser cette commande.**\n\n:arrow_right: Votre niveau de **permission** est \`${level} => ${
            this.client.config.permLevels.find(l => l.level === level).name
          }\`\n:white_check_mark: Cette commande requiert le niveau de **permission** \`${
            this.client.levelCache[cmd.conf.permLevel]
          } => ${cmd.conf.permLevel}\``
        );
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

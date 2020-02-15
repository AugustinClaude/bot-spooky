const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Help extends Command {
  constructor(client) {
    super(client, {
      name: "help",
      description: "Affiche le menu d'aide",
      usage: `help [catégorie] [here] ou help [commande]`,
      aliases: ["aide"]
    });
  }

  async run(message, args) {
    const cmd =
      this.client.commands.get(args[0]) ||
      this.client.commands.get(this.client.aliases.get(args[0]));

    // Embed général
    const help = new MessageEmbed()
      .setAuthor(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .setTitle("🔧 Voici la liste des catégories de commandes !")
      .setDescription(
        `❱ **Préfix :** \`${this.client.config.defaultSettings.prefix}\`\n❱ **Description :** Les \`[]\` sont optionnels et les \`<>\` sont obligatoires et tout deux ne doivent pas apparaître dans la commande.\n❱ **Infos :** \`${this.client.config.defaultSettings.prefix}help [commande]\``
      )
      .addBlankField()
      .setColor("#80aaff")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp();

    // Array et embeds

    const helpinfo = new MessageEmbed();
    const helpuse = new MessageEmbed();
    const helpfun = new MessageEmbed();
    const helpmusic = new MessageEmbed();
    const helpimage = new MessageEmbed();
    const helpmod = new MessageEmbed();

    let arrEmbed = [helpinfo, helpuse, helpfun, helpmusic, helpimage, helpmod];
    let arrCmd = ["info", "use", "fun", "music", "image", "mod"];
    let arrTxt = [
      "informatives",
      "utiles",
      "fun",
      "de musique",
      "d'images",
      "de modération"
    ];
    let arrField = [
      "🌐 Info",
      "⚙️ Utile",
      "🎉 Fun",
      "🎵 Musique",
      "🖼 Images",
      "📛 Modération"
    ];
    let arrList = [
      "`help`, `perm`, `ping`, `stats`, `weather`",
      "`math`",
      "La liste des commandes n'est pas disponible pour le moment",
      "La liste des commandes n'est pas disponible pour le moment",
      "La liste des commandes n'est pas disponible pour le moment",
      "`clear`, `reboot`, `eval`"
    ];
    let arrColor = [
      "#88eef7",
      "#ffcc00",
      "#6600cc",
      "#0059F2",
      "#33cc33",
      "#ff3300"
    ];

    // Mise en place embed général
    for (let i = 0; i < arrField.length && i < arrCmd.length; i++) {
      help.addField(
        `${arrField[i]}`,
        `\`\`${this.client.config.defaultSettings.prefix}help ${arrCmd[i]} [here]\`\``,
        true
      );
    }
    help.addBlankField();

    // Mise en place des embeds de catégorie
    for (
      let i = 0;
      i < arrEmbed.length &&
      i < arrField.length &&
      i < arrList.length &&
      i < arrColor.length;
      i++
    ) {
      arrEmbed[i]
        .setAuthor(
          `Demandé par ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          `❱ **Préfix :** \`${this.client.config.defaultSettings.prefix}\`\n❱ **Description :** Les \`[]\` sont optionnels et les \`<>\` sont obligatoires et tout deux ne doivent pas apparaître dans la commande.\n❱ **Infos :** \`${this.client.config.defaultSettings.prefix}help [commande]\``
        )
        .addBlankField()
        .addField(`${arrField[i]}`, `${arrList[i]}`, true)
        .addBlankField()
        .setColor(`${arrColor[i]}`)
        .setFooter(
          this.client.user.username + " ©",
          this.client.user.displayAvatarURL()
        )
        .setTimestamp();
    }

    // Envoi embed général
    if (!args[0]) {
      try {
        await message.author.send(help);
        message.reply(
          "La liste des catégories de commandes vous a été envoyé en MP !"
        );
      } catch (e) {
        message.reply(
          "Vos MP sont probablement désactivés, j'envoie donc la liste des catégories de commandes ici !"
        );
        message.channel.send(help);
      }
    } else if (args[0] == "here") {
      message.channel.send(help);
    }

    // Envoi embeds catégories
    for (
      let i = 0;
      i < arrCmd.length && i < arrTxt.length && i < arrEmbed.length;
      i++
    ) {
      if (args[0] == arrCmd[i] && !args[1]) {
        try {
          await message.author.send(arrEmbed[i]);
          message.reply(
            `La liste des commandes ${arrTxt[i]} vous a été envoyé en MP !`
          );
        } catch (e) {
          message.reply(
            `Vos MP sont probablement désactivés, j'envoie donc la liste des commandes ${arrTxt[i]} ici !`
          );
          message.channel.send(arrEmbed[i]);
        }
      }
      if (args[0] == arrCmd[i] && args[1] == "here") {
        message.channel.send(arrEmbed[i]);
      }
    }

    // Help commande
    if (
      args[0] !== "here" &&
      args[0] !== "info" &&
      args[0] !== "use" &&
      args[0] !== "fun" &&
      args[0] !== "music" &&
      args[0] !== "image" &&
      args[0] !== "mod"
    ) {
      let command = args[0];
      if (this.client.commands.has(command)) {
        command = this.client.commands.get(command);
        if (command.conf.aliases.join(", ") == "") let aliases = "❌";
        else aliases = command.conf.aliases.join(", ");

        const descEmbed = new MessageEmbed()
          .setAuthor(
            "Demandé par " + message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setThumbnail(this.client.user.displayAvatarURL())
          .setTitle(
            `🔧 Commande : ${this.client.config.defaultSettings.prefix}${command.help.name}`
          )
          .setDescription(
            `❱ **Description :** ${
              command.help.description
            }\n❱ **Utilisation :** \`${
              this.client.config.defaultSettings.prefix
            }${
              command.help.usage
            }\`\n❱ **Aliases :** ${aliases}\n❱ **Permissions requises :** ${
              this.client.levelCache[cmd.conf.permLevel]
            } | ${cmd.conf.permLevel}`
          )
          .setColor("#99ccff")
          .setFooter(
            `Les [] sont optionnels et les <> sont obligatoires et tout deux ne doivent pas apparaître dans la commande.`,
            this.client.user.displayAvatarURL()
          )
          .setTimestamp();

        message.channel.send(descEmbed);
      } else if (args[0])
        return message.reply(
          "❌ Cet argument n'est pas valide et ne correspond à aucune commande existante !"
        );
    }
  }
}

module.exports = Help;

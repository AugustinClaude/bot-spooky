const Command = require("../modules/Command.js");
const fs = require("fs");

class Cmd extends Command {
  constructor(client) {
    super(client, {
      name: "cmd",
      description: "Affiche le code source d'une commande",
      usage: "cmd <fichier>",
      permLevel: "Bot Owner",
      aliases: ["command"]
    });
  }

  async run(message, args) {
    if (!args[0])
      return message.channel.send(
        `:x: Veuillez préciser le nom d'une commande.\n**__Syntaxe :__** ${this.client.config.defaultSettings.prefix}cmd [fichier]`
      );

    let file = `\`${this.client.config.defaultSettings.prefix}${args[0]}\``;

    try {
      var cmd = fs.readFileSync(`./commands/${args[0]}.js`);
      await message.channel.send(
        `📥 Voici le code source de la commande ${file} !\n\`\`\`js\n${cmd}\n\`\`\``
      );
      message.delete({ timeout: 500 });
    } catch (e) {
      try {
        if (cmd.length > 2000)
          return message.channel.send(
            ":x: Le fichier dépasse les 2000 caractères autorisés par Discord et ne peut donc pas être envoyé !"
          );
      } catch (e) {
        return message.channel.send(
          `:x: La syntaxe est mauvaise ou le nom du fichier est incorrect !\n**__Syntaxe :__** ${this.client.config.defaultSettings.prefix}cmd [fichier]`
        );
      }
    }
  }
}

module.exports = Cmd;

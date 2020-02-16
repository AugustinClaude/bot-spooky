const Command = require("../modules/Command.js");
const fs = require("fs");

class Cmd extends Command {
  constructor(client) {
    super(client, {
      name: "cmd",
      description: "Affiche le code source d'un fichier en .js",
      usage: "cmd [fichier.js]",
      permLevel: "Bot Owner",
      aliases: ["command"]
    });
  }

  async run(message, args) {
    if (!args[0])
      return message.channel.send(
        `:x: Veuillez préciser le nom d'une commande en **.js**.\n**__Syntaxe :__** ${this.client.config.defaultSettings.prefix}cmd [fichier.js]`
      );

    const file = `\`${this.client.config.defaultSettings.prefix}${args[0].slice(
      0,
      -3
    )}\``;

    try {
      var cmd = fs.readFileSync(`./commands/${args[0]}`);
      await message.channel.send(
        `📥 Voici le code source de la commande ${file} !\n\`\`\`js\n${cmd}\n\`\`\``
      );
      message.delete({ timeout: 500 });
    } catch (e) {
      console.log(e);
      message.channel.send(
        `:x: Une erreur est survenue ! La principale cause est probablement le dépassement des 2000 caractères de la commande. Sinon, il est possible que la syntaxe soit incorrecte ou encore que le nom du fichier soit incorrect.`
      );
    }
  }
}

module.exports = Cmd;

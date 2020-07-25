const Command = require("../modules/Command.js");
const hastebin = require("hastebin.js");
const haste = new hastebin();
const fs = require("fs");

class Cmd extends Command {
  constructor(client) {
    super(client, {
      name: "cmd",
      description: "Affiche le code source d'une commande",
      usage: "cmd <fichier>",
      permLevel: "Bot Owner",
      aliases: ["command"],
    });
  }

  async run(message, args) {
    if (!args[0])
      return message.channel.send(
        `:x: Veuillez préciser le nom d'une commande.\n**__Syntaxe :__** ${this.client.config.defaultSettings.prefix}cmd [fichier]`
      );

    try {
      let cmd = fs.readFileSync(`./commands/${args[0]}.js`);
      await message.channel.send(
        `📥 Voici le code source de la commande \`${args[0]}\` !\n\`\`\`js\n${cmd}\n\`\`\``
      );
    } catch (e) {
      try {
        let cmd = fs.readFileSync(`./commands/${args[0]}.js`);
        if (cmd.length > 2000) {
          let hastelink;
          const link = await haste.post(cmd).then((link) => (hastelink = link));
          return message.channel.send(
            `ℹ️ La commande dépasse les 2000 caractères, elle est donc stockée dans ce hastebin : ${hastelink}`
          );
        }
      } catch (e) {
        console.log(e);
        return message.channel.send(
          `:x: La syntaxe est mauvaise ou le nom du fichier est incorrect !\n**__Syntaxe :__** ${this.client.config.defaultSettings.prefix}cmd [fichier]`
        );
      }
    }
  }
}

module.exports = Cmd;

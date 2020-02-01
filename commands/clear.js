const Command = require("../modules/Command.js");

class Clear extends Command {
  constructor(client) {
    super(client, {
      name: "clear",
      description: "Supprime un nombre de messages donné",
      usage: "clear <nb de messages>",
      permLevel: "Mod",
      aliases: ["purge"]
    });
  }

  async run(message, args) {
    if (args > 500)
      return message
        .reply(
          "❌ Vous ne pouvez pas clear plus de **500 messages** en une fois."
        )
        .then(msg => msg.delete({ timeout: 5000 }));

    if (isNaN(args[0]) || !args[0])
      return message.reply(
        `Argument invalide ! **Syntaxe :** ${this.client.config.defaultSettings.prefix}clear <nb de messages>`
      );

    try {
      await message.channel.bulkDelete(args[0]).then(() => {
        message.channel.bulkDelete(1);
        message.channel
          .send(`🗑 J'ai supprimé ***${args[0]} messages*** avec succès !`)
          .then(msg => msg.delete({ timeout: 2000 }));
      });
    } catch (e) {
      console.log(e);
      message.channel
        .send(
          "❌ Je ne peux pas supprimer des messages datant de plus de **14 jours** !"
        )
        .then(msg => msg.delete({ timeout: 5000 }));
    }
  }
}

module.exports = Clear;

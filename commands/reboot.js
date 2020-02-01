const Command = require("../modules/Command.js");

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "Redémarrage du bot.",
      usage: "reboot",
      permLevel: "Bot Owner",
      aliases: ["restart", "reload"]
    });
  }

  async run(message) {
    message.delete();
    await message.channel.send("⚙ Redémarrage terminé avec succès !");

    try {
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;

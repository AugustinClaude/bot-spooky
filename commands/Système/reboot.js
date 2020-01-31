const Command = require("../../modules/Command.js");

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: "reboot",
      description: "Redémarrage du bot.",
      usage: "reboot",
      category: "Système",
      permLevel: "Owner",
      aliases: ["restart", "reload"]
    });
  }

  async run(message) {
    message.delete();
    const m = await message.channel.send("⚙ Redémarrage en cours");
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours .");
    }, 500);
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours . .");
    }, 500);
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours . . .");
    }, 500);
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours . .");
    }, 500);
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours .");
    }, 500);
    setTimeout(() => {
      m.edit("⚙ Redémarrage en cours");
    }, 500);

    try {
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }

    setTimeout(() => {
      m.edit("⚙ Redémarrage terminé avec succès !");
    }, 3500);
  }
}

module.exports = Reboot;

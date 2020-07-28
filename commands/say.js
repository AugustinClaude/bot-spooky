const Command = require("../modules/Command.js");

class Say extends Command {
  constructor(client) {
    super(client, {
      name: "say",
      description: "Me fait parler",
      usage: "say <message>",
      permLevel: "Mod",
      clientPermissions: ["MANAGE_MESSAGES"],
    });
  }

  run(message, args) {
    message.delete();
    const msg = args.join(" ");
    message.channel.send(msg);
  }
}

module.exports = Say;

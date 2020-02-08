const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: '"Évalue" un code en l\'éxecutant',
      usage: "eval [code]",
      aliases: ["evaluation"],
      permLevel: "Bot Owner"
    });
  }

  run(message, args, level) {
    var input = args.join(" ");
    if (input == "") input = "❌ Input invalide";

    const codeEmbed = new MessageEmbed()
      .setAuthor(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .addField("📥 Input", `\`\`\`js\n${input}\n\`\`\``)
      .setColor("#ff99cc")
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp();

    try {
      var output = eval(input);
      codeEmbed.addField("📤 Output", `\`\`\`js\n${output}\n\`\`\``);
      message.channel.send(codeEmbed);
    } catch (e) {
      var output = e;
      codeEmbed.addField("📤 Output", `\`\`\`js\n${output}\n\`\`\``);
      message.channel.send(codeEmbed);
    }
  }
}

module.exports = Eval;

const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: '"Évalue" un code en l\'éxecutant',
      usage: "eval <code>",
      aliases: ["evaluation"],
      permLevel: "Bot Owner"
    });
  }

  run(message, args) {
    let input = args.join(" ");
    let output;
    if (input == "") input = "❌ Input invalide";
    if (input.toLowerCase().includes("TOKEN".toLowerCase()))
      return message.channel.send(":x: Je ne peux pas montrer mon token !");

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
      output = eval(input);
    } catch (e) {
      output = e;
    }

    codeEmbed.addField("📤 Output", `\`\`\`js\n${output}\n\`\`\``);
    message.channel.send(codeEmbed);
  }
}

module.exports = Eval;

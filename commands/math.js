const Command = require("../modules/Command.js");
const math = require("mathjs");
const { MessageEmbed } = require("discord.js");

class Math extends Command {
  constructor(client) {
    super(client, {
      name: "math",
      description: "Affiche le résultat d'un calcul",
      usage: "math <calcul>",
      aliases: ["maths", "calcul"]
    });
  }

  run(message, args) {
    let input = args.join(" ");
    let result;
    if (input == "") input = "❌ Expression invalide";

    const mathembed = new MessageEmbed()
      .setAuthor(
        `Demandé par ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter(
        this.client.user.username + " ©",
        this.client.user.displayAvatarURL()
      )
      .setTimestamp()
      .setColor("#99dd66");

    try {
      result = math.evaluate(args.join(" "));
    } catch (e) {
      result = "❌ Le calcul n'a pas pu être fait";
    }

    if (input.includes("/0")) result = "❌ La division par 0 est impossible !";

    mathembed
      .addField("📥 Calcul", `\`\`\`js\n${input}\`\`\``)
      .addField("📤 Résultat", `\`\`\`js\n${result}\`\`\``);
    message.channel.send(mathembed);
  }
}

module.exports = Math;

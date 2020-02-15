const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const snek = require("snekfetch");
const moment = require("moment");
require("moment-duration-format");

class Npm extends Command {
  constructor(client) {
    super(client, {
      name: "npm",
      description: "Affiche des informations à propos d'un module npm.",
      usage: "npm [module]"
    });
  }

  async run(message, args) {
    moment.locale("fr");

    if (!args[0])
      return message.channel.send(":x: Vous devez indiquer un module npm.");
    const query = args.join(" ");

    try {
      const { body } = await snek.get(
        `https://registry.npmjs.com/${query.toLowerCase()}`
      );
      // Get the latest version by the dist-tags.
      const version = body.versions[body["dist-tags"].latest];
      // Get and check for any dependencies.
      let deps = version.dependencies
        ? Object.keys(version.dependencies)
        : null;
      // Grab the list of maintainers.
      let maintainers = body.maintainers.map(user => user.name);
      const github = version.repository.url;
      const gitshort = github.slice(23, -4);

      // If there's more than 10 maintainers, we want to truncate them down.
      if (maintainers.length > 10) {
        const len = maintainers.length - 10;
        maintainers = maintainers.slice(0, 10);
        maintainers.push(`...${len} de plus.`);
      }

      // Same with the dependencies.
      if (deps && deps.length > 10) {
        const len = deps.length - 10;
        deps = deps.slice(0, 10);
        deps.push(`...${len} de plus.`);
      }

      // Now we just need to present the data to the end user.
      const embed = new MessageEmbed()
        .setColor(0xcb3837)
        .setAuthor(
          `${body.name} | Informations du package`,
          "https://i.imgur.com/ErKf5Y0.png"
        )
        .setThumbnail("https://i.imgur.com/8DKwbhj.png")
        .setTimestamp()
        .addField(
          "● Description",
          `${version.description || ":x: Aucune description."}\n\u200B`
        )
        .addField("● Auteur", `${body.author.name}`, true)
        .addField("● Version", `${body["dist-tags"].latest}`, true)
        .addField(
          "● Licence",
          `${body.license || ":x: Aucune licence."}\n\u200B`,
          true
        )
        .addField(
          "● Dépendances",
          `${
            deps && deps.length ? deps.join(", ") : ":x: Aucune dépendance."
          }\n\u200B`,
          true
        )
        .addField(
          "● Date de création",
          `${moment(new Date(body.time.created)).format("L à LT")}`,
          true
        )
        .addField(
          "● Date de modification",
          `${moment(new Date(body.time.modified)).format("L à LT")}`,
          true
        )
        .addField("● Collaborateurs", maintainers.join(", "))
        .addField(
          "● Lien du package NPMjs",
          `[https://www.npmjs.com/package/${query.toLowerCase()}](https://www.npmjs.com/package/${query.toLowerCase()})`
        )
        .addField(
          "● Github Repository",
          `[https://www.github.com/${gitshort}](https://www.github.com/${gitshort})`
        );

      message.channel.send({ embed });
    } catch (error) {
      if (error.status == 404)
        return message.channel.send(
          ":x: Une erreur s'est produite lors de la récupération des informations de ce module npm. Veuillez réessayer."
        );
      console.log(error);
      return message.channel.send(":x: Aucun résultat n'a été trouvé !");
    }
  }
}

module.exports = Npm;

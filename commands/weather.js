const Command = require("../modules/Command.js");
const { MessageEmbed } = require("discord.js");
const weather = require("weather-js");

class Weather extends Command {
  constructor(client) {
    super(client, {
      name: "weather",
      description: "Affiche la météo d'un lieu donné.",
      usage: "weather [lieu]",
      aliases: ["meteo"]
    });
  }

  run(message, args) {
    weather.find({ search: args.join(" "), degreeType: "C" }, function(
      err,
      result
    ) {
      if (err) console.log(err);
      if (result === undefined || result.length === 0) {
        message.channel.send(
          ":x: Vous n'avez pas indiqué de lieu ou celui-ci est invalide !"
        );
        return;
      }
      var current = result[0].current;
      var location = result[0].location;
      var UTC;

      if (location.timezone.startsWith("-")) UTC = `UTC${location.timezone}:00`;
      else UTC = `UTC+${location.timezone}:00`;

      const weatherEmbed = new MessageEmbed()
        .setAuthor(
          `Demandé par ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setDescription(`**${current.skytext}**`)
        .setTitle(`Météo pour ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x00ae86)
        .addBlankField()
        .addField("Timezone 🕒", `${UTC}`, true)
        .addField(
          "Type de degrée :thermometer:",
          `°${location.degreetype}`,
          true
        )
        .addBlankField()
        .addField(
          "Température :thermometer:",
          `${current.temperature}°${location.degreetype}`,
          true
        )
        .addField(
          "Ressenti :dash:",
          `${current.feelslike}°${location.degreetype}`,
          true
        )
        .addBlankField()
        .addField("Vent :wind_blowing_face:", current.winddisplay, true)
        .addField("Humidité :sweat_drops:", `${current.humidity}%`, true);
      message.channel.send(weatherEmbed);
    });
  }
}

module.exports = Weather;

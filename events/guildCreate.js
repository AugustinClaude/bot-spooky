const db = require("../db.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(guild) {
    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${message.guild.id}';`;

    db.query(getGuildSetting, function(err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) {
        this.logger.log(
          `Création de la ligne de config pour le serveur : ${message.guild.name}`
        );
      }
    });

    let setDefaultSettings = `INSERT INTO guildSettings(guildId) VALUES('${message.guild.id}')`;

    db.query(setDefaultSettings, function(err, results, fields) {
      if (err) console.log(err.message);
    });
  }
};

const db = require("../db/db.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(guild) {
    // Paramètres DB
    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${guild.id}';`;

    db.query(getGuildSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) {
        console.log(
          `Création de la ligne de config pour le serveur : ${guild.name}`
        );

        let setDefaultSettings = `INSERT INTO guildSettings(guildId, guildName) VALUES('${guild.id}', '${guild.name}')`;

        db.query(setDefaultSettings, function (err, results, fields) {
          if (err) console.log(err.message);
        });
      }
    });
  }
};

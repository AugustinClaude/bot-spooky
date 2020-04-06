const db = require("./db.js");

async function guildSettings(guild_id, callback) {
  let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${guild_id}';`;

  await db.query(getGuildSetting, function(err, results, fields) {
    if (err) console.log(err.message);

    callback(err, results);
  });
}

module.exports = { guildSettings };

const db = require("../db/db.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(member) {
    // Channel Stats

    const SpookyGuild = {
      guildID: "695020415294242856",
      memberCountID: "695033979627110404",
      botCountID: "695034011067875378",
    };

    if (member.guild.id == SpookyGuild.guildID) {
      try {
        this.client.channels.cache
          .get(SpookyGuild.memberCountID)
          .setName(`👤 Members : ${member.guild.memberCount}`);
        this.client.channels.cache
          .get(SpookyGuild.botCountID)
          .setName(
            `🤖 Bots : ${
              member.guild.members.cache.filter((m) => m.user.bot).size
            }`
          );
      } catch (e) {
        return;
      }
    }

    // Récupération des infos du channel de bienvenue

    let getGuildSetting = `SELECT * FROM guildSettings WHERE guildId = '${member.guild.id}';`;

    db.query(getGuildSetting, function (err, results, fields) {
      if (err) console.log(err.message);
      //console.log(results);
      if (results[0] == undefined) return;

      let welcomeChannel = member.guild.channels.cache.get(
        results[0].welcomeChannel_id
      );

      if (welcomeChannel) {
        welcomeChannel.send(
          `Bienvenue <@${member.id}> sur **${member.guild.name}** ! Il y a maintenant **${member.guild.memberCount}** membres sur le serveur !`
        );
      }
    });
  }
};

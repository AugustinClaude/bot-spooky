module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(member) {
    // Channel Stats

    const SpookyGuild = {
      guildID: "695020415294242856",
      memberCountID: "695033979627110404",
      botCountID: "695034011067875378"
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
              member.guild.members.cache.filter(m => m.user.bot).size
            }`
          );
      } catch (e) {
        return;
      }
    }
  }
};

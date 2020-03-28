const colors = require("colors");
const main = require("../main.js");

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    const users = [];
    let nb = 0;
    this.client.guilds.cache.array().forEach(guild => {
      users.push(guild.memberCount);
    });
    users.forEach(n => {
      nb += n;
    });

    // Messages de statut
    try {
      await this.client.user.setPresence({
        activity: {
          name: `${this.client.config.defaultSettings.prefix}help | ${nb} users`,
          type: "PLAYING"
          //url: 'https://www.twitch.tv/spokloo'
        },
        status: "online"
      });
    } catch (e) {
      console.error(e);
    }

    // Logs une fois en ligne
    this.client.logger.log(
      `${main.nb} commandes chargées avec succès !`,
      "ready"
    );

    this.client.logger.log(
      `= ${
        this.client.user.username
      } est en ligne ! =\n= ${nb} utilisateurs =\n= ${
        this.client.channels.cache.size
      } channels =\n= ${
        this.client.guilds.cache.size
      } serveurs :\n - ${this.client.guilds.cache
        .array()
        .map(g => g)
        .join("\n - ")}`,
      "ready"
    );

    colors.setTheme({
      silly: "rainbow"
    });
    console.log(
      `
        _________                     __           
      /   _____/_____   ____   ____ |  | _____.__.
      \\_____  \\\\____ \\ /  _ \\ /  _ \\|  |/ <   |  |
      /        \\  |_> >  <_> |  <_> )    < \\___  |
     /_______  /   __/ \\____/ \\____/|__|_ \\/ ____|
             \\/|__|                      \\/\\/     
             `.silly
    );
  }
};

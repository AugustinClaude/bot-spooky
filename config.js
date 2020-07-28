const config = {
  defaultSettings: {
    prefix: ",",
    modLogChannel: "logs",
    modRole: "Mod",
    adminRole: "Staff",
    systemNotice: "true",
  },

  permLevels: [
    { level: 0, name: "Member", check: () => true },
    {
      level: 1,
      name: "Mod",
      check: (message) => {
        try {
          const modRole = message.guild.roles.cache.find(
            (r) =>
              r.name.toLowerCase() === message.settings.modRole.toLowerCase()
          );
          if (
            (modRole && message.member.roles.cache.has(modRole.id)) ||
            message.member.hasPermission(["MANAGE_MESSAGES", "KICK_MEMBERS"])
          )
            return true;
        } catch (e) {
          return false;
        }
      },
    },
    {
      level: 2,
      name: "Staff",
      check: (message) => {
        try {
          const adminRole = message.guild.roles.cache.find(
            (r) =>
              r.name.toLowerCase() === message.settings.adminRole.toLowerCase()
          );
          if (
            (adminRole && message.member.roles.cache.has(adminRole.id)) ||
            message.member.hasPermission(["MANAGE_GUILD", "BAN_MEMBERS"], {
              checkAdmin: true,
              checkOwner: false,
            })
          )
            return true;
        } catch (e) {
          return false;
        }
      },
    },
    {
      level: 3,
      name: "Bot Owner",
      check: (message) => message.client.appInfo.owner.id === message.author.id,
    },
  ],

  db: {
    HOST: "",
    USER: "",
    PASSWORD: "",
    DB: "",
    dialect: "",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config;

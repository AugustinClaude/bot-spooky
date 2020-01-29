const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});
const prefix = ",";

bot.on("ready", () => {
  console.log(
    `Connexion effectuée en tant que ${bot.user.tag} sur ${bot.guilds.size} serveurs contenant ${bot.users.size} utilisateurs`
  );
});

bot.on("message", message => {
  if (message.content === prefix + "help") {
    message.channel.send(
      `Mon préfix est \`${prefix}\`. Il n'y a que la commande \`${prefix}help\` pour le moment`
    );
  }
});

bot.login("NjcyMTQxNTczMDc2ODExODE4.XjHKrQ.2kE0euXjQXnjYPdXe2YKbqxFEOI");

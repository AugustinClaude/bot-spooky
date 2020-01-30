const Discord = require("discord.js");
const bot = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});
require("dotenv").config();

bot.on("ready", () => {
  console.log(
    `Connexion effectuée en tant que ${bot.user.tag} sur ${bot.guilds.size} serveurs contenant ${bot.users.size} utilisateurs`
  );
});

bot.on("message", message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;
  const args = message.content.split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === `${process.env.PREFIX}help`) {
    message.channel.send(
      `Mon préfix est \`${process.env.PREFIX}\`. Il n'y a que la commande \`${process.env.PREFIX}help\` pour le moment`
    );
  }
});

bot.login(process.env.TOKEN);

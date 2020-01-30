const Discord = require("discord.js");
const { TOKEN, PREFIX } = require("./config.js");
const bot = new Discord.Client({
  disableEveryone: true,
  fetchAllMembers: true
});

bot.on("ready", () => {
  console.log(
    `Connexion effectuée en tant que ${bot.user.tag} sur ${bot.guilds.size} serveurs contenant ${bot.users.size} utilisateurs`
  );
});

bot.on("message", message => {
  if (!message.content.startsWith(PREFIX) || message.author.bot) return;
  const args = message.content.split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === `${PREFIX}help`) {
    message.channel.send(
      `Mon préfix est \`${PREFIX}\`. Il n'y a que la commande \`${PREFIX}help\` pour le moment`
    );
  }
});

bot.login(TOKEN);

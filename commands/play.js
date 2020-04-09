const Command = require("../modules/Command.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const { Util } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

class Play extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      description: "Joue une musique dans un salon vocal",
      usage: `play <lien / recherche>`,
    });
  }

  async run(message, args) {
    message.delete();
    moment.locale("fr");

    const { voice } = message.member;
    if (!voice.channel)
      return message.channel.send(
        ":x: Vous n'êtes pas connecté à un salon vocal !"
      );

    if (!args[0])
      return message.reply(
        ":warning: Merci de mettre un lien vers une vidéo YouTube !"
      );
    const validate = await ytdl.validateURL(args[0]);
    if (!validate) return message.reply(":x: Ce lien n'est pas disponible !");

    const serverQueue = message.client.queue.get(message.guild.id);
    const songInfo = await ytdl.getInfo(args[0]);
    const song = {
      id: songInfo.video_id,
      title: Util.escapeMarkdown(songInfo.title),
      url: songInfo.video_url,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      return message.channel.send(
        `:white_check_mark: **${song.title}** a été ajouté à la file d'attente !`
      );
    }

    const queueConstruct = {
      textChannel: message.channel,
      voice,
      connection: null,
      songs: [],
      volume: 1,
      playing: true,
    };
    message.client.queue.set(message.guild.id, queueConstruct);
    queueConstruct.songs.push(song);

    const play = async (song) => {
      const queue = message.client.queue.get(message.guild.id);
      if (!song) {
        queue.voice.channel.leave();
        message.client.queue.delete(message.guild.id);
        return;
      }

      const dispatcher = queue.connection
        .play(await ytdlDiscord(song.url), { passes: 3, type: "opus" })
        .on("finish", (reason) => {
          if (reason === "Récupération trop lente !")
            console.log("La musique s'est arrêtée !");
          else console.log(reason);
          queue.songs.shift();
          play(queue.songs[0]);
        })
        .on("error", (error) => console.error(error));
      dispatcher.setVolumeLogarithmic(queue.volume / 5);

      var artist = songInfo.media.artist;
      if (!artist)
        artist = ":x: Je n'ai pas trouvé d'artiste pour cette musique !";

      queue.textChannel.send(
        `▶ **En train d'être joué** : \`\`\`fix\n${
          song.title
        }\n\`\`\`\n⏳ **Durée** : \`\`\`js\n${moment
          .utc(songInfo.player_response.videoDetails.lengthSeconds * 1000)
          .format(
            "H [hrs], m [mins], s [secs]"
          )}\n\`\`\`\n👀 **Vues** : \`\`\`js\n${
          songInfo.player_response.videoDetails.viewCount
        } views\n\`\`\`\n📅 **Publié le** : \`\`\`js\n${moment(
          songInfo.published
        ).format("LLL")}\n\`\`\`\n👤 **Auteur de la vidéo** : \`\`\`css\n${
          songInfo.author.name
        }\n\`\`\`\n🎵 **Compositeur** : \`\`\`fix\n${artist}\n\`\`\`\n🌐 **Lien** : ${
          song.url
        }`
      );
    };

    try {
      const connection = await voice.channel.join();
      queueConstruct.connection = connection;
      play(queueConstruct.songs[0]);
    } catch (error) {
      console.error(`Je n'ai pas pu rejoindre le salon: ${error}`);
      message.client.queue.delete(message.guild.id);
      await voice.channel.leave();
    }
  }
}

module.exports = Play;

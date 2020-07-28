let mysql = require("mysql");

let dbinfos = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USERNAME,
  charset: "utf8mb4_bin",
};

function handleDisconnect() {
  console.log("Connexion à la bdd");
  connection = mysql.createConnection(dbinfos); // Recreate the connection, since the old one cannot be reused.
  connection.connect(function onConnect(err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log("Error when connecting to db:", err);
      setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
    }
    console.log("Connected as id " + connection.threadId);
    // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on("error", function onError(err) {
    console.log("db error", err);
    if (err.code == "PROTOCOL_CONNECTION_LOST") {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}
handleDisconnect();

module.exports = connection;

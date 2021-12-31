//const MYSQL = require("mysql2")
const db = require('quick.db')
const CONFIG = require("./config.js");
const LOGGER = require("./logger.js")

//const DB = MYSQL.createConnection(CONFIG.DATABASE_0);

  //exports.DB = DB;

  exports.CheckUserInDB = function(userId){
      /*DB.query("SELECT * FROM coins WHERE user_id = ?", userId, function(err, rows){
          if(err) LOGGER.error(err);
          if(rows.length < 1){DB.query("INSERT INTO coins (user_id) VALUES (?)", userId)} else {
              
          }
      })*/
      let user = db.fetch(`coins_${userId}`)
      if(!user) db.set(`coins_${userId}`, 0)
      else {
        
      }
  }

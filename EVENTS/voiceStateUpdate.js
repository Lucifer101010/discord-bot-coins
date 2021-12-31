/////* || [INITIALIZATION] || */////
const LOGGER = require("../INITIALIZATION/logger.js")
const CONFIG = require("../INITIALIZATION/config.js")
const DATABASE = require("../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

var leaved = {};
var alreadyKnow = {};
var timeKnow = {};

/////* || [ACTIONS] || */////
module.exports = async(CLIENT, oldMember, newMember) => {

    let logsChannel = CLIENT.channels.resolve("918960545363796019")
    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;
    let i = 1;
    


    if(newUserChannel != undefined) {
     //   LOGGER.log(`EVENT: ${newMember.member.user.tag} JOINED ${newUserChannel}`)
        DATABASE.CheckUserInDB(newMember.id);
        if(alreadyKnow[newMember.id] == true) return;
        if(newMember.bot) return;
        leaved[newMember.id] = false;
        while(newUserChannel != undefined){
            

            if(leaved[newMember.id] == true){
                alreadyKnow[newMember.id] = false;
                break;
            }
            alreadyKnow[newMember.id] = true;
            await sleep(60000);
            if(!CLIENT.users.cache.get(newMember.id).bot){
                
                let msgauthor = newMember.id;
                /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", msgauthor, function(err, rows){
                    if(err) LOGGER.error(err);
                    if(rows.length < 1) {DATABASE.CheckUserInDB(msgauthor)} else {
                        let currentMoney = rows[0].user_coins;
                        let newMoney = (Math.random() * (1.348 - 0.580) + 0.580);
                        let finalCoins = parseFloat(currentMoney + newMoney);
            
                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalCoins, msgauthor])
                    }
                })*/
                let data = db.fetch(`coins_${msgauthor}`)
                if(!data) db.set(`coins_${msgauthor}`, 0)
                else {

                  let currentMoney = data;
                  let money;

                  if(db.get(`voc_coins_${newMember.guild.id}`)) {
                    if(!newMember.streaming && !newMember.selfVideo){
                      money = db.get(`voc_coins_${newMember.guild.id}`)
                    }
                    else if(newMember.streaming && !newMember.selfVideo) {
                      if(db.get(`stream_coins_${newMember.guild.id}`)) {
                      money = db.get(`stream_coins_${newMember.guild.id}`)
                      }
                    }
                    else if(newMember.selfVideo && !newMember.streaming) {
                      if(db.get(`cam_coins_${newMember.guild.id}`)) {
                      money = db.get(`cam_coins_${newMember.guild.id}`)
                      }
                    }
                    else if(newMember.streaming && newMember.selfVideo){
                      if(db.get(`cam_coins_${newMember.guild.id}`) && db.get(`stream_coins_${newMember.guild.id}`)) {
                      money = db.get(`stream_coins_${newMember.guild.id}`) + db.get(`cam_coins_${newMember.guild.id}`)
                      }
                    }
                    else {
                      money = 0
                    }
                  }

                  /*let newMoney = (Math.random() * (1.348 - 0.580) + 0.580);

                  if(newMember.streaming && !newMember.selfVideo) newMoney = newMoney * 2

                  else if(newMember.streaming && newMember.selfVideo) newMoney = newMoney * 3

                  else if(newMember.selfVideo) newMoney = newMoney * 2*/

                  let finalCoins = parseFloat(currentMoney + money);

                  db.set(`coins_${msgauthor}`, finalCoins)
                }
               // LOGGER.log(`${newMember.member.user.tag} - ${i++}mn`)
              }
              
           
           
       } 
  
  
    } else{
        timeKnow[newMember.id] = 0;
        leaved[newMember.id] = true;
        alreadyKnow[newMember.id] = false;
      //  console.log(`${newMember.member.user.tag} Leaved`)
    }

};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
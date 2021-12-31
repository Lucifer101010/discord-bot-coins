/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const FS = require("fs")
const CANVAS = require("canvas");
var isPlayed = {};
const ms = require('ms')
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'autocoinflip',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if(!CONFIG.OWNERS.includes(message.author.id)) return;
    //if(message.author.id != '188356697482330122' || message.author.id != '659038301331783680' ) return;
    let channelsssssssssssssss;
    if(!ARGS[0]) {
    channelsssssssssssssss = CLIENT.channels.resolve(CONFIG.ROULETTE);
    } else {
      channelsssssssssssssss = message.mentions.channels.first() || message.guild.channels.cache.get(ARGS[0])
    }
        if(!channelsssssssssssssss) return message.channel.send('Salon invalide');
    message.channel.send("*Auto Coinflip* a été activé.")
    setInterval(async () => {
        let channel;
        if(!ARGS[0]) {
        channel = CLIENT.channels.resolve(CONFIG.ROULETTE);
        } else {
          channel = message.mentions.channels.first() || message.guild.channels.cache.get(ARGS[0])
        }
        if(!channel) return;
        
    let steps = ["**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**"];
    let mise = parseFloat(Math.floor(Math.random() * 1000));
    let time = 1000;
    var userMise = {};
    var userParticipate = [];

    let confirm = await channel.send(new DISCORD.MessageEmbed()
                        .setTitle(`Pile ou Face ?`)
                        .setDescription(`La mise est de **${mise}** coins\n\n1️⃣ ・ pile **X2**\n2️⃣ ・ face **X2**\n`)
                        .setFooter('Vous avez 30 secondes pour choisir.')
                        .setImage("https://acegif.com/wp-content/uploads/coin-flip.gif")
                        .setColor(`YELLOW`)
                        )
                        confirm.react("1️⃣"); confirm.react("2️⃣");

                        const filter = (reaction, user) => {
                            return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && !user.bot;
                        };

                        const collector = confirm.createReactionCollector(filter, { time: 30000 });
                        collector.on("collect", async(reaction, user) => {
                            if (reaction.emoji.name === '1️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                let userCoins = db.get(`coins_${user.id}`)
                                if(!userCoins) {
                                  db.set(`coins_${user.id}`, 0)
                                }

                                if(userCoins < mise){
                                  return message.channel.send(`**${user.tag}**, Vous n'avez pas assez de coins.`)
                                } else {

                                  if(!userParticipate.includes(user.id)) {
                                    userMise[user.id] = "pile"
                                    userParticipate.push(user.id)
                                    let msg = await channel.send(`${user} vient de miser sur pile !`)
                                    setTimeout(() => {
                                      msg.delete()
                                    }, ms('2s'))
                                  }
                                  else {
                                    let m = await channel.send(`${user}, tu as déjà misé !`)
                                    setTimeout(() => {
                                      m.delete
                                    })
                                  }
                                }

                                /*if(userCoins < mise){
                                  return message.channel.send(`**${user.tag}**, Vous n'avez pas assez de coins.`)
                                } else {
                                  userMise[user.id] = "pile"
                                  if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                }*/

                                /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return message.channel.send(`**${user.tag}**, Vous n'avez pas assez d'fraises.`)
                                        } else {
                                            userMise[user.id] = "pile"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })*/
                            }
                            if (reaction.emoji.name === '2️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                let userCoins = db.get(`coins_${user.id}`)

                                if(!userCoins) {
                                  db.set(`coins_${user.id}`, 0)
                                }


                                if(userCoins < mise){
                                  return message.channel.send(`**${user.tag}**, Vous n'avez pas assez de coins.`)
                                } else {

                                  if(!userParticipate.includes(user.id)) {
                                    userMise[user.id] = "face"
                                    userParticipate.push(user.id)
                                    let msg = await channel.send(`${user} vient de miser sur face !`)
                                    setTimeout(() => {
                                      msg.delete()
                                    }, ms('2s'))
                                  }
                                  else {
                                    let m = await channel.send(`${user}, tu as déjà misé !`)
                                    setTimeout(() => {
                                      m.delete
                                    })
                                  }
                                }

                                /*if(userCoins < mise){
                                  return message.channel.send(`**${user.tag}**, Vous n'avez pas assez de coins.`)
                                } else {
                                  userMise[user.id] = "face"
                                  if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                }*/
                                /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return message.channel.send(`**${user.tag}**, Vous n'avez pas assez d'fraises.`)
                                        } else {
                                            userMise[user.id] = "face"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })*/
                            }
                        })

                        collector.on('end', collected => {

                            
                        let colorArr = ["1️⃣", "2️⃣"]
                        let color;
                        let couleurGagnante = colorArr[Math.floor(Math.random() * colorArr.length)];
                        let result;
                        let imageF;

                        if(couleurGagnante === "1️⃣") {color = "#2F3136"; result = "pile"; imageF = "https://media.discordapp.net/attachments/659697532015738880/805389689175539712/pile1-removebg-preview.png"}
                        if(couleurGagnante === "2️⃣") {color = "#2F3136"; result = "face"; imageF = "https://media.discordapp.net/attachments/659697532015738880/805389105482825769/face1-removebg-preview.png"}


                        let stringGagnant = "";
                        var alreadyGived = {};
                        userParticipate.forEach(user => {
                            if(userMise[user] === String(result)){
                                console.log('renter mgl')
                                stringGagnant += `<@${user}> `
                                let argent = db.get(`coins_${user}`)
                                let finalArgent;
                                if(result == "pile" || result == "face") finalArgent = mise + argent;
                                db.set(`coins_${user}`, finalArgent)
                                /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent;
                                        if(result == "pile" || result == "face") finalArgent = mise + argent;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })*/
                            }  else {
                                let argent = db.get(`coins_${user}`)
                                let finalArgent = argent - mise;
                                db.set(`coins_${user}`, finalArgent)
                                /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent = argent - mise;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })*/
                            }
                        })

                        if(stringGagnant.length < 1) stringGagnant = "aucun gagnant !"
                        channel.send(new DISCORD.MessageEmbed()
                            .setImage(imageF)
                            .setTitle('Résultat: ' + result)
                            .setColor(`YELLOW`)
                        )
                        channel.send(`Les gagnants sont: ${stringGagnant}`)
                        //isPlayed[message.channel.id] = false;
                        });



                        /*.setTitle(`Pile ou Face ?`)
                        .setColor(`#2F3136`)
                        .setDescription(`La mise est de _**${mise} coins**_\n\n1️⃣ ・ pile **X2**\n2️⃣ ・ face **X2**\n\n Vous avez *30* secondes pour choisir.`)
                        //.setImage("https://acegif.com/wp-content/uploads/coin-flip.gif")
                        )
                        confirm.react("1️⃣"); confirm.react("2️⃣");

                        const filter = (reaction, user) => {
                            return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && !user.bot;
                        };

                        const collector = confirm.createReactionCollector(filter, { time: 30000 });
                        collector.on("collect", (reaction, user) => {
                            if (reaction.emoji.name === '1️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return user.send("Vous n'avez pas assez d'argent.")
                                        } else {
                                            userMise[user.id] = "pile"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                            if (reaction.emoji.name === '2️⃣') {
                                DATABASE.CheckUserInDB(user.id);
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user.id, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let userCoins = rows[0].user_coins;

                                        if(userCoins < mise){
                                            return user.send("Vous n'avez pas assez d'argent.")
                                        } else {
                                            userMise[user.id] = "face"
                                            if(!userParticipate.includes(user.id)) userParticipate.push(user.id)
                                        }
                                    }
                                })
                            }
                        })

                        collector.on('end', collected => {

                            
                        let colorArr = ["1️⃣", "2️⃣"]
                        let color;
                        let couleurGagnante = colorArr[Math.floor(Math.random() * colorArr.length)];
                        let result;
                        let imageF;

                        if(couleurGagnante === "1️⃣") {color = "#2F3136"; result = "Result : *pile*"; imageF = "http://pileouface.org/pile1.png"}
                        if(couleurGagnante === "2️⃣") {color = "#2F3136"; result = "Result : *face*"; imageF = "http://pileouface.org/face1.png"}


                        let stringGagnant = "";
                        var alreadyGived = {};
                        userParticipate.forEach(user => {
                            if(userMise[user] === result){
                                stringGagnant += `<@${user}> `
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent;
                                        if(result == "pile" || result == "face") finalArgent = mise + argent;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })
                            }  else {
                                DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", user, function(err, rows){
                                    if(err) LOGGER.error(err);
                                    if(rows.length < 1){} else {
                                        let argent = rows[0].user_coins;
                                        let finalArgent = argent - mise;
                                        DATABASE.DB.query("UPDATE coins SET user_coins = ? WHERE user_id = ?", [finalArgent, user])
                                    }
                                })
                            }
                        })

                        if(stringGagnant.length < 1) stringGagnant = "aucun"
                        channel.send(new DISCORD.MessageEmbed()
                            .setImage(imageF)
                            .setTitle(result)
                        )
                        channel.send(`Les gagnants sont: ${stringGagnant}`)
                        isPlayed[message.channel.id] = false;
                        });*/
                    }, 60000) // 180000

}
}


module.exports.config = {
    category: "owner",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["autopileface"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour jouer au coinflp",
    utilisations: `.autoCoinFlip`,
    exemples: `.autoCoinFlip`
}
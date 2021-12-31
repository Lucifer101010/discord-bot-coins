/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'coins',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///
    DATABASE.CheckUserInDB(message.author.id);

    ///* || [GET USER COINS] || *///
    let user = message.mentions.members.first() || message.guild.members.cache.get(ARGS[0]) || message.author
    if(user) user = user.id

    let user_coins = db.get(`coins_${user}`)
    if(!user_coins) {
      message.channel.send(`**<@${user}>**, vous avez **0.00** coins.`)
    }
    else {
      let userFixedCoins = parseFloat(user_coins).toFixed(2);
      message.channel.send(`**<@${user}>**, vous avez **${userFixedCoins}** coins.`)
    }
    /*DATABASE.DB.query("SELECT * FROM coins WHERE user_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1){
            DATABASE.CheckUserInDB(message.author.id);
            message.channel.send(`**${message.author.tag}**, vous avez **0.00** fraises.`)
        } else {
            let userFixedCoins = parseFloat(rows[0].user_coins).toFixed(2);
            message.channel.send(`**${message.author.tag}**, vous avez **${userFixedCoins}** fraises.`)
        }
    })*/

}
}



module.exports.config = {
    category: "Banque",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["coins"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour acceder à votre portefeuille",
    utilisations: `.fraises`,
    exemples: `.fraises`
}
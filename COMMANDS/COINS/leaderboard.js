/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'leaderboard',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    ///* || [GET TOP COINS] || *///

    let money = db.all().filter(data => data.ID.startsWith(`coins_`)).sort((a, b) => b.data - a.data)
            money.length = 10
            var finalLb = ""
            for(var i in money) {
                finalLb += `**${money.indexOf(money[i])+1})** ${CLIENT.users.cache.get(money[i].ID.slice(6))} -> \`$${money[i].data.toLocaleString()}\`\n`
            }
            const embed = new DISCORD.MessageEmbed()
            .setTitle("Leaderboard")
            .setTimestamp()
            .setColor('WHITE')
            .setDescription(`
${finalLb}
            `)
            message.channel.send(embed);


    /*DATABASE.DB.query("SELECT * FROM coins ORDER BY user_coins DESC LIMIT 10", async function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1 ) {message.channel.send("...")} else {
            let embed = new DISCORD.MessageEmbed();
            for(var i = 0; i < rows.length; i++){
                let money = (rows[i].user_coins).toFixed(2);
                let user = await message.guild.members.resolve(rows[i].user_id);
                if(user) embed.addField(`${user.user.tag}`, `${money} \`fraises\``, false);
                embed.setTitle(`Leaderboard sur **${message.guild.name}**`)
                embed.setColor(`#2F3136`)
                
                
            }
            LOGGER.log("24")
            message.channel.send(embed);


        }
        
    })*/

}
}



module.exports.config = {
    category: "Banque",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["lb"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour voir les plus riches du serveur!",
    utilisations: `.leaderboard`,
    exemples: `.leaderboard`
}
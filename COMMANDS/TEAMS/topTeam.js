/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'top',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [GET TOP COINS] || *///

    let money = db.all().filter(data => data.ID.startsWith(`team_xp_`)).sort((a, b) => b.data - a.data)
            money.length = 10
            var finalLb = ""
            for(var i in money) {
                finalLb += `**${money.indexOf(money[i])+1})** ${db.get(`team_name_id_${money[i].ID.slice(8)}`)} -> \`$${parseFloat(money[i].data.toLocaleString()).toFixed(2)}\`\n`
            }
            const embed = new DISCORD.MessageEmbed()
            .setTitle("Leaderboard team")
            .setTimestamp()
            .setColor('YELLOW')
            .setDescription(`
${finalLb}
            `)
            message.channel.send(embed);




    /*DATABASE.DB.query("SELECT * FROM teams ORDER BY team_experience DESC LIMIT 10", function(err, rows){
        if(err) LOGGER.error(err);
        let embed = new DISCORD.MessageEmbed()
        if(rows.length < 1) {return message.channel.send("Auncune team trouvé")} else {
            for(var i = 0; i < rows.length; i++){
                let experience = (rows[i].team_experience).toFixed(2);
                let name = rows[i].team_name;
                embed.setColor(`#2F3136`)
                embed.setTitle(`Teams Leaderboard sur **${message.guild.name}**`)
                embed.addField(`${name}`, `${experience}`);
            }
        }

        return message.channel.send(embed);
    })*/

}
}



module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["lbTeam"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour la plus grosse teaam du serveur!",
    utilisations: `.topTeam`,
    exemples: `.topTeam`
}
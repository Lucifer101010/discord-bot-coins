/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'leave',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///

    let isTeam = false
    let database_experience;
    let database_chief;
    let database_name;
    let database_role;
    let database_members;
    let database_text;
    let database_voice;
    let d;
    let database = await db.all().filter(data => data.ID.startsWith(`team_id_`)).forEach(data2 => {
        d = data2.data.slice(1, -1)
        
        let team_id = db.get(`team_members_id_${d}`)

        
        if(team_id.members.includes(message.author.id)) {
          isTeam = true
          database_experience = db.get(`team_xp_${d}`)
          database_chief = db.get(`team_chief_id_${d}`)
          database_name = db.get(`team_name_id_${d}`)
          database_role = db.get(`team_role_id_${d}`)
          database_members = db.get(`team_members_id_${d}`)
          database_text = db.get(`team_text_id_${d}`)
          database_voice = db.get(`team_voice_id_${d}`)
          mString = "";
          database_members.members.forEach(member => {
            mString += `<@${member}>\n`
          })
        }
        else {
          //return message.channel.send(`<@${target}>, tu n'est pas dans une team!`)
        }
    })

    if(isTeam == false) return message.channel.send(`**${message.author}**, tu n'est pas dans une team !`)

    let confirm = await message.channel.send(new DISCORD.MessageEmbed()
                        .setTitle(`Vous allez quitter la team: **${database_name}** sur **${message.guild.name}**`)
                        .setColor(`#2F3136`)
                        .setDescription(`Cliquez sur l'emoji ✅ pour quitter la team \nCliquez sur l'emoji ❌ pour annuler \nVous avez 5mn...`)
                    )
                    confirm.react("✅"); confirm.react("❌");

                    const Reactfilter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    confirm.awaitReactions(Reactfilter, { max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            message.channel.send(`Vous avez quitté la team ${database_name}`)

                            CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(message.author.id).roles.remove(database_role);
                            CLIENT.channels.resolve(database_text).send(`**${message.author}**, à quitté la team!`)

                            const index = database_members.members.indexOf(message.author.id);
                            if (index > -1) {
                                database_members.members.splice(index, 1);
                            }

                            db.set(`team_members_id_${d}`, database_members)

                            //DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), team_chief]);
                        }

                        if (reaction.emoji.name === '❌') {
                            message.channel.send(`Vous avez annulé.`)
                        }
                        })














    /*DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
        if(err) LOGGER.error(err);
        isTeam = false
        let rID;
        if(rows.length < 1) {isTeam = false} else {
            for(var i = 0; i < rows.length; i++){
                let mJson = JSON.parse(rows[i].team_members).members;
    
                await mJson.forEach(value => {if(value === message.author.id){isTeam = true; rID = i;}})
            }

            if(isTeam == false) return message.channel.send(`**${message.author.tag}**, tu n'as pas de team, mskn ta pas d'amis!`)

                    let team_name = rows[rID].team_name;
                    let team_chief = rows[rID].team_chief_id;
                    let team_role = rows[rID].team_role_id;
                    let team_text = rows[rID].team_text_id;
                    let team_members = JSON.parse(rows[rID].team_members);
                    let team_id = rows[rID].team_id;
                    let team_experience = (rows[rID].team_experience).toFixed(2);

            let confirm = await message.channel.send(new DISCORD.MessageEmbed()
                        .setTitle(`Vous allez quitter la team: **${team_name}** sur **${message.guild.name}**`)
                        .setColor(`#2F3136`)
                        .setDescription(`Cliquez sur l'emoji ✅ pour quitter la team \n Cliquez sur l'emoji ❌ pour annuler \n Vous avez 5mn...`)
                    )
                    confirm.react("✅"); confirm.react("❌");

                    const Reactfilter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    confirm.awaitReactions(Reactfilter, { max: 1, time: 300000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            message.channel.send(`Vous avez quitté la team ${team_name}`)

                            CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(message.author.id).roles.remove(team_role);
                            CLIENT.channels.resolve(team_text).send(`**${message.author.tag}**, à quitté la team!`)

                            const index = team_members.members.indexOf(message.author.id);
                            if (index > -1) {
                                team_members.members.splice(index, 1);
                            }

                            DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), team_chief]);
                        }

                        if (reaction.emoji.name === '❌') {
                            message.channel.send(`Vous avez annulé.`)
                        }
                    })
        }

        
    })*/
    

}
}


module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["leave"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour quitter votre team actuelle",
    utilisations: `.leave`,
    exemples: `.leave`
}
/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'kick',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///

    let database_chief = db.get(`team_chief_id_${message.author.id}`)
    let database_members = db.get(`team_members_id_${message.author.id}`)
    let database_role = db.get(`team_role_id_${message.author.id}`)
    let database_text = db.get(`team_text_id_${message.author.id}`)
    let database_name = db.get(`team_name_id_${message.author.id}`)
    let database_voice = db.get(`team_voice_id_${message.author.id}`)

    let target = message.mentions.members.first() || message.guild.members.cache.get(ARGS[0]);
    if(!target) return message.channel.send(`**${message.author}**, vous devez mentionnez la personne à expulser...`)

    if(!database_chief) return message.channel.send(`**${message.author}**, tu n'est pas le chef d'une team !`)

    if(!database_role) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: role invalide...`)
    if(!database_text) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: salon invalide...`)
    if(!database_name) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: nom invalide...`)

    let isTeam = false

    let database = await db.all().filter(data => data.ID.startsWith(`team_id_`)).forEach(data2 => {
        let d = data2.data.slice(1, -1)
        
        let team_id = db.get(`team_members_id_${d}`)

        if(team_id.members.includes(target.id) && team_id.members.includes(message.author.id)) {
          isTeam = true
        }
        else {
          //return message.channel.send(`<@${target}>, tu n'est pas dans une team!`)
        }
    })

    if(isTeam == false) return message.channel.send(`${target.user}, n'est pas dans votre team !`)


    await target.send(new DISCORD.MessageEmbed()
    .setTitle(`Vous avez été __explusé__ de la team: **${database_name}** sur **${message.guild.name}**`)
    .setColor(`#2F3136`)
    )
    CLIENT.channels.resolve(database_text).send(`${target.user} a été expulsé de la team !`)
    CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(target.user.id).roles.remove(database_role);

    const index = database_members.members.indexOf(target.user.id);
    if (index > -1) {
        database_members.members.splice(index, 1);
    }

    db.set(`team_members_id_${message.author.id}`, database_members)

    //DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), message.author.id]);





    /*DATABASE.DB.query("SELECT * FROM teams WHERE team_chief_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1) {return message.channel.send(`**${message.author.tag}**, vous n'avez pas de team / permissions pour expulser un membre...`)} else {
            let team_members = JSON.parse(rows[0].team_members);
            let team_role = rows[0].team_role_id; 
            let team_text = rows[0].team_text_id;
            let team_name = rows[0].team_name;

            let target = message.mentions.members.first(); if(!target) return message.channel.send(`**${message.author.tag}**, vous devez mentionnez la personne à expulser...`)
            if(target.user.id == message.author.id) return message.channel.send(`**${message.author.tag}**, vous ne pouvez pas vous expluser..`)
            if(!team_role) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_text) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_name) return message.channel.send(`**${message.author.tag}**, impossible d'expulser cet utilisateur à votre team: ERREUR INCONNU...`)

            DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
                if(err) LOGGER.error(err);
                isTeam = false
                if(rows.length < 1) {isTeam = false} else {
                    for(var i = 0; i < rows.length; i++){
                        let mJson = JSON.parse(rows[i].team_members).members;
            
                        mJson.forEach(value => {if(value == target.user.id) isTeam = true;})
                    }
                    
                    if(isTeam == false) return message.channel.send(`<@${target.user.id}>, n'est pas dans votre team!`)

                    await target.send(new DISCORD.MessageEmbed()
                        .setTitle(`Vous avez été __explusé__ de la team: **${team_name}** sur **${message.guild.name}**`)
                        .setColor(`#2F3136`)
                    )
                    CLIENT.channels.resolve(team_text).send(`<@${target.user.id}> a été expulsé de la team!`)
                    CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(target.user.id).roles.remove(team_role);

                    const index = team_members.members.indexOf(target.user.id);
                    if (index > -1) {
                        team_members.members.splice(index, 1);
                    }

                    DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), message.author.id]);

                }
            })
            
        }
    })*/



}
}

module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["kick"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour expulser quelqu'un dans votre team",
    utilisations: `.kick`,
    exemples: `.kick`
}
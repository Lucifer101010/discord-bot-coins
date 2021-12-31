/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'invite',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {

    ///* || [CHECK USER IN DB] || *///

    let database_chief = db.get(`team_chief_id_${message.author.id}`)
    let database_members = db.get(`team_members_id_${message.author.id}`)
    let database_role = db.get(`team_role_id_${message.author.id}`)
    let database_text = db.get(`team_text_id_${message.author.id}`)
    let database_name = db.get(`team_name_id_${message.author.id}`)
    let database_voice = db.get(`team_voice_id_${message.author.id}`)

    let target = message.mentions.members.first() || message.guild.members.cache.get(ARGS[0]);
    if(!target) return message.channel.send(`**${message.author}**, vous devez mentionnez la personne à inviter...`)

    if(!database_chief) return message.channel.send(`**${message.author}**, tu n'est pas le chef d'une team !`)

    if(!database_role) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: role invalide...`)
    if(!database_text) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: salon invalide...`)
    if(!database_name) return message.channel.send(`**${message.author}**, impossible d'ajouter cet utilisateur à votre team: nom invalide...`)

    let isTeam = false

    let database = await db.all().filter(data => data.ID.startsWith(`team_id_`)).forEach(data2 => {
        let d = data2.data.slice(1, -1)
        
        let team_id = db.get(`team_members_id_${d}`)

        if(team_id.members.includes(target.id)) {
          isTeam = true
        }
        else {
          //return message.channel.send(`<@${target}>, tu n'est pas dans une team!`)
        }
    })

    if(isTeam == true) return message.channel.send(`**${message.author}**, la personne est déjà dans une team!`)

    message.channel.send(`L'invitation à été envoyée, si le destinataire n'as rien reçu il doit activer ses messages privés`)

    let confirm = await target.send(new DISCORD.MessageEmbed()
        .setTitle(`Vous avez été __invité__ à rejoindre la team: **${database_name}** sur **${message.guild.name}**`)
        .setColor(`#2F3136`)
        .setDescription(`Cliquez sur l'emoji ✅ pour accepter l'invitation \n Cliquez sur l'emoji ❌ pour refuser l'invitation \n L'invitation expire dans *10* minutes...`)
    )
    confirm.react("✅"); confirm.react("❌");

    const Reactfilter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.user.id;
    };

    confirm.awaitReactions(Reactfilter, { max: 1, time: 600000, errors: ['time'] })
    .then(async collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '✅') {
            target.send(`Vous faites maintenant parti de la team ${database_name}`)

            CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(target.user.id).roles.add(database_role);
            CLIENT.channels.resolve(database_text).send(`${target.user}, fait maintenant parti de votre team!`)

            database_members.members.push(target.user.id);
            
            db.set(`team_members_id_${message.author.id}`, database_members)

            //DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), message.author.id]);
        }

        if (reaction.emoji.name === '❌') {
            target.send(`Vous avez refusé l'invitation.`)
            CLIENT.channels.resolve(database_text).send(`${target.user} a refusé l'invitation à la team!`)
        }
    })
    




    /*DATABASE.DB.query("SELECT * FROM teams WHERE team_chief_id = ?", message.author.id, function(err, rows){
        if(err) LOGGER.error(err);
        if(rows.length < 1) {return message.channel.send(`**${message.author.tag}**, vous n'avez pas de team...`)} else {
            let team_members = JSON.parse(rows[0].team_members);
            let team_role = rows[0].team_role_id; 
            let team_text = rows[0].team_text_id;
            let team_name = rows[0].team_name;

            let target = message.mentions.members.first(); if(!target) return message.channel.send(`**${message.author.tag}**, vous devez mentionnez la personne à inviter...`)
            if(!team_role) return message.channel.send(`**${message.author.tag}**, impossible d'ajouter cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_text) return message.channel.send(`**${message.author.tag}**, impossible d'ajouter cet utilisateur à votre team: ERREUR INCONNU...`)
            if(!team_name) return message.channel.send(`**${message.author.tag}**, impossible d'ajouter cet utilisateur à votre team: ERREUR INCONNU...`)

            DATABASE.DB.query("SELECT * FROM teams", async function(err, rows){
                if(err) LOGGER.error(err);
                isTeam = false
                if(rows.length < 1) {isTeam = false} else {
                    for(var i = 0; i < rows.length; i++){
                        let mJson = JSON.parse(rows[i].team_members).members;
            
                        mJson.forEach(value => {if(value == target.user.id) isTeam = true;})
                    }
                    
                    if(isTeam == true) return message.channel.send(`**${message.author.tag}**, est déjà dans une team!`)
                    message.channel.send(`L'invitation à été envoyée, si le destinataire n'as rien reçu il doit activer ses messages privés`)

                    let confirm = await target.send(new DISCORD.MessageEmbed()
                        .setTitle(`Vous avez été __invité__ à rejoindre la team: **${team_name}** sur **${message.guild.name}**`)
                        .setColor(`#2F3136`)
                        .setDescription(`Cliquez sur l'emoji ✅ pour accepter l'invitation \n Cliquez sur l'emoji ❌ pour refuser l'invitation \n L'invitation expire dans *10* minutes...`)
                    )
                    confirm.react("✅"); confirm.react("❌");

                    const Reactfilter = (reaction, user) => {
                        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.user.id;
                    };

                    confirm.awaitReactions(Reactfilter, { max: 1, time: 600000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first();

                        if (reaction.emoji.name === '✅') {
                            target.send(`Vous faites maintenant parti de la team ${team_name}`)

                            CLIENT.guilds.resolve(CONFIG.MAINGUILD).members.resolve(target.user.id).roles.add(team_role);
                            CLIENT.channels.resolve(team_text).send(`<@${target.user.id}>, fait maintenant parti de votre team!`)

                            team_members.members.push(target.user.id); DATABASE.DB.query("UPDATE teams SET team_members = ? WHERE team_chief_id = ?", [JSON.stringify(team_members), message.author.id]);
                        }

                        if (reaction.emoji.name === '❌') {
                            target.send(`Vous avez refusé l'invitation.`)
                            CLIENT.channels.resolve(team_text).send(`<@${target.user.id}> a refusé l'invitation à la team!`)
                        }
                    })

                }
            })
            
        }
    })*/



}
}


module.exports.config = {
    category: "Team",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["invite"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour inviter quelqu'un dans votre team",
    utilisations: `.invite`,
    exemples: `.invite`
}
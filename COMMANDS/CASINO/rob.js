const Discord = require('discord.js'); 
const { Client, Message } = require('discord.js');
const db = require('quick.db');
const talkedRecently = new Set();

module.exports = {
    name: "rob",
    description: "tenter de voler quelqu'un",
    usage: "-rob <mention/id>",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args)=>{

      if (talkedRecently.has(message.author.id)) {
            message.channel.send(`Tu as déjà rob une personne ! Tu peux exécuter cette commande toutes les 1h30 !`);

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if(!user) return message.channel.send('Vous devez mentionner la personne que vous voulez voler !');


        if(user === message.author.id) return message.reply("Vous ne pouvez pas vous voler vous-même");

        let moneydb = db.fetch(`coins_${message.author.id}`);
        let userdb = db.get(`coins_${user.id}`)

        if(!userdb) return message.channel.send('Cette personne n\'a aucun coins !')

        let robwin = Math.floor(Math.random() * 50) + 10;

        if(userdb < robwin) robwin = userdb

        if(!moneydb) {
          db.set(`coins_${message.author.id}`, 0)
        }

        
        let fdp = new Discord.MessageEmbed()
        .setTitle('Rob')
        .setDescription(`Vous venez de voler <@${user.id}> et vous obtenez ${robwin}`)
        .setTimestamp()
        .setColor("YELLOW");

        message.channel.send(fdp); 

        await db.set(`coins_${user.id}`, userdb - robwin);
        await db.set(`coins_${message.author.id}`, robwin + moneydb);

        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, 4680000);
    }
}
}
const travail = require('../../travail.json')
const travaill = travail[Math.floor(Math.random() * travail.length)];
const Discord = require('discord.js')
const db = require('quick.db')
const ms = require('ms')
const talkedRecently = new Set();

module.exports = {
  name: 'work',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if (talkedRecently.has(message.author.id)) {
            console.log(talkedRecently.values(message.author.id))
            message.channel.send(`Tu as déjà travillé ! Tu peux exécuter cette commande toutes les 5 minutes !`);
    } else {

        let userCoins = db.get(`coins_${message.author.id}`)
        if(!userCoins) {
          db.set(`coins_${message.author.id}`, 0)
        }

        let currentMoney = userCoins
        let newMoney = Math.floor(Math.random() * (80 - 0.132) + 0.580);
        //(Math.random() * (0.564 - 0.132) + 0.132)

        const embed = new Discord.MessageEmbed()
        .setTitle('Work')
        .setColor('YELLOW')
        .setDescription(`Tu as travaillé en tans que ${travaill} et tu as gagné ${newMoney}`)
        .setTimestamp()

        message.channel.send(embed)

        let finalCoins = parseFloat(currentMoney + newMoney);

        db.set(`coins_${message.author.id}`, finalCoins)

        talkedRecently.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(message.author.id);
        }, 300000);

  }
}
}

module.exports.config = {
    category: "Casino",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["travail"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour travailler",
    utilisations: `.work`,
    exemples: `.work`
}
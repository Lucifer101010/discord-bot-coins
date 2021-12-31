const DISCORD = require('discord.js')
const db = require('quick.db')
const ms = require('ms')
const CONFIG = require('../../INITIALIZATION/config.js')

module.exports = {
  name: 'enchere',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if(!CONFIG.OWNERS.includes(message.author.id)) return;
 
    let channel = message.channel
    if(!channel) return;

    if(!ARGS[1]) {
      return message.channel.send('Veuillez entrer un temps puis un pris !')
    }
        
    let steps = ["**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**", "**Début dans quelques secondes.**", "**Début dans quelques secondes..**", "**Début dans quelques secondes...**"];
    let mise = 400
    let time = ms(ARGS[0]);
    var userMise = {};
    var userParticipate = [];
    var winner;
    let price = message.content.slice(ARGS[0].length + 10)

    const embed = new DISCORD.MessageEmbed()
    .setTitle(`Enchères ! Prix: ${message.content.slice(ARGS[0].length + 10)}`)
    .setDescription(`Les enchères sont ouvertes pour **${mise + 100}** coins !`)
    .setColor('YELLOW')
    .setFooter(`Vous avez ${ARGS[0]} pour miser.`)
    .setImage("https://tenor.com/NziY.gif")

    let confirm = await channel.send(embed)
                        confirm.react("🎉");

                        const filter = (reaction, user) => {
                            return ['🎉'].includes(reaction.emoji.name) && !user.bot;
                        };

                        const collector = confirm.createReactionCollector(filter, { time: time });
                        collector.on("collect", async(reaction, user) => {

                        confirm.reactions.resolve("🎉").users.remove(user.id);
                        
                       let userCoins = db.get(`coins_${user.id}`)
                       if(!userCoins) {
                         return message.channel.send(`${user}, tu n'as pas assez de coins !`).then(msg => {
                           setTimeout(() => {
                             msg.delete()
                           }, ms('2s'))
                         })
                       }
                       else if(userCoins < mise + 100) {
                         return message.channel.send(`${user}, tu n'as pas assez de coins !`).then(msg => {
                           setTimeout(() => {
                             msg.delete()
                           }, ms('2s'))
                         })
                       }
                       else if(userCoins >= mise + 100) {
                         if(winner == user.id) {
                           return message.channel.send(`${user}, tu est déjà le dernier enchérisseur !`).then(msg => {
                           setTimeout(() => {
                             msg.delete()
                           }, ms('2s'))
                         })
                         }
                         else {
                           mise = mise + 100
                            embed.setDescription(`La mise est de ${mise} coins par ${user}`)
                            confirm.edit(embed)
                            message.channel.send(`${user}, tu viens de misé ${mise} coins pour ${price} !`).then(msg => {
                              setTimeout(() => {
                                msg.delete()
                              }, ms('2s'))
                            })
                            winner = user.id
                          }
                       }

                        })
                        collector.on('end', collected => {
                          if(!winner) return message.channel.send('Personne n\'a misé...')
                          else {
                            let u = message.guild.members.cache.get(winner)
                            embed.setDescription(`Enchère terminé ! Le gagnant est ${u} qui avait misé ${mise} coins`)
                            embed.setImage("https://tenor.com/bwwJZ.gif")
                            confirm.edit(embed)
                            message.channel.send(`Enchère terminé ! Le gagnant est ${u} qui avait misé ${mise} coins`)

                            let usercoins = db.get(`coins_${winner}`)

                            db.set(`coins_${winner}`, usercoins - mise)
                          }
                        })
}
}

module.exports.config = {
    category: "Casino",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["encheres"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour faire une enchere",
    utilisations: `.enchere`,
    exemples: `.enchere`
}
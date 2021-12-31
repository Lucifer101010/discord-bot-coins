/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'reset',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if(!CONFIG.OWNERS.includes(message.author.id)) return;
    message.channel.send('Voulez vous vraiment reset l\'économie ? (`oui`/`non`)')
    const filter = m => m.author.id == message.author.id;

    message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
    .then(async collected => {
      if(collected.first().content.toLowerCase() == 'oui') {
        let m = await message.channel.send('Suppression de la database...')
        db.all().filter(data => data.ID.startsWith(`team`)).forEach(data2 => db.delete(`${data2.ID}`))
        db.all().filter(data => data.ID.startsWith(`coins`)).forEach(data2 => db.delete(`${data2.ID}`))
        m.edit('Éconmie reset avec succès !')
      }
      else if(collected.first().content.toLowerCase() == 'non') {
        message.channel.send('Reset de l\'économie annulé !')
      }
      else {
        message.channel.send('Réponse invalide')
      }
    })
  }
}



module.exports.config = {
    category: "owners",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["reset"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour reset l'éconmie du serveur !",
    utilisations: `.reset`,
    exemples: `.reset`
}
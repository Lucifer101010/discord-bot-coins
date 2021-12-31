/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'economy',
  aliases: ["economie"],
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    let voc = db.get(`voc_coins_${message.guild.id}`)
    let cam = db.get(`cam_coins_${message.guild.id}`)
    let stream = db.get(`stream_coins_${message.guild.id}`)

    const embed = new DISCORD.MessageEmbed()
    .setTitle('Economie')
    .setColor('YELLOW')
    .setTimestamp()
    .setDescription(`🔊 Vocal sans stream ni caméra: **${voc} coins**\n🎥 Vocal sans stream mais avec caméra: **${cam} coins**\n🖼️ Vocal avec stream mais sans caméra: **${stream} coins**\n♡ Vocal avec stream et avec caméra: **${stream + cam} coins**`)

    message.channel.send(embed)
  }
}



module.exports.config = {
    category: "Coins",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["economie"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour voir l'économie du serveur",
    utilisations: `.fraises`,
    exemples: `.fraises`
}
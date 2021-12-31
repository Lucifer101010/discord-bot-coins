/////* || [INITIALIZATION] || */////
const LOGGER = require("../../INITIALIZATION/logger")
const CONFIG = require("../../INITIALIZATION/config.js")
const DATABASE = require("../../INITIALIZATION/db.js")
const DISCORD = require("discord.js");
const db = require('quick.db')

/////* || [ACTIONS] || */////
module.exports = {
  name: 'set',
  run: async(CLIENT, message, ARGS, PREFIXARRAY) => {
    if(!CONFIG.OWNERS.includes(message.author.id)) return;

    let voc = db.get(`voc_coins_${message.guild.id}`);
    let stream = db.get(`stream_coins_${message.guild.id}`);
    let camera = db.get(`cam_coins_${message.guild.id}`);

    const embed = new DISCORD.MessageEmbed()
    .setTitle(`Économie`)
    .setColor('YELLOW')
    .setTimestamp()
    .setDescription(`Les personnes en vocal (sans stream et sans caméra): **${voc} coins**\nLes personnes en vocal (avec stream et sans caméra): **${stream} coins**\nLes personnes en vocal (sans stream et avec caméra): **${camera} coins**\nLes personnes en vocal (avec stream et caméra): **${stream + camera} coins** (automatique)\n\n**🔊 => vocal\n🖼️=> stream\n🎥 => caméra**`)
    
    let msg = await message.channel.send(embed)
    msg.react('🔊')
    msg.react('🖼️')
    msg.react('🎥')

    
    let collector = msg.createReactionCollector((reaction, user) => user.id === message.author.id);

        ///* || [CHECK USER IN DB] || *///

    ///* || [COLLECTOR] || *///
    collector.on("collect", async(reaction, user) => {
      if(reaction._emoji.name == '🔊') {
        let m = await message.channel.send('Veuillez entrer le nombre de coins qu\'une personne gagne en étant en vocal')
        msg.reactions.resolve("🔊").users.remove(user.id);


        const filter = m => m.author.id == message.author.id;

        message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
        .then(async collected => {
          m.delete()
          if(!parseInt(collected.first().content)) return message.channel.send('Nombre invalide')

          if(isNaN(collected.first().content)) return message.channel.send('Nombre invalide')

          db.set(`voc_coins_${message.guild.id}`, parseInt(collected.first().content))

          voc = parseInt(collected.first().content)

          embed.setDescription(`Les personnes en vocal (sans stream et sans caméra): **${voc} coins**\nLes personnes en vocal (avec stream et sans caméra): **${stream} coins**\nLes personnes en vocal (sans stream et avec caméra): **${camera} coins**\nLes personnes en vocal (avec stream et caméra): **${stream + camera} coins** (automatique)\n\n**🔊 => vocal\n🖼️=> stream\n🎥 => caméra**`)
          msg.edit(embed)

          collected.delete()

        })
        
      }
      if(reaction._emoji.name == '🖼️') {
        let m = await message.channel.send('Veuillez entrer le nombre de coins qu\'une personne gagne en étant en stream')
        msg.reactions.resolve("🖼️").users.remove(user.id);


        const filter = m => m.author.id == message.author.id;

        message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
        .then(async collected => {
          m.delete()
          if(!parseInt(collected.first().content)) return message.channel.send('Nombre invalide')

          if(isNaN(collected.first().content)) return message.channel.send('Nombre invalide')

          db.set(`stream_coins_${message.guild.id}`, parseInt(collected.first().content))

          stream = parseInt(collected.first().content)

          embed.setDescription(`Les personnes en vocal (sans stream et sans caméra): **${voc} coins**\nLes personnes en vocal (avec stream et sans caméra): **${stream} coins**\nLes personnes en vocal (sans stream et avec caméra): **${camera} coins**\nLes personnes en vocal (avec stream et caméra): **${stream + camera} coins** (automatique)\n\n**🔊 => vocal\n🖼️=> stream\n🎥 => caméra**`)
          msg.edit(embed)

          collected.delete()

        })
        
      }
      if(reaction._emoji.name == '🎥') {
        let m = await message.channel.send('Veuillez entrer le nombre de coins qu\'une personne gagne en étant en caméra')
        msg.reactions.resolve("🎥").users.remove(user.id);


        const filter = m => m.author.id == message.author.id;

        message.channel.awaitMessages(filter, { max: 1, time: 300000, errors: ['time'] })
        .then(async collected => {
          m.delete()
          if(!parseInt(collected.first().content)) return message.channel.send('Nombre invalide')

          if(isNaN(collected.first().content)) return message.channel.send('Nombre invalide')

          db.set(`cam_coins_${message.guild.id}`, parseInt(collected.first().content))

          camera = parseInt(collected.first().content)

          embed.setDescription(`Les personnes en vocal (sans stream et sans caméra): **${voc} coins**\nLes personnes en vocal (avec stream et sans caméra): **${stream} coins**\nLes personnes en vocal (sans stream et avec caméra): **${camera} coins**\nLes personnes en vocal (avec stream et caméra): **${stream + camera} coins** (automatique)\n\n**🔊 => vocal\n🖼️=> stream\n🎥 => caméra**`)
          msg.edit(embed)

          collected.delete()

        })
        
      }
    })
    

  }
}



module.exports.config = {
    category: "Owners",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["streaming"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour set le nombre de coins gagné en stream",
    utilisations: `.stream <nombre de coins>`,
    exemples: `.stream 3`
}
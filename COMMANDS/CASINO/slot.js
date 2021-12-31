const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const slot = ["🍇", "🍉", "🍌", "🍎", "🍒"];

module.exports = {
	name:"slot",
	aliases:['sl'],
	description:"Permet de gagner de jouer à la machine du hasard x)",

	/**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
    */

	run : async(client, message, args) => {

    let user = message.author;
    let moneydb = await db.fetch(`coins_${user.id}`)
    let money = parseInt(args[0]);
    let win = false;


    if (!money) return message.channel.send(`Veuillez spécifier un nombre de coins à parier`);
    if (money > moneydb) return message.channel.send(`Vous n'avez pas assez de coins`);

    let number = []
    for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slot.length); }

    if (number[0] == number[1] && number[1] == number[2])  { 
        money *= 9
        win = true;
    } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
        money *= 3
        win = true;
    }
    if (win) {
        let win = new MessageEmbed()
            .setDescription(`${slot[number[0]]} | ${slot[number[1]]} | ${slot[number[2]]}\n\nVous avez gagné ${money} coins`)
            .setColor('YELLOW')
            .setTimestamp()
        message.channel.send(win)
        db.set(`coins_${user.id}`, money + moneydb)
    } else {
        let loose = new MessageEmbed()
            .setDescription(`${slot[number[0]]} | ${slot[number[1]]} | ${slot[number[2]]}\n\nVous avez perdu ${money} coins`)
            .setColor('YELLOW')
            .setTimestamp();
        message.channel.send(loose)
        db.set(`coins_${user.id}`, moneydb - money)
    }
    }
}

module.exports.config = {
    category: "Casino",
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ["sl"],
    serverForced: true
}

module.exports.help = {
    description: "Commande pour jouer à la machine du hasard",
    utilisations: `.slot <montant>`,
    exemples: `.slot 1000`
}
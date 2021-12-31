const db = require('quick.db');
const Discord = require('discord.js');


module.exports = {
	name: 'bj',
	description: 'Blackjack for a chance to double your money!',
	aliases: ['blackjack'],
	usage: '.blackjack <amount>',
	category: 'economy',
	cooldown: 5,

	run: async(client, message, args, PREFIXARRAY) => {
    let m;
		function re(a, b) {//embed function
			const embed = new Discord.MessageEmbed()
				// Set the title of the field
				.setTitle(a)
				// Set the color of the embed
				.setColor('6FA8DC')
				// Set the main content of the embed
				.setDescription(b);

			// Send the embed to the same channel as the message
			message.channel.send(embed);
		}

		var result = await db.fetch(`coins_${message.author.id}`)
		var bal = result
		var amount = args[0]

		if (amount === 'all' || amount === 'max') {
			if (parseInt(bal) > 500000) {
				amount =  500000
			}else{
				amount = parseInt(bal)
			}
		}
		if (amount === 'half') {
			amount = parseInt(bal) / 2
		}


		if (parseInt(bal) > 10000000) {
			return message.reply('Vous ne pouvez pas miser plus de  10 milions de coins !')
		}

		if (!amount) {
			return message.reply('Tu dois mettre le montant que tu veux parier !');
		}
		if (isNaN(parseInt(amount))) {
			return message.reply('Tu dois mettre le montant que tu veux parier !');
		}


		if (25 > parseInt(amount)) {
			return message.channel.send('Tu ne peux pas miser en dessous de 25 coins !');
		}
		if (10000000 < parseInt(amount)) {
			return message.channel.send('Vous ne pouvez pas miser plus de  10 milions de coins !');

		}

		if (parseInt(bal) < parseInt(amount)) {
			return message.channel.send(
				'Tu ne peux pas miser tout ça ! Tu as seulement ' + bal + ' coins !'
			);
		}

		var over = false

		const options = [2, 3, 4, 5, 6, 7, 8, 9, 10]
		const suits = ['♥', '♦', '♠', '♣']

		var cardvalues = []
		var displaycards = []

		function drawcard() {
			var randomcard = Math.floor(Math.random() * 9);
			var randomsuit = Math.floor(Math.random() * 3);

			displaycards.push('`' + suits[randomsuit] + ' ' + options[randomcard] + '` ')
			cardvalues.push(options[randomcard])
		}



		var bongocards = []
		var bongodisplaycards = []

		function drawcarda() {
			var randomcard = Math.floor(Math.random() * 9);
			var randomsuit = Math.floor(Math.random() * 3);

			bongodisplaycards.push('`' + suits[randomsuit] + ' ' + options[randomcard] + '` ')
			bongocards.push(options[randomcard])
		}
		//	do{

		drawcard()
		drawcard()
		drawcarda()
		amount = parseInt(amount)

		var av = message.author.displayAvatarURL
		
    const embed = new Discord.MessageEmbed()
      .setDescription(`**${message.author.username}‏‏‎** \bB‎‎‎‎‎**Bongo**\nCards - ‎‎‎‎‎${displaycards}\b\bCards - ${bongodisplaycards}`)

      
      .setAuthor(message.author.username +`Blackjack	`, av)
      .setColor(`GREY`)
    m = await message.channel.send(embed)
		
		var bustcards = 0;
		var bongosum = bongocards.reduce((a, b) => {
			return a + b;
		});

		var playersum = cardvalues.reduce((a, b) => {
			return a + b;
		});

		var broski;
		var colora;
		var mmewsage;
		async function bjreturn() {
			if (over === true) {
				return
			}
			bustcards += 1

			bongosum = bongocards.reduce((a, b) => {
				return a + b;
			});

			playersum = cardvalues.reduce((a, b) => {
				return a + b;
			});
			if (parseInt(playersum) > 21 && over === false) {
				mmewsage = 'Tu as perdu !'
				over = true
				var monkey = await db.fetch(`coins_${message.author.id}`)
				bal = monkey
				var newbal = parseInt(bal) - amount
				await db.set(`coins_${message.author.id}`, Math.floor(newbal))
				colora = 'YELLOW'
				broski = ('Tu as perdu !\nTu as ' + playersum + ', ton adversaire a ' + bongosum + '. Tu perds donc ' + amount + ' coins. Tu es maintenant à ' + newbal + ' coins.')

			} else if (parseInt(playersum) === 21) {
				mmewsage = 'Tu as gagné !'
				colora = 'YELLOW'
				var monkey = await db.fetch(`coins_${message.author.id}`)
				bal = monkey
				var newbal = parseInt(bal) + amount
				await db.set(`coins_${message.author.id}`, Math.floor(newbal))
				over = true
				broski = 'Tu as gagné !\nTu gagnes donc ' + amount + ' coins. Tu es maintenant à ' + newbal + ' coins.'

			} else if (bustcards > 4) {
				mmewsage = 'Tu as gagné !'
				colora = 'YELLOW'
				var monkey = await db.fetch(`coins_${message.author.id}`)
				bal = monkey
				var newbal = parseInt(bal) + amount
				await db.set(`coins_${message.author.id}`, Math.floor(newbal))
				over = true
				broski = ('Tu gaganes ' + amount + ' coins ! Tu as pris 5 cartes sans dépasser 21. Tu es maintenant à ' + newbal + ' coins.')

			} else {
				broski = `Blackjack`
        colora = 'YELLOW'

			}



			m.edit({
				content: '',
				embed: {
					color: colora,
					author: {
						name: broski,
						icon_url: av
					},
					description: '',
					footer: {
						icon_url: 'https://cdn.discordapp.com/avatars/780943575394942987/b079e07a200264fc1e721bed6f74cc32.png?size=128',
						text: mmewsage
					},
					fields: [
						{
							name: `**${message.author.username}‏‏‎**`,
							value: `Cartes - ‎‎‎‎‎${displaycards}\nTotal - ` + '`' + ` ${playersum} ` + '`',
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: '‎‎‎‎‎**Adversaire**',
							value: `Cartes - ${bongodisplaycards}\nTotal - ` + '`' + ` ${bongosum} ` + '`',
							inline: true,
						}
					]
				}
			})



		}



		async function checkwinner() {
			if (bongosum > 21) {
				over = true
				mmewsage = 'Tu as gagné !'
				colora = 'GREEN'
				var monkey = await db.fetch(`coins_${message.author.id}`)
				bal = monkey
				var newbal = parseInt(bal) + amount
				await db.set(`coins_${message.author.id}`, Math.floor(newbal))

				await bjreturn()
				broski = ('Tu as gagné ! Ton adversaire a dépasser 21 ! Tu as maintenant ' + newbal + ' coins.')

			}
			if (bongosum < 22 && bongosum > playersum) {
				over = true
				mmewsage = 'Tu as perdu !'
				colora = 'RED'
				var monkey = await db.fetch(`coins_${message.author.id}`)
				bal = monkey
				var newbal = parseInt(bal) - amount
				await db.set(`coins_${message.author.id}`, Math.floor(newbal))
				await bjreturn()
				broski = ('Tu as perdu ! Tu as maintenant ' + newbal + ' coins.')
			}





			m.edit({
				content: '',
				embed: {
					color: colora,
					author: {
						name: broski,
						icon_url: av
					},
					description: '',
					footer: {
						icon_url: 'https://cdn.discordapp.com/avatars/780943575394942987/b079e07a200264fc1e721bed6f74cc32.png?size=128',
						text: mmewsage
					},
					fields: [
						{
							name: `**${message.author.username}‏‏‎**`,
							value: `Cartes - ‎‎‎‎‎${displaycards}\nTotal - ` + '`' + ` ${playersum} ` + '`',
							inline: true,
						},
						{
							name: '\u200B',
							value: '\u200B',
							inline: true,
						},
						{
							name: '‎‎‎‎‎**Adversaire**',
							value: `Cartes - ${bongodisplaycards}\nTotal - ` + '`' + ` ${bongosum} ` + '`',
							inline: true,
						}
					]
				}
			})



		}




		function stand() {

			drawcarda()
			bongosum = bongocards.reduce((a, b) => {
				return a + b;
			});
		}



		async function losehalf() {
			var monkey = await db.fetch(`coins_${message.author.id}`)
			bal = monkey

			var newbal = parseInt(bal) - (amount / 2)
			db.set(`coins_${message.author.id}`, Math.floor(newbal))
			over = true
			return message.channel.send('Entrée invalide! Vous avez perdu **la moitié** de votre pari !')

		}

		// START

		do {

			if (over === false) {
				await bjreturn()
				await message.channel.awaitMessages(m => m.author.id == message.author.id,
					{ max: 1, time: 120000 }).then(collected => {
						if (over !== true) {
							if (collected.first().content.toLowerCase() !== 's' && collected.first().content.toLowerCase() !== 'stand' && collected.first().content.toLowerCase() !== 'h' && collected.first().content.toLowerCase() !== 'hit') {
								if (!over) {
									losehalf()
								}
							}

							if (collected.first().content.toLowerCase() == 'h' || collected.first().content.toLowerCase() == 'hit') {
								drawcard()
								return

							} else if (collected.first().content.toLowerCase() == 's' || collected.first().content.toLowerCase() == 'stand') {

								if (over === false) {
								}
								do {
									stand()

								} while ((bongosum === playersum || bongosum < playersum) && over === false)
								over = true
								checkwinner()
								return;

							}
						}
						else

							over = true

					}).catch(() => {
						if (!over) {
							losehalf()
							over = true
						}
						return;


					});
			}
		} while (over === false)
		//ENd






	},
};
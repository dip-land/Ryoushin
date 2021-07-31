const {MessageEmbed} = require('discord.js'), data = require('../../data.json'), {colors} = require('../../config.json')
module.exports = {
    name: 'Wallet',
    aliases: ['balance', 'bal'],
    description: 'Shows you how much currency you have',
    usage: '',
    examples: [''],
    cooldown: 5,
    category: 'economy',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        const client = message.client;
        let mention = message.mentions.users.first(), user1 = args[0] || message.author.id;
        if (mention){user1 = mention.id}
        try { user1 = client.users.cache.find(user => user.id === user1) } catch(error){ message.reply(`${user1} is not a valid userid.`).then(msg =>{ setTimeout(() =>{msg.delete() }, 3000) })}
        if(data.users[user1.id]){
            message.channel.send({ embeds: [
                new MessageEmbed()
                .setDescription(`Balance: ¥${(data.users[user1.id].money).toLocaleString('ja-JP')}`)
                .setColor(colors.main)
            ]})
        }else{
            message.channel.send('User doesn\'t have a wallet...')
        }
    }
}

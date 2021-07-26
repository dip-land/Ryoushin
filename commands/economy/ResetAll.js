const {writeFile} = require('fs'), data = require('../../data.json'), {economyData} = require('../../config.json')
module.exports = {
    name: 'EconomyResetAll',
    aliases: ['ecomra'],
    description: 'No description, Bot owner only.',
    usage: '',
    examples: [''],
    cooldown: 0,
    category: 'economy',
    nsfw: false,
    disabled: true,
    permissions: 'ADMINISTATOR',
    execute(message, args){
        data.users = {}
        message.client.guilds.fetch('864435982858321920').then(guild =>{
            guild.members.fetch().then(members => {
                members.forEach(member => {
                    if(member.bot){return;}
                    data.users[member.user.id] = {
                        money : 10000,
                        last_stolen : Date.now(),
                        daily_claimed : false
                    }
                })
                setTimeout(() => {
                    writeFile(economyData, JSON.stringify(data, null, 1), (err) =>{ if(err) console.log(err) })
                    message.channel.send('Reset all users.')
                }, 1000)
            })
        })
    }
}

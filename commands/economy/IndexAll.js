const {economyData} = require('../../config.json');
const data = require(economyData);
const {writeFile} = require('fs');
module.exports = {
    name: 'EconomyIndexAll',
    aliases: ['ecomia'],
    description: 'No description, Bot owner only.',
    usage: '',
    examples: [''],
    cooldown: 0,
    category: 'economy',
    nsfw: false,
    disabled: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args){
        if(!data.users){data.users = {}}
        message.client.guilds.fetch('864435982858321920').then(guild =>{
            guild.members.fetch().then(members => {
                members.forEach(member => {
                    if(!data.users[member.user.id]){
                        if(member.bot){return;}
                        data.users[member.user.id] = {money : 10000, last_stolen : Date.now(), daily_claimed : false}
                    }
                })
                setTimeout(() => {
                    writeFile(economyData, JSON.stringify(data, null, 1), (err) =>{ if(err) console.log(err) })
                    message.channel.send('Indexed all users.')
                }, 1000)
            })
        })
    }
}

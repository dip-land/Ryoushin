const {colors, economyData} = require('../../config.json');
const data = require(economyData);
const {writeFile} = require('fs');
const {MessageEmbed} = require('discord.js');
const {random} = require('../../functions.js');
module.exports = {
    name: 'Daily',
    aliases: ['daily', 'claimdaily'],
    description: 'Claim daily cash. Dailies reset at 00:00 UTC',
    usage: `&&daily`,
    examples: ['NONE'],
    cooldown: 5,
    category: 'economy',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        const day = new Date(Date.now()), user = data.users[message.author.id], claimed = random(7000, 9000)
        if(user.daily_claimed === false){
            user.money = user.money + claimed; user.daily_claimed = true
            message.channel.send({embeds: [
                new MessageEmbed()
                .setTitle(`${message.author.tag} Daily Claimed!`)
                .setDescription(`Claimed **¥${claimed.toLocaleString('ja-JP')}**\n\nCome back in **${Math.abs(day.getUTCHours() - 24)} hours, ${Math.abs(day.getUTCMinutes() - 60)} minutes and ${Math.abs(day.getUTCSeconds() - 60)} seconds** to claim your next daily!`)
                .setColor(colors.main)
            ]})
            writeFile(economyData, JSON.stringify(data, null, 1), (err) =>{ if(err) console.log(err) })
        } else {
            message.channel.send({embeds: [
                new MessageEmbed()
                .setTitle(`${message.author.tag} Daily Not ready!`)
                .setDescription(`Your daily isn't ready yet, come back in **${Math.abs(day.getUTCHours() - 24)} hours, ${Math.abs(day.getUTCMinutes() - 60)} minutes and ${Math.abs(day.getUTCSeconds() - 60)} seconds** to claim your daily!`)
                .setColor(colors.main)
            ]})
        }
    }
}

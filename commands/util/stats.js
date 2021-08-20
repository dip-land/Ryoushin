const {MessageEmbed, version} = require('discord.js');
const {colors} = require("../../config.json");
const moment = require("moment");
const fetch = require('node-fetch');
require('dotenv').config();
require("moment-duration-format");

module.exports = {
    name: 'Stats',
    aliases: ['bot', 'uptime', 'botinfo', 'botstats'],
    description: 'Shows bots stats.',
    usage: '&&stats',
    examples: ['NONE'],
    cooldown: 25,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        const client = message.client, uptime = moment.duration(client.uptime).format("d[d], hh[h], mm[m]");
        message.channel.send('```Loading...```').then(msg =>{
            fetch('https://ryoushin-no-shakkin.fandom.com').then(fs => {
                fetch('https://www.reddit.com').then(rs => {
                    fetch('https://twitter.com').then(ts => {
                        msg.delete();
                        message.channel.send({ embeds: [
                            new MessageEmbed()
                            .setDescription(`**• Uptime:** ${uptime}\n**• Web Status:** Fandom: \`${fs.statusText}\` | Twitter: \`${ts.statusText}\` | Reddit: \`${rs.statusText}\`\n**• Memory Usage:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB/${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB\n**• Latency:** MRT: ${msg.createdTimestamp - message.createdTimestamp}ms | API: ${Math.round(client.ws.ping)}ms\n**• Versions:** Bot: ${process.env.version} | Nodejs: ${process.version} | Discordjs: v${version}`)
                            .setColor(colors.main)
                        ]})
                    })
                })
            })
        })
    }
}
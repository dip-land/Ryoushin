const { MessageEmbed, version } = require('discord.js'), { colors } = require("../../config.json"), moment = require("moment");
require('dotenv').config();
require("moment-duration-format");
module.exports = {
    name: 'Stats',
    aliases: ['bot', 'uptime', 'botinfo', 'botstats'],
    description: 'Shows bots stats.',
    usage: '&&stats',
    examples: ['NONE'],
    cooldown: 5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        const client = message.client, uptime = moment.duration(client.uptime).format("d[d], hh[h], mm[m]");
        message.channel.send('Loading data').then (msg =>{
            msg.delete();
            message.channel.send({ embeds: [
                new MessageEmbed()
                .setAuthor("Bot Information", client.user.displayAvatarURL({format: "png"}))
                .setDescription(`**Uptime:** ${uptime}\n**Memory Usage:** ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB/${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB\n**Latency:** Bot: ${msg.createdTimestamp - message.createdTimestamp}ms | API: ${Math.round(client.ws.ping)}ms\n**Versions:** Bot: ${process.env.version} | Nodejs: ${process.version} | Discordjs: v${version}`)
                .setColor(colors.main)
            ]})
        })
    }
}
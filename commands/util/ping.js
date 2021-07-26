const { MessageEmbed } = require('discord.js'), { colors } = require("../../config.json");
module.exports = {
    name: 'Ping',
    aliases: ['ping'],
    description: 'Shows bots ping and API ping.',
    usage: '&&ping',
    examples: ['NONE'],
    cooldown: 2.5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message){
        const client = message.client, APIPing = Math.round(client.ws.ping)+ "ms";
        message.channel.send('Loading data').then (msg =>{
            msg.delete(); const ping = Math.abs(msg.createdTimestamp - message.createdTimestamp);
            message.channel.send({ embeds: [new MessageEmbed().setDescription(`**Latency:** ${ping}ms \n**APIGateway:** ${APIPing}`).setColor(colors.main)]})
        })
    }
}
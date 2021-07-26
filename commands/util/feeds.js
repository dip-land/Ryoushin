const feeds = require('../../feeds.json'), {MessageEmbed} = require('discord.js'), {colors} = require('../../config.json');
module.exports = {
    name: 'Feeds',
    aliases: ['viewfeeds'],
    description: 'View all the current feeds.',
    usage: 'feeds',
    examples: ['NONE'],
    cooldown: 5,
    category: 'utility',
    nsfw: false,
    disabled: false,
    //permissions: '',
    execute(message, args){
        const data = [], client = message.client;
        feeds.forEach(feed => {
            data.push(`**${feed.name}**`)
            data.push(`Refresh Rate: ${feed.cooldown} seconds`)
            data.push(`Channel: <#${feed.channel}>`)
            data.push(`Link: ${feed.link}\n`)
        });
        message.channel.send({ embeds: [new MessageEmbed().setAuthor("Feed List", client.user.displayAvatarURL()).setDescription(data.join('\n')).setColor(colors.main)]})
    }
}

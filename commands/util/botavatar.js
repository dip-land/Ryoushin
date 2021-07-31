module.exports = {
    name: 'BotAvatar',
    aliases: ['botpfp'],
    description: 'Change bot\'s avatar.',
    usage: 'botavatar [image]',
    examples: ['NONE'],
    cooldown: 60,
    category: 'utility',
    nsfw: false,
    disabled: true,
    permissions: 'ADMINISTRATOR',
    execute(message, args){
        let name = args.join(" ");
        try{
            message.delete()
            message.client.user.setUsername(name)
        }catch(error){console.log(error); return message.reply(`Renaming failed! Error: ${error}`)} 
        message.channel.send(`<@!865314373504335912>'s name has been changed to ${name}, it may take a couple of minutes to show the new profile picture.`);
    }
}

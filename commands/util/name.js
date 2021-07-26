module.exports = {
    name: 'BotName',
    aliases: ['renamebot'],
    description: 'Rename bot.',
    usage: 'botname [String]',
    examples: ['botname Ryoushin'],
    cooldown: 1800,
    category: 'utility',
    nsfw: false,
    disabled: false,
    permissions: 'ADMINISTATOR',
    execute(message, args){
        let name = args.join(" ");
        try{
            message.delete(); message.client.user.setUsername(name);
        }catch(error){console.log(error); return message.reply(`Renaming failed! Error: ${error}`)} 
        message.channel.send(`<@!865314373504335912>'s name has been changed to **${name}**, it may take a couple of minutes to show the new name.`);
    }
}

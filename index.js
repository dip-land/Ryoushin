const { Client, Collection } = require('discord.js'), client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS'] }), { prefixes } = require("./config.json");
require('dotenv').config(); client.commands = new Collection(); const cooldowns = new Collection();

require("glob")('./Commands/**/*.js', function (err, res) {
    res.forEach(async element => {try{const command = require(`${element}`);client.commands.set(command.name.toLowerCase(), command);}catch(err){console.log(err)}});
})

client.on('ready', () =>{
    require('./rss/fandom.js').start(client);
    require('./rss/reddit.js').start(client);
    require('./rss/twitter.js').start(client);
    require('./activity.js').start(client);
    require('./economy.js').start();
    console.log(`online`);
})

client.on('messageCreate', message =>{
    const prefix = prefixes.find(p => message.content.startsWith(p));
    try {require('./command.js').execute(message, client, cooldowns, prefix)} catch(error) {console.error(error)}
});

client.on('messageUpdate', message => {
    const newMessage = message.reactions.message, prefix = prefixes.find(p => message.content.startsWith(p));
    newMessage.guild = message.guild; newMessage.createdTimestamp = newMessage.editedTimestamp;
    try {require('./command.js').execute(newMessage, client, cooldowns, prefix)} catch(error) {console.error(error)}
})

client.on('guildMemberAdd', member => {
    require('./economy.js').join(member);
})

client.on('interactionCreate', interaction => {
    if(interaction.isButton() || interaction.isSelectMenu()){require('./buttons').execute(interaction)}
})

client.login(process.env.token);
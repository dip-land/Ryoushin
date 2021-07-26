const {colors, feedsData} = require('../config.json'), data = require('./data/data.json'), {writeFile} = require('fs'), {MessageEmbed} = require('discord.js'), 
fetch = require("node-fetch"), reddit = require('../feeds.json')[1];
module.exports = {
    start(client){
        setInterval(()=>{
            client.channels.fetch(reddit.channel).then(channel => {
                const Parser = require('rss-parser'), parser = new Parser({maxRedirects: 2}), post = [];
                (async () => {
                    try{
                        let feed = await parser.parseURL(reddit.link);
                        feed.items.forEach(async item => {
                            const found = data.reddit.find(element => element === item.id);
                            if(found){}
                            else{
                                fetch(`${item.link}.json?limit=2`).then(async response => {
                                    try {let body = await response.json();post.push(body[0].data.children[0].data);} catch(error) {}
                                }).catch(error => {}).then(() => {
                                    channel.send({ embeds: [
                                        new MessageEmbed()
                                        .setTitle(`Reddit: ${item.title}`)
                                        .setURL(item.link)
                                        .setDescription(post[0].selftext)
                                        .setImage(post[0].url)
                                        .setColor(colors.main)
                                    ]})
                                    data.reddit.push(item.id)
                                    writeFile(feedsData, JSON.stringify(data), (err) =>{ if(err) console.log(err) });
                                })
                            }
                        });
                    }catch(error){}
                })();
            }).catch(console.error);
        }, (reddit.cooldown * 1000))
    }
}
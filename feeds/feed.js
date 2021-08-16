const {colors, feedsData, feedsJson} = require('../config.json')
const data = require(feedsData)
const {MessageEmbed} = require('discord.js')
const fetch = require('node-fetch'); 
const {fandom, twitter, reddit} = require(feedsJson);
module.exports = {
    start(client){
        //Ryoushin no Shakkin Wiki: Recent changes
        const wiki = 'https://ryoushin-no-shakkin.fandom.com/wiki/';
        setInterval(()=>{
            client.channels.fetch(fandom.channel).then(channel => {
                fetch(fandom.link).then(async response => {
                    let body = await response.json();
                    Object.entries(body.query.recentchanges).forEach(([key, value]) => {
                        const found = data.fandom.find(element => element === `${value.revid}${value.pageid}${value.userid}`);
                        if(found === undefined){
                            const post = value; let type = null, color = colors.main, comment = `(${post.parsedcomment})`;
                            if(post.type === 'log'){if(post.logtype === 'upload'){type = 'uploaded'} if(post.logtype === 'delete'){type = 'deleted'} if(post.logtype === 'move'){type = 'moved'}}
                            if(post.type === 'edit'){type = 'edited'}
                            if(post.type === 'new'){type = 'created page'}
                            if(post.minor !== undefined){comment = `*Minor Edit* (${post.parsedcomment})`}
                            if(post.parsedcomment === ''){comment = ''}
                            if(type === null){console.log(value); type = post.type; color = colors.red}
                            channel.send({embeds:[new MessageEmbed().setDescription(`[${post.user}](${wiki}User:${(post.user).replace(/ /g,"_")}) ${type} [${post.title}](${wiki}${(post.title).replace(/ /g,"_")}) ( [cur](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=0&oldid=${post.revid}) | [prev](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=${post.revid}&oldid=${post.old_revid}) ) (${post.newlen - post.oldlen}) ${comment}`).setColor(color)]})
                            data.fandom.push(`${post.revid}${post.pageid}${post.userid}`)
                            writeData(data);
                        }
                    })
                }).catch(error => {})
            });
        }, (fandom.cooldown * 1000))
        //Ryoushin no Shakkin Reddit: New Posts
        setInterval(()=>{
            client.channels.fetch(reddit.channel).then(channel => {
                const Parser = require('rss-parser'), parser = new Parser({maxRedirects: 2}), post = [];
                (async () => {
                    let feed = await parser.parseURL(reddit.link);
                    feed.items.forEach(async item => {
                        const found = data.reddit.find(element => element === item.id);
                        if(found === undefined){
                            fetch(`${item.link}.json?limit=5`).then(async response => {
                                try {let body = await response.json();post.push(body[0].data.children[0].data);}catch(error){}
                            }).catch(error => {}).then(() => {
                                channel.send({embeds:[new MessageEmbed().setTitle(`Reddit: ${item.title}`).setURL(item.link).setDescription(post[0].selftext).setImage(post[0].url).setColor(colors.main)]})
                                data.reddit.push(item.id); writeData(data);
                            })
                        }
                    });
                })();
            }).catch(console.error);
        }, (reddit.cooldown * 1000))
        //Twitter: @amane_kakuyomu New Posts
        const Twit = require('twit'), T = new Twit({consumer_key: process.env.tck,consumer_secret: process.env.tcs,access_token: process.env.tat,access_token_secret: process.env.tats})
        setInterval(()=>{
            client.channels.fetch(twitter.channel).then(channel => {
                T.get('statuses/user_timeline', {screen_name:'amane_kakuyomu', exclude_replies:true, include_rts:false, count:5}, function(err, tweets, response){
                    tweets.forEach(async tweet => {
                        const found = data.twitter.find(element => element === tweet.id_str);
                        if(found === undefined){channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`); data.twitter.push(tweet.id_str); writeData(data);}
                    });
                })
            })
        }, (twitter.cooldown * 1000))
    }
}
function writeData(data){require('fs').writeFile(feedsData, JSON.stringify(data),(err)=>{if(err)console.log(err)})}
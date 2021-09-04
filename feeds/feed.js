const {colors, feedsData, feedsJson} = require('../config.json')
const data = require(feedsData)
const {MessageEmbed} = require('discord.js')
const fetch = require('node-fetch'); 
const {fandom, twitter, reddit, redditComments} = require(feedsJson);
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
                            const post = value; let type = null, color = colors.main, comment = `(${post.parsedcomment})`, length = post.newlen - post.oldlen;
                            if(post.newlen - post.oldlen >= 0){length = `+${post.newlen - post.oldlen}`}
                            if(post.type === 'log'){if(post.logtype === 'upload'){type = 'uploaded'} if(post.logtype === 'delete'){type = 'deleted'} if(post.logtype === 'move'){type = 'moved'} if(post.logtype === 'protect'){type = 'protected'}}
                            if(post.type === 'edit'){type = 'edited'}
                            if(post.type === 'new'){type = 'created page'}
                            if(post.minor !== undefined){comment = `*Minor Edit* (${post.parsedcomment})`}
                            if(post.parsedcomment === ''){comment = ''}
                            if(type === null){console.log(value); type = post.type; color = colors.red}
                            channel.send({embeds:[new MessageEmbed().setDescription(`[${post.user}](${wiki}User:${(post.user).replace(/ /g,"_")}) ${type} [${post.title}](${wiki}${(post.title).replace(/ /g,"_")}) ([cur](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=0&oldid=${post.revid}) | [diff](${wiki}${(post.title).replace(/ /g,"_")}?curid=${post.pageid}&diff=${post.revid}&oldid=${post.old_revid})) (${length}) ${comment}`).setColor(color).setTimestamp(new Date(post.timestamp))]})
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
                const Parser = require('rss-parser'), parser = new Parser({maxRedirects: 2});
                (async () => {
                    try{
                        let feed = await parser.parseURL(reddit.link);
                        feed.items.forEach(async item => {
                            const found = data.reddit.find(element => element === item.id);
                            if(found === undefined){
                                fetch(`${item.link}.json?limit=5`).then(async response => {
                                    let body = await response.json();
                                    let post = body[0].data.children[0].data;
                                    let image = null;
                                    let stp = post.selftext.split('&amp;#x200B;\n')
                                    if(post.media_metadata !== undefined){
                                        let parts = (post.media_metadata[Object.keys(post.media_metadata)[Object.keys(post.media_metadata).length - 1]].s.u).split('amp;');
                                        image = parts.join('');
                                    }
                                    channel.send({embeds:[new MessageEmbed().setTitle(item.title).setURL(item.link).setDescription(stp.join('')).setImage(image).setColor(colors.main).setFooter(`Posted by: ${post.author}`).setTimestamp(new Date((post.created * 1000)))]})
                                    data.reddit.push(item.id); 
                                    writeData(data);
                                }).catch(error => {})
                            }
                        });
                    }catch(err){}
                })();
            }).catch(console.error);
        }, (reddit.cooldown * 1000))
        //Ryoushin no Shakkin Reddit: Comments
        setInterval(()=>{
            client.channels.fetch(redditComments.channel).then(channel => {
                try{
                    fetch(redditComments.link).then(response => response.json()).then(comments =>{
                        comments.data.children.forEach(comment => {
                            const found = data.reddit.find(element => element === comment.data.name);
                            if(found === undefined){
                                channel.send({
                                    embeds:[
                                        new MessageEmbed()
                                        .setTitle(`${comment.data.link_title}`)
                                        .setURL(`${comment.data.link_permalink}/${comment.data.id}/`)
                                        .setDescription(comment.data.body)
                                        .setColor(colors.main)
                                        .setFooter(`Commented by: ${comment.data.author}`)
                                        .setTimestamp(new Date((comment.data.created * 1000)))
                                    ]
                                })
                                data.reddit.push(comment.data.name); 
                                writeData(data);
                            }
                        })
                    })
                }catch(err){}
            }).catch(console.error);
        }, (redditComments.cooldown * 1000))
        //Twitter: @amane_kakuyomu New Posts
        const Twit = require('twit'), T = new Twit({consumer_key: process.env.tck,consumer_secret: process.env.tcs,access_token: process.env.tat,access_token_secret: process.env.tats})
        setInterval(()=>{
            client.channels.fetch(twitter.channel).then(channel => {
                T.get('statuses/user_timeline', {screen_name:'amane_kakuyomu', exclude_replies:true, include_rts:false, count:5, tweet_mode:'extended'}, function(err, tweets, response){
                    try{
                        tweets.forEach(tweet => {
                            const found = data.twitter.find(element => element === tweet.id_str);
                            if(found === undefined){
                                let media = null, extra = [], text = null;
                                if(/(https:\/\/t.co\/)\w+/g.test(tweet.full_text)){text = tweet.full_text.replace(/(https:\/\/t.co\/)\w+/gi, '')}else{text = tweet.full_text}
                                if(tweet.extended_entities !== undefined){media = tweet.extended_entities.media[0].media_url_https}
                                tweet.entities.hashtags.forEach(tag=>{
                                    text = text.replace(`#${tag.text}`, `[#${tag.text}](https://twitter.com/hashtag/${tag.text})`)
                                })
                                tweet.entities.urls.forEach(u => {
                                    extra.push(`\n${u.expanded_url}`)
                                })
                                channel.send({embeds:[
                                    new MessageEmbed()
                                    .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`, tweet.user.profile_image_url, `https://twitter.com/${tweet.user.screen_name}`)
                                    .setDescription(`${text} ${extra}\n\n[**Click to view full tweet on Twitter**](https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str})`)
                                    .setImage(media)
                                    .setColor(colors.main)
                                    .setFooter('Twitter', 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png')
                                    .setTimestamp(new Date(tweet.created_at))
                                ]})
                                data.twitter.push(tweet.id_str); 
                                writeData(data);
                            }
                        });
                    }catch(e){console.log(e)}
                })
            })
        }, (twitter.cooldown * 1000))
    }
}
function writeData(data){require('fs').writeFile(feedsData, JSON.stringify(data),(err)=>{if(err)console.log(err)})}
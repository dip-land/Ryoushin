const twitter = require('../feeds.json')[2], DData = require('./data/data.json'), {writeFile} = require('fs'), {feedsData} = require('../config.json'),
Twit = require('twit'); require('dotenv').config();
module.exports = {
    start(client){
        var T = new Twit({
            consumer_key: process.env.consumer_key,
            consumer_secret: process.env.consumer_secret,
            access_token: process.env.access_token,
            access_token_secret: process.env.access_token_secret
        })
        setInterval(()=>{
            client.channels.fetch(twitter.channel).then(channel => {
                T.get('statuses/user_timeline', { screen_name: 'amane_kakuyomu', exclude_replies: true, include_rts: false, count: 5 }, function (err, data, response) {
                    try{
                        data.forEach(async tweet => {
                            const found = DData.twitter.find(element => element === tweet.id_str);
                            if(found){}
                            else{
                                channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
                                DData.twitter.push(tweet.id_str)
                                writeFile(feedsData, JSON.stringify(DData), (err) =>{ if(err) console.log(err) });
                            }
                        });
                    }catch(error){}
                })
            })
        }, (twitter.cooldown * 1000))
    }
}
const {colors, feedsData} = require('../config.json'), data = require('./data/data.json'), {writeFile} = require('fs'), {MessageEmbed} = require('discord.js'), 
fetch = require('node-fetch'); const fandom = require('../feeds.json')[0];
module.exports = {
    start(client){
        const wiki = 'https://ryoushin-no-shakkin.fandom.com/wiki/';
        setInterval(()=>{
            client.channels.fetch(fandom.channel).then(channel => {
                fetch(fandom.link).then(async response => {
                    let body = await response.json(), rc = body.query.recentchanges, i = 0;
                    Object.entries(rc).forEach(([key, value]) => {
                        const found = data.fandom.find(element => element === `${value.revid}${value.pageid}${value.userid}`);
                        if(found){}
                        else if(i = 2){
                            const currc = value; let type = null, color = colors.main, comment = `(${currc.parsedcomment})`;
                            if(currc.type === 'log'){
                                if(currc.logtype === 'upload'){type = 'uploaded'}
                                if(currc.logtype === 'delete'){type = 'deleted'}
                                if(currc.logtype === 'move'){type = 'moved'}
                            }
                            if(currc.type === 'edit'){type = 'edited'}
                            if(currc.type === 'new'){type = 'created page'}
                            if(currc.minor !== undefined){comment = `*Minor Edit* (${currc.parsedcomment})`}
                            if(currc.parsedcomment === ''){comment = ''}
                            if(type === null){console.log(value); type = currc.type; color = colors.red}
                            channel.send({ embeds: [
                                new MessageEmbed()
                                .setDescription(`[${currc.user}](${wiki}User:${(currc.user).replace(/ /g,"_")}) ${type} [${currc.title}](${wiki}${(currc.title).replace(/ /g,"_")}) ( [cur](${wiki}${(currc.title).replace(/ /g,"_")}?curid=${currc.pageid}&diff=0&oldid=${currc.revid}) | [prev](${wiki}${(currc.title).replace(/ /g,"_")}?curid=${currc.pageid}&diff=${currc.revid}&oldid=${currc.old_revid}) ) (${currc.newlen - currc.oldlen}) ${comment}`)
                                .setColor(color)
                            ]})
                            data.fandom.push(`${currc.revid}${currc.pageid}${currc.userid}`)
                            writeFile(feedsData, JSON.stringify(data), (err) =>{ if(err) console.log(err) });
                        }
                    })
                }).catch(error => {})
            });
        }, (fandom.cooldown * 1000))
    }
}
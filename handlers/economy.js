const {writeFile} = require('fs');
const {economyData} = require('../config.json')
module.exports = {
    join(member){
        const data = require(economyData);
        if(!data.users){data.users = {}}
        if(!data.users[member.user.id]){
            if(member.bot){return;}
            data.users[member.user.id] = {money : 10000, last_stolen : Date.now(), daily_claimed : false}
            writeFile(economyData, JSON.stringify(data, null, 1),(err)=>{if(err)console.log(err)});
        }
    },
    start(){
        setInterval(() => {
            const data = require(economyData), today = new Date(Date.now()).getUTCDay();
            if(data.update === today){
                console.log('newday, changing to false');
                for(const [key, value] of Object.entries(data.users)){if(value.daily_claimed){data.users[key].daily_claimed = false}}
                setTimeout(() => {
                    console.log('newday, writing data');
                    writeFile(economyData, JSON.stringify(data, null, 1),(err)=>{if(err)console.log(err)});
                }, 12000)
                if(today !== 7){data.update = (today + 1)} else{data.update = 0}
            }
        }, 4000)
    }
}
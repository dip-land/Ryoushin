const {writeFile} = require('fs'), {economyData} = require('./config.json')
module.exports = {
    join(member){
        const data = require('./data.json');
        if(!data.users){data.users = {}}
        if(!data.users[member.user.id]){
            if(member.bot){return;}
            data.users[member.user.id] = {
                money : 10000,
                last_stolen : Date.now(),
                daily_claimed : false
            }
            writeFile(economyData, JSON.stringify(data, null, 1), (err) =>{ if(err) console.log(err) });
        }
    },
    start(){
        setInterval(() => {
            const data = require('./data.json'), today = new Date(Date.now()).getUTCDay();
            if(data.update === today){
                for (const [key, value] of Object.entries(data.users)) {
                    if(value.daily_claimed){data.users[key].daily_claimed = false}
                }
            }
            if(today === 0){data.update = 1}
            if(today === 1){data.update = 2}
            if(today === 2){data.update = 3}
            if(today === 3){data.update = 4}
            if(today === 4){data.update = 5}
            if(today === 5){data.update = 6}
            if(today === 6){data.update = 7}
            if(today === 7){data.update = 0}
            if(data !== data){
                setTimeout(() => {writeFile(economyData, JSON.stringify(data, null, 1), (err) =>{ if(err) console.log(err) })}, 2000)
            }
        }, 6000)
    }
}
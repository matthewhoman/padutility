/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const port = process.env.PORT || 1337;
const isDev = port === 1337 ? true : false;
const schedule = require('node-schedule');
const URL = require('url');

//PAD STUFF
var monsterListJSON = "https://www.padherder.com/api/monsters/"; //"https://storage.googleapis.com/mirubot/paddata/processed/na_cards.json";
var monsterActiveSkillsJSON = "https://www.padherder.com/api/active_skills/";
var monsterLeaderSkillsJSON = "https://www.padherder.com/api/leader_skills/";
var monsterEvolutionsJSON = "https://www.padherder.com/api/evolutions/";


//slimmed down version of monsters name/ num pairs for the clients autocomplete
var monsterNameNumArr = [];
var leaderSkills = [];
var activeSkills = [];
var masterMonsterUnreleasedDictionary = [];
var monsterEvolutions = {};
var serverReady = false;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/serverReady', function(req, res) {
  res.end(JSON.stringify(serverReady));
});

//retrieve monster stuff
app.get('/retrieveMonsters', function(req, res) {
  res.end(JSON.stringify(monsterNameNumArr));
});

app.get('/retrieveUnreleasedMonsters', function(req, res) {
  res.end(JSON.stringify(masterMonsterUnreleasedDictionary));
});

app.get('/retrieveMonster', function(req, res) { 
  var monsterNum = URL.parse(req.url, true).query.number;
  res.end(JSON.stringify(getMonsterByNumber(monsterNum)));
});

function getMonsterByNumber(monsterNum) {
  for(var i = 0; i < monsterNameNumArr.length; i++) {
    var monster = monsterNameNumArr[i];
    if(monster.id == monsterNum) {
      return monster;
    }
  }
}

function getMonsters() {

  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: monsterListJSON,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        var monsterObjs = JSON.parse(body);
        console.log("Done Fetching Monster Data!!")
        parseDictionaryForClient(monsterObjs);
    }
  });
}

function getLeaderSkills() {
  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: monsterLeaderSkillsJSON,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        leaderSkills = JSON.parse(body);
        console.log("Done Fetching Leader Skills!!")
        getEvolutions();
    }
  });
}

function getActiveSkills() {
  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: monsterActiveSkillsJSON,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        activeSkills = JSON.parse(body);
        console.log("Done Fetching Active Skills!!")
        getLeaderSkills();
    }
  });
}

function getEvolutions() {
  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: monsterEvolutionsJSON,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        monsterEvolutions = JSON.parse(body);
        console.log("Done Fetching Evolutions!!")
        getMonsters();
    }
  });
}

function getMonsterDatas() {
  getActiveSkills(); 
}

function fillUnreleasedMonsters() {
    for(var monster of monsterNameNumArr) {
        if(monster.unreleased) {
            masterMonsterUnreleasedDictionary.push(monster);
        }
    }
}

function parseDictionaryForClient(dictionary) {
  for(var i = 0; i < dictionary.length; i++) {
    var monstersJson = {};
    var monster = dictionary[i];
  
    monstersJson.name = monster.name;
    monstersJson.id = monster.id;
    monstersJson.atk = monster.atk_max;
    monstersJson.hp = monster.hp_max;
    monstersJson.lvl = monster.max_level;
    monstersJson.rcv = monster.rcv_max;
    monstersJson.unreleased = monster.jp_only;
    monstersJson.element = monster.element;
    monstersJson.element2 = monster.element2;
    monstersJson.mp = monster.monster_points;
    monstersJson.leaderSkill = monster.leader_skill ? monster.leader_skill : 'N/A';
    monstersJson.activeSkill = monster.active_skill ? monster.active_skill : 'N/A';
    monstersJson.rarity = monster.rarity;
    monstersJson.cost = monster.team_cost;
    monstersJson.img = 'https://www.padherder.com' + monster.image60_href;
    if(monster.leader_skill) {
        monstersJson.leaderSkillDescription = getLeaderSkillDescr(monster.leader_skill);
    }
    if(monster.active_skill) {
	    monstersJson.turnMin = getSkillTurnMin(monster.active_skill);
	    monstersJson.turnMax = getSkillTurnMax(monster.active_skill);
        monstersJson.activeSkillDescription = getSkillDescr(monster.active_skill);
	} else {
		monstersJson.turnMin = 'N/A';
	    monstersJson.turnMax = 'N/A';
        monstersJson.activeSkillDescription = 'N/A';
	}
    monsterNameNumArr.push(monstersJson);
  }
  fillEvos();
  console.log("Done Parsing Client Monster Data!!");
  fillUnreleasedMonsters();
  console.log("Done Parsing Unreleased Monster Data!!") ;
  console.log("DONE WITH DATA!!! APP READY!");
  serverReady = true;
}

// function getChildEvos(monsterId, evoArray) {
//     let found = false;
//     for (var key in monsterEvolutions) {
//         if (monsterEvolutions.hasOwnProperty(key)) {
//             let evo = monsterEvolutions[key][0];
//             let evoId = key;
//             if(evo.evolves_to == monsterId) {
//                 if(evoArray.length > 15) {
//                     //catch large set....
//                     console.log("LARGE CHILD" + monsterId);
//                 }
//                 //catch infinite loop data.. a child can link back to its parent
//                 for (let evoEntry of evoArray) {
//                     if(evoEntry.id == evoId) {
//                         return evoArray;
//                     }
//                 }
//                 evo.id = evoId;
//                 evoArray.push(evo);
//                 found = true;
//                 return getChildEvos(evoId, evoArray);
//             }
//         }
//     }
//     //no more evolutions return.
//     if(!found) {
//         return evoArray;
//     }
// }

// function getUltimateEvos(monsterId, parentId) {
//     let evoArray = [];
//     for (var key in monsterEvolutions) {
//         if (monsterEvolutions.hasOwnProperty(key)) {
//             let evo = monsterEvolutions[key][0];
//             //ULTIMATES EVOLVE BACK TO BASE ID SO FIND THAT BASE AND ADD THIS MONSTER TO IT
//             if(evo.is_ultimate) {
//                 if(evoArray.length > 15) {
//                     //catch large set....
//                     console.log("LARGE ULTS" + monsterId);
//                 }
//                 let childId = evo.evolves_to;
//                 if(childId == monsterId) {
//                     evo.id = key;
//                     evoArray.push(evo);
//                 }
//             }
//         }
//     }
//     //CHECK EVOS ULTIMATES AS WELL TO BUILD OUT THE TREE!!
//     if(parentId) {
//         for (var key in monsterEvolutions) {
//             if (monsterEvolutions.hasOwnProperty(key)) {
//                 let evo = monsterEvolutions[key][0];
//                 //ULTIMATES EVOLVE BACK TO BASE ID SO FIND THAT BASE AND ADD THIS MONSTER TO IT
//                 if(evo.is_ultimate) {
//                     if(evoArray.length > 15) {
//                         //catch large set....
//                         console.log("LARGE ULTS" + parentId);
//                     }
//                     let childId = evo.evolves_to;
//                     if(childId == parentId) {
//                         evo.id = key;
//                         evoArray.push(evo);
//                     }
//                 }
//             }
//         }
//     }
//     return evoArray;
// }

// function getEvos(monsterId, evoArray) {
//     let found = false;
//     for (var key in monsterEvolutions) {
//         if (monsterEvolutions.hasOwnProperty(key)) {
//             for(var i = 0; i < monsterEvolutions[key].length; i++){
//                 let evo = monsterEvolutions[key][i];
//                 let evoId = key;
//                 //has more evolutions recursively get them.
//                 if(evoId == monsterId) {
//                     if(evoArray.length > 15) {
//                         //catch large set....
//                         console.log("LARGE EVOS" + monsterId);
//                     }
//                     //catch infinite loop data.. a evolution can link its evolve_to id back to the child..
//                     for (let evoEntry of evoArray) {
//                         if(evoEntry.id == evo.evolves_to) {
//                             return evoArray;
//                         }
//                     }
//                     evo.id = key;
//                     evoArray.push(evo);
//                     found = true;
//                     return getEvos(evo.evolves_to, evoArray);
//                 }
//             }
//         }
//     }
//     //no more evolutions return.
//     if(!found) {
//         return evoArray;
//     }
// }

// function fillEvos() {
//     for(let monster of monsterNameNumArr) {
//         var evolvedFrom = getChildEvos(monster.id, []).reverse();
//         var evos = getEvos(monster.id, []);
//         var parentId = evos.length > 1 ? evos[evos.length - 1].id : null;
//         var ultimateEvos = getUltimateEvos(monster.id, parentId);
//         if(monster.id == 4) {
//             console.log(JSON.stringify(evolvedFrom));
//             console.log("*************")
//             console.log(JSON.stringify(evos));
//             console.log("*************")
//             console.log(JSON.stringify(ultimateEvos));
//             console.log("*************")
//             //console.log(JSON.stringify(evolvedFrom.concat(evos).concat(ultimateEvos)));
//         }
//         monster.evoTree = createEvoObjects(evolvedFrom.concat(evos).concat(ultimateEvos), monster);

//         // if(monster.id == 4425) {
//         //     console.log(JSON.stringify(monster.evoTree));
//         // }
//     }
// }

function fillEvos() {
    for(let monster of monsterNameNumArr) {
        let evoArray = [];
        for (var key in monsterEvolutions) {
            if (monsterEvolutions.hasOwnProperty(key)) {
                if(key == monster.id) {
                    for(var i = 0; i < monsterEvolutions[key].length; i++){
                        let evo = monsterEvolutions[key][i];
                        evo.id = key;
                        let exists = false;
                        //for some reason there are dups in the evolves to array
                        for(let evoItem of evoArray) {
                            if(evoItem.evolves_to === evo.evolves_to) {
                                exists = true;
                                break;
                            }
                        }
                        if(!exists) {
                            evoArray.push(evo);
                        }
                    }
                    break;
                }
            }
        }
        monster.evoTree = createEvoObjects(evoArray, monster);
        // if(monster.id == 1) {
        //     console.log(JSON.stringify(evoArray));
        //     console.log(JSON.stringify(createEvoObjects(evoArray, monster)));
        // }
        
    }
}

function createEvoObjects(evoArray, monster) {
    let newEvoArr = [];
    for(var i = 0; i < evoArray.length; i++) {
        let evo = evoArray[i];
        let evoObj = {};
        let nextEvo = {};

        //some monsters in the array actually don't exist
        if(!getMonsterByNumber(evo.evolves_to)) {
            continue;
        }

        let evolvesToMonster = getMonsterByNumber(evo.evolves_to);

        evoObj.id = evo.evolves_to;
        evoObj.pic = evolvesToMonster.img;
        evoObj.name = evolvesToMonster.name;
        evoObj.hasChild = true;
        evoObj.childId = monster.id;
        evoObj.childPic = monster.img;
        evoObj.childName = monster.name;
        evoObj.evoMonsters = [];
        evoObj.evoIds = [];
        for(let material of evo.materials) {
            let monster = getMonsterByNumber(material[0]);
            evoObj.evoMonsters.push({img: monster.img, id: monster.id, name: monster.name});
        }
        if(evoObj.evoMonsters.length < 5) {
            for(let i = evoObj.evoMonsters.length; i <= 4; i++) {
                evoObj.evoMonsters.push({img:"/images/transparent.png", id:-1, name:"placeholder"});
            }
        }
       
        newEvoArr.push(evoObj);
    }
    return newEvoArr;
}

function getActiveSkill(skillName) {
    for(var i = 0; i < activeSkills.length; i++) {
        var skill = activeSkills[i];
        if(skill.name && skillName && skill.name.toLowerCase() === skillName.toLowerCase()) {
            return skill;
        }
    }
    return null;
}

function getLeaderSkill(skillName) {
    for(var i = 0; i < leaderSkills.length; i++) {
        var skill = leaderSkills[i];
        if(skill.name && skillName && skill.name.toLowerCase() === skillName.toLowerCase()) {
            return skill;
        }
    }
    return null;
}

function getLeaderSkillDescr(skillName) {
    let skill = getLeaderSkill(skillName);
    logNoSkill(skill, skillName);
    return skill ? skill.effect : "N/A";
}

function getSkillDescr(skillName) {
    let skill = getActiveSkill(skillName);
    logNoSkill(skill, skillName);
    return skill ? skill.effect : "N/A";
}

function getSkillTurnMin(skillName) {
    let skill = getActiveSkill(skillName);
    return skill ? skill.min_cooldown : "N/A";
}

function getSkillTurnMax(skillName) {
    let skill = getActiveSkill(skillName);
    return skill ? skill.max_cooldown : "N/A";
}

function logNoSkill(skill, skillName) {
    if(!skill) {
        console.log("COULD NOT FIND SKILL MATCH FOR " + skillName);
    }
}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, function () {
  console.log("booting... on port " + port );
  var rule = new schedule.RecurrenceRule();
  //every morning at 12am
  rule.hour = 0;
  //run now then run at every 12am.
  try {
    getMonsterDatas();
  } catch(e) {
    console.log("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
  }
  var sched = schedule.scheduleJob(rule, function(){
    try {
        getMonsterDatas();
    } catch(e) {
        console.log("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
    }
	console.log('Updating Library');
  });
});
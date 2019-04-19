/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const port = process.env.PORT || 1337;
const isDev = port === 1337 ? true : false;
const schedule = require('node-schedule');
const URL = require('url');
const util = require('./lib/utils.js');
const fs = require('fs');
const ENCODING = 'utf8';
var Scraper = require("image-scraper");
const phantom = require('phantom');

//PAD STUFF
//var monsterListJSON = "https://www.padherder.com/api/monsters/"; //"https://storage.googleapis.com/mirubot/paddata/processed/na_cards.json";
var monsterListJSON = "https://f002.backblazeb2.com/file/miru-data/paddata/processed/na_cards.json";

//slimmed down version of monsters name/ num pairs for the clients autocomplete
var monsterNameNumArr = [];
var masterMonsterUnreleasedDictionary = [];
var serverReady = false;

var typeMap = {
  evolve : '0',
  balanced : '1',
  physical : '2',
  healer : '3',
  dragon : '4',
  god : '5',
  attacker : '6',
  devil : '7',
  machine : '8',
  awaken : '12',
  enhanced : '14',
  vendor : '15'
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/serverReady', function(req, res) {
  res.end(JSON.stringify(serverReady));
});

//retrieve monster stuff, they can be filtered
app.get('/retrieveMonsters', function(req, res) {
  var typeFilters = URL.parse(req.url, true).query.typeFilter;

  if(typeFilters) {
    let types = JSON.parse(typeFilters);
    if(types.length > 0) {
      let monsters = [];
      for(let mons of monsterNameNumArr) {
        if(mons.type != -1 && types.includes(mons.type + '')) {
          monsters.push(mons);
        }
        if(mons.type2 != -1 && types.includes(mons.type2 + '')) {
          monsters.push(mons);
        }
        if(mons.type3 != -1 && types.includes(mons.type3 + '')) {
          monsters.push(mons);
        }
      }
      res.end(JSON.stringify(monsters));
      return;
    } else {
      res.end(JSON.stringify(monsterNameNumArr));
      return;
    }
  }
  
  res.end(JSON.stringify(monsterNameNumArr));
});

app.get('/retrieveUnreleasedMonsters', function(req, res) {
  res.end(JSON.stringify(masterMonsterUnreleasedDictionary));
});

app.get('/retrieveLeaders', function(req, res) {
  var queryStr = URL.parse(req.url, true).query.searchStr;
  if(queryStr) {
    let monsters = [];
    for(let mons of monsterNameNumArr) {
      if(mons.leaderSkillDescription && mons.leaderSkillDescription.toLowerCase().includes(queryStr.toLowerCase())) {
          monsters.push(mons);
      }
    }
    res.end(JSON.stringify(monsters));
  } else {
    res.end(JSON.stringify({}));
  }
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
  for(var j = 0; j < masterMonsterUnreleasedDictionary.length; j++) {
    var monster = masterMonsterUnreleasedDictionary[j];
    if(monster.id == monsterNum) {
      return monster;
    }
  }
}

function getMonsters() {
  var cardsJson = fs.readFileSync("./JSON_DATA/na_cards.json", ENCODING);
  console.log("Done Fetching Monster Data!!")
  var evosJson = fs.readFileSync("./JSON_DATA/evolutionList.json", ENCODING);
  console.log("Done Fetching Evolution Data!!")
  parseDictionaryForClient(JSON.parse(cardsJson), JSON.parse(evosJson).items);

  // var headers = {
  //   'Content-Type': 'application/json'
  // };

  // var options = {
  //   url: monsterListJSON,
  //   method: 'GET',
  //   headers: headers,
  // };

  // request(options, function (error, response, body) {
  //   if (!error && response.statusCode === 200) {
  //       var monsterObjs = JSON.parse(body);
  //       console.log("Done Fetching Monster Data!!")
  //       parseDictionaryForClient(monsterObjs);
  //   }
  // });
}

function parseDictionaryForClient(dictionary, evosArr) {
  for(var i = 0; i < dictionary.length; i++) {
    var monstersJson = {};
    var monster = dictionary[i];

    //don't add cards that have id's greater than 100000
    if(monster.card.card_id > 100000) {
      continue;
    }
  
    monstersJson.awakenings = parseAwakenings(monster.card.awakenings);
    monstersJson.superAwakenings = monster.card.super_awakenings;

    // if(monstersJson.awakenings.length >= 9) {
    //   console.log("monster has alot of awakenings! " + monster.name)
    // }

    monstersJson.name = monster.card.name;
    monstersJson.id = monster.card.card_id;
    monstersJson.atk = monster.card.max_atk;
    monstersJson.hp = monster.card.max_hp;
    monstersJson.lvl = monster.card.max_level;
    monstersJson.rcv = monster.card.max_rcv;
    monstersJson.unreleased = !monster.card.released_status;
    monstersJson.element = monster.card.attr_id;
    monstersJson.element2 = monster.card.sub_attr_id;
    monstersJson.type = monster.card.type_1_id;
    monstersJson.type2 = monster.card.type_2_id;
    monstersJson.type3 = monster.card.type_3_id;
    monstersJson.mp = monster.card.sell_mp;
    monstersJson.leaderSkill = monster.leader_skill ? monster.leader_skill.name : 'N/A';
    monstersJson.activeSkill = monster.active_skill ? monster.active_skill.name : 'N/A';
    monstersJson.rarity = monster.card.rarity;
    monstersJson.cost = monster.card.cost;
    monstersJson.img = 'images/monsterIcons/' + monster.card.card_id + ".png";
    if(monster.leader_skill) {
        monstersJson.leaderSkillDescription = monster.leader_skill.clean_description ? monster.leader_skill.clean_description : "N/A"
    }
    if(monster.active_skill) {
      let activeSkill = monster.active_skill;
	    monstersJson.turnMin = activeSkill.turn_min ? activeSkill.turn_min : "N/A";
	    monstersJson.turnMax = activeSkill.turn_max ? activeSkill.turn_max : "N/A";
      monstersJson.activeSkillDescription = activeSkill.clean_description ? activeSkill.clean_description : "N/A";
    } else {
      monstersJson.turnMin = 'N/A';
      monstersJson.turnMax = 'N/A';
      monstersJson.activeSkillDescription = 'N/A';
    }

    monstersJson.ancestorId = monster.card.ancestor_id;
    monstersJson.evoMat1 = monster.card.evo_mat_id_1;
    monstersJson.evoMat2 = monster.card.evo_mat_id_2;
    monstersJson.evoMat3 = monster.card.evo_mat_id_3;
    monstersJson.evoMat4 = monster.card.evo_mat_id_4;
    monstersJson.evoMat5 = monster.card.evo_mat_id_5;

    monstersJson.evoTree = [];

    if(!monster.card.released_status) {
      masterMonsterUnreleasedDictionary.push(monstersJson);
      continue;
    }

    monsterNameNumArr.push(monstersJson);
  }

  //sort array by ids desc
  function compare(a, b) {
    const idA = a.id;
    const idB = b.id;
  
    let comparison = 0;
    if (idA < idB) {
      comparison = 1;
    } else if (idA > idB) {
      comparison = -1;
    }
    return comparison;
  }

  monsterNameNumArr.sort(compare);
  masterMonsterUnreleasedDictionary.sort(compare);

  fillEvos(monsterNameNumArr, evosArr);
  fillEvos(masterMonsterUnreleasedDictionary, evosArr);

  console.log("Done Parsing Client Monster Data!!");
  
  //TODO: WHEN TO SCRAPE IMAGES? WHAT TO SCRAPE FOR? ONLY LATEST>> NEW STUFF I DON'T HAVE
  //scrapeImages();
  console.log("DONE WITH DATA!!! APP READY!");
  serverReady = true;
}

function scrapeImages() {
  (async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    await page.on('onConsoleMessage', function(msg) {
      console.info(msg);
    });
    await page.on('onError', function(msg) {
      console.info(msg);
    });
    await page.on('onResourceRequested', function(requestData) {
      console.info('Requesting', requestData.url);
    });
    let baseURL = 'http://puzzledragonx.com/en/img/thumbnail/';
    for(let i = 0; i < monsterNameNumArr.length; i++) {
      let monster = monsterNameNumArr[i];
      let imgExt = monster.id + ".png";
      let url = baseURL + imgExt;
      const status = await page.open(url);
      await console.log(`Page opened with status [${status}].`);
      await page.includeJs('https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js');

      let imgObj = await page.evaluate(function() {
        img = $("img");
        return {
          top : img.offset().top,
          left : img.offset().left,
          width : img.width(),
          height : img.height()
        };
      }); 
      await page.property('clipRect', imgObj);
      await page.render('client/public/images/monsterIcons/' + imgExt);   
      console.log('created: ' + imgExt)
    }
    await instance.exit();
  })();
}

function parseAwakenings(awokenArr) {

  //sort array by awoken id
  function compare(a, b) {
      let comparison = 0;
        a > b ? comparison = 1 : comparison = -1;
      return comparison;
  }
    
  awokenArr.sort(compare);

  return awokenArr;
}

function fillEvos(monsterNameNumArr, evosArr) {
  for(let monster of monsterNameNumArr) {
    //push your 'evo from' to the tree
    pushEvo(monster.id, monster);
    for(let evo of evosArr) {
      if(evo.MONSTER_NO == monster.id) {
        //push your 'evo to's' to the tree
        pushEvo(evo.TO_NO, monster);
      }
    }
  }
}

function pushEvo(monsterNum, monsterObj) {
  let monster = getMonsterByNumber(monsterNum);
  if(monster) {
    let ancestor = monster.ancestorId !== 0 ? getMonsterByNumber(monster.ancestorId) : null;
    if(!ancestor) {
      return;
    }
    let evoMats = [];
        evoMats.push(monster.evoMat1);
        evoMats.push(monster.evoMat2);
        evoMats.push(monster.evoMat3);
        evoMats.push(monster.evoMat4);
        evoMats.push(monster.evoMat5);
    let evo =  {
      evoFromId : ancestor.id,
      evoFromName : ancestor.name,
      evoToId : monster.id,
      evoToName : monster.name,
      evoMats : evoMats
    }
    monsterObj.evoTree.push(evo);
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
  //var rule = new schedule.RecurrenceRule();
  //every morning at 4am
  //rule.hour = 4;
  //run now then run at every 12am.
  //try {
    getMonsters();
  //} catch(e) {
  //  console.log("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
  //}
  //var sched = schedule.scheduleJob(rule, function(){
  // try {
  //    getMonsters();
  //  } catch(e) {
  //      console.log("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
  //  }
	//console.log('Updating Library');
  //});
});
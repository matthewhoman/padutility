/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const port = process.env.PORT || 1337;
const isDev = port === 1337 ? true : false;
const URL = require('url');
const util = require('./lib/utils.js');
const fs = require('fs');
const ENCODING = 'utf8';
const phantom = require('phantom');

const SONG_API = "http://api.musixmatch.com/ws/1.1/matcher.track.get";
const musixKey = "a8bc8031bd2f703ac56092ba82edcbcd";
const LYRIC_API = "http://api.musixmatch.com/ws/1.1/track.lyrics.get";


//PAD STUFF
//var monsterListJSON = "https://www.padherder.com/api/monsters/"; //"https://storage.googleapis.com/mirubot/paddata/processed/na_cards.json";
var monsterListJSON = "https://f002.backblazeb2.com/file/miru-data/paddata/processed/na_cards.json";
var monsterEVOJSON = "https://f002.backblazeb2.com/file/miru-data/paddata/padguide/evolutionList.json";

//slimmed down version of monsters name/ num pairs for the clients autocomplete
var monsterNameNumArr = [];
var masterMonsterUnreleasedDictionary = [];
var serverReady = false;
var monsterObjectsFromAPI = [];
var monsterEvosFromAPI = [];
var recentCards = [];

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

var elementMap = {
  fire : '1',
  water : '2',
  wood : '3',
  light : '4',
  dark : '5',
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/serverReady', function(req, res) {
  res.end(JSON.stringify(serverReady));
});

//retrieve music stuff
app.get('/retrieveSong', function(req, res) { 
  var url = SONG_API;
  var params = URL.parse(req.url, true).query.params;
  var fullUrl = url + '?apikey=' + musixKey + "&" + params;

  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: fullUrl,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.end(body);   
    }
  });

});

//retrieve lyrics
app.get('/retrieveLyrics', function(req, res) {
  var url = LYRIC_API;
  var track = URL.parse(req.url, true).query.track;
  var fullUrl = url + '?apikey=' + musixKey + "&" + track;

  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: fullUrl,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      res.end(body);   
    }
  });

});

function getMonsters() {
  //see if there was a significant amount of data in the api call to use it as opposed to the backed up hard copy!
  util.getCardsJSON()
      .then(dbCards => {
        let cardsJson = dbCards;
        util.getEvolutionsJSON()
            .then(dbEvos => {
              console.info("Done Reading Cards/Evolution Data!!");

              let evosJson = dbEvos;
              let cardsToUse = cardsJson;
              let evosToUse = evosJson;

              /*
                if the monsters/evolutions fetched from api are not the same as whats cached use them.. 
                update the cache and back up the old copies! 
              */
              let monsterEvoAPIStr = JSON.stringify(monsterEvosFromAPI);
              let monsterEvoJSONStr = JSON.stringify(evosJson);

              if(monsterEvosFromAPI.length > 0 && monsterEvoAPIStr.length !== monsterEvoJSONStr.length) {
                util.deleteEvolutions()
                    .then(result => {
                      console.log(result);
                      util.insertEvolutionsJSON(monsterEvosFromAPI)
                        .then(result => {
                          console.log(result);
                        }).catch(err => {
                          console.log("Failed to insert cards in db " + err);
                        });
                    }).catch(err => {
                      console.log("Failed to delete cards in db " + err);
                    });
                //TODO: back up data!
                //fs.writeFileSync("./JSON_DATA/evolutionList"+new Date().toISOString()+".json", monsterEvoJSONStr)
                evosToUse = monsterEvosFromAPI;
                console.info("Backed Up and Updated evolutionsList, Using Evos from API");
              }

              let monsterCardAPIStr = JSON.stringify(monsterObjectsFromAPI);
              let monserCardJSONStr = JSON.stringify(cardsJson);

              if(monsterObjectsFromAPI.length > 0 && monsterCardAPIStr.length !== monserCardJSONStr.length) {
                util.deleteCards()
                    .then(result => {
                      console.log(result);
                      util.insertCardsJSON(monsterObjectsFromAPI)
                        .then(result => {
                          console.log(result);
                          console.info("Updated na_cards, Using Cards from API");
                        }).catch(err => {
                          console.log("Failed to insert cards in db " + err);
                        });
                    }).catch(err => {
                      console.log("Failed to delete cards in db " + err);
                    });
                //TODO: backup data
                //fs.writeFileSync("./JSON_DATA/na_cards"+new Date().toISOString()+".json", monserCardJSONStr)
                cardsToUse = monsterObjectsFromAPI;
              }
              console.log("About to parse monsters: " + cardsToUse.length);
              parseDictionaryForClient(cardsToUse, evosToUse);
              scrapeImages(cardsJson);
            }).catch(err => {
              console.log("Could not get evolutions from db " + err);
            });
        }).catch(err => {
          console.log("Could not get cards from db " + err);
        });
}

function getMonstersFromAPI() {
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
        //if this fails.. just grab the monsters from the cache
        try { 
          monsterObjectsFromAPI = JSON.parse(body);
          console.info("Done Fetching Monster Data From API!!")
          getMonsterEvosFromAPI();
        } catch(e) {
          getMonsters();
        }
    } else {
      console.error("Failed Fetching Monster Data From API!!")
      getMonsters();
    }
  });
}

function getMonsterEvosFromAPI() {
  var headers = {
    'Content-Type': 'application/json'
  };

  var options = {
    url: monsterEVOJSON,
    method: 'GET',
    headers: headers,
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        try {
          monsterEvosFromAPI = JSON.parse(body).items;
          console.info("Done Fetching Monster Evolution Data From API!!")
          getMonsters();
        } catch(e) {
          getMonsters();
        }
    } else {
      console.error("Failed Fetching Monster Evolution Data From API!!")
      getMonsters();
    }
  });
}

app.get('/retrieveMonstersSuggest', function(req, res) {
  var searchStr = URL.parse(req.url, true).query.searchStr;
  let monsters = [];
  for(let mons of monsterNameNumArr) {
    if((mons.name && mons.name.toLowerCase().includes(searchStr.toLowerCase())) ||
          (mons.id && (mons.id + '') == searchStr)) {
        monsters.push(mons);
    }
    if(monsters.length >= 30) {
      break;
    }
  }
  
  res.end(JSON.stringify(monsters));
});

app.get('/imgData', function(req, res) {
  let id = URL.parse(req.url, true).query.id + ".png";
  util.getMonsterImgFromDb(id)
      .then(imgData => {
        //console.log("Retrieved Image " + imgData.name);
        res.end(JSON.stringify(imgData.img));
      }).catch(err => {
        console.log("Failed to retrieve imag in db " + id + "  " + err);
      });
});

//retrieve monster stuff, they can be filtered
app.get('/retrieveMonsters', function(req, res) {
  let typeFilters = URL.parse(req.url, true).query.typeFilter;
  let elementFilters = URL.parse(req.url, true).query.elementFilter;
  let awokenFilters = URL.parse(req.url, true).query.awokenFilter;
  let leaderFilter = URL.parse(req.url, true).query.leaderFilter;
  let activeFilter = URL.parse(req.url, true).query.activeFilter;
  let page = URL.parse(req.url, true).query.page;
  //let page = URL.parse(req.url, true).query.page;

  let hasFilter = typeFilters || 
                  leaderFilter ||
                  activeFilter ||
                  awokenFilters ||
                  elementFilters;

  let maxResults = 20;
  let monsters = [];
  //default sort
  sortById(monsterNameNumArr);

  if(typeFilters) {
    let types = JSON.parse(typeFilters);
    if(types.length > 0) {
      for(let mons of monsterNameNumArr) {
        // only return monsters that match all criteria
        let matches = true;
        for(let type of types) {
          if(!mons.types.includes(type + '')) {
            matches = false
          }
        }
        if(matches) {
          monsters.push(mons);
        }
      }
      
    } 
  } 

  if(elementFilters) {
    let monsterArr = monsters.length > 0 ? monsters : monsterNameNumArr;
    monsters = [];
    let elements = JSON.parse(elementFilters);
    if(elements.length > 0) {
      for(let mons of monsterArr) {
        // only return monsters that match all criteria
        let matches = true;
        for(let element of elements) {
          if(!mons.elements.includes(element + '')) {
            matches = false
          }
        }
        if(matches) {
          monsters.push(mons);
        }
      }
    }
  }

  if(awokenFilters) {
    let monsterArr = monsters.length > 0 ? monsters : monsterNameNumArr;
    monsters = [];
    let awokens = JSON.parse(awokenFilters);
    if(awokens.length > 0) {
      sortByAwokens(monsterArr, awokens[0]);

      for(let mons of monsterArr) {
        // only return monsters that match all criteria
        let matches = true;
        for(let awoken of awokens) {
          if(!mons.awakenings.includes(parseInt(awoken))) {
            matches = false
          }
        }
        if(matches) {
          monsters.push(mons);
        }
      }
    }
  }

  if(leaderFilter) {
    let monsterArr = monsters.length > 0 ? monsters : monsterNameNumArr;
    monsters = [];
    for(let mons of monsterArr) {
      if(mons.leaderSkillDescription && mons.leaderSkillDescription.toLowerCase().includes(decodeURIComponent(leaderFilter).toLowerCase())) {
        monsters.push(mons);
      }
    }
  }

  if(activeFilter) {
    let monsterArr = monsters.length > 0 ? monsters : monsterNameNumArr;
    monsters = [];
    for(let mons of monsterArr) {
      if(mons.activeSkillDescription && 
          mons.activeSkillDescription.toLowerCase().includes(decodeURIComponent(activeFilter).toLowerCase())) {
        monsters.push(mons);
      }
    }
  }

  let monstersSet = hasFilter ? monsters : monsterNameNumArr;
  let response = {
    total: monstersSet.length
  }

  var monstersToReturn = [];
  var min = page === 1 ? 0 : maxResults * (page - 1);
  var max = maxResults * page;
  if(monstersSet.length > maxResults) {
    monstersToReturn = monstersSet.slice(min, max);
  } else {
    monstersToReturn = monstersSet;
  }
  response.monsters = monstersToReturn;

  if(response.total > max) {
    response.hasMore = true;
  }

  res.end(JSON.stringify(response));
  return;

});

app.get('/retrieveUnreleasedMonsters', function(req, res) {
  res.end(JSON.stringify(masterMonsterUnreleasedDictionary));
});

app.get('/retrieveMonster', function(req, res) { 
  var monsterNum = URL.parse(req.url, true).query.number;
  res.end(JSON.stringify(getMonsterByNumber(monsterNum)));
});

function fillSameActives(monsArr) {
  for(let mons of monsterNameNumArr) {
      mons.sameActiveMonsters = getMonstersByActiveSkillName(mons.activeSkill);
  }
}

function getMonstersByActiveSkillName(skillName) {
  let monsters = [];
  if(skillName === null || skillName === "N/A") {
    return monsters;
  }
  for(let mons of monsterNameNumArr) {
    if(mons.activeSkill && mons.activeSkill.trim().toLowerCase() === skillName.trim().toLowerCase()) {
      let monsResponse = {
        name : mons.name,
        id : mons.id,
      }
      monsters.push(monsResponse);
    }
  }
  return monsters;
}

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

function parseDictionaryForClient(dictionary, evosArr) {
  monsterNameNumArr = [];
  masterMonsterUnreleasedDictionary = [];
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
    monstersJson.types = [monster.card.type_1_id + '', monster.card.type_2_id + '', monster.card.type_3_id + ''];
    monstersJson.elements = [monster.card.attr_id + '', monster.card.sub_attr_id + ''];
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
    monstersJson.sameActiveMonsters = [];

    if(!monster.card.released_status) {
      masterMonsterUnreleasedDictionary.push(monstersJson);
      continue;
    }

    monsterNameNumArr.push(monstersJson);
  }

  fillSameActives(monsterNameNumArr);

  sortById(monsterNameNumArr);
  sortById(masterMonsterUnreleasedDictionary);

  fillEvos(monsterNameNumArr, evosArr);
  fillEvos(masterMonsterUnreleasedDictionary, evosArr);

  console.log("Done Parsing Client Monster Data!!");
  console.log("DONE WITH DATA!!! APP READY!");
  serverReady = true;
}

function sortById(arr) {
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

  arr.sort(compare);
}

function sortByAwokens(arr, awokenIn) {
  //sort array by 1st awoken filter and by the most awokens desc
  function compare(a, b) {
    //get just the awoken that matches the first filter and how many
    const awakeningsA = a.awakenings.filter(awoken => awoken === parseInt(awokenIn)).length;
    const awakeningsB = b.awakenings.filter(awoken => awoken === parseInt(awokenIn)).length;

    let comparison = 0;
    if (awakeningsA < awakeningsB) {
      comparison = 1;
    } else if (awakeningsA > awakeningsB) {
      comparison = -1;
    }
    return comparison;
  }

  arr.sort(compare);
}

function scrapeImages(oldCards) {
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
    let arr = monsterNameNumArr;//.slice(0, 19);
    var newImageDocs = [];
    //only get image if it doesnt exist!
    for(let i = 0; i < arr.length; i++) {
      let monster = arr[i];
      let imgExt = monster.id + ".png";
      let isNewCard = await newCard(imgExt);
      if(isNewCard) {
        recentCards.push(monster);
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
        var img64 = await page.renderBase64('PNG');  
        if(img64.length > 0) {
          var imageDoc = {
            name : imgExt,
            img: Buffer.from(img64, 'base64')
          }; 
          newImageDocs.push(imageDoc);
         
          console.log('created: ' + imgExt)  
        } else {
          console.log('*** DID NOT CREATED: ' + imgExt)  
        } 
      }
    }
    await instance.exit();
    if(newImageDocs.length > 0) {
      util.insertImagesIntoDb(newImageDocs)
          .then(result => {
            console.log(result);
            console.log("Done!");
          }).catch(err => {
            console.log("Failed to insert images in db " + err);
          });
      util.insertNewCardsJSON(recentCards)
          .then(result => {
            console.log(result);
          }).catch(err => {
            console.log("Failed to insert cards in db " + err);
          });
    }
    console.info("Done Scraping Images");
  })();
}

async function newCard(id) {
  return util.monsterImgExistsInDb(id)
      .then(isNewCard => {
        if(isNewCard) {
          console.log("Is new card " + id);
        }
        return isNewCard;
      }).catch(err => {
        console.log("Failed to search if was new card " + err);
        return false;
      });
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
  //push the rest of the evos in
  // for(let monster of monsterNameNumArr) {
  //   if(monster.ancestorId !== 0) {
  //     let monstersToPushToEvo = [];
  //     let ancestor = getMonsterByNumber(monster.ancestorId);
  //     for(let subEvo of ancestor.evoTree) {
  //       //only push unique evos 
  //       for(let checkExistEvo of monster.evoTree) {
  //         let exists = false;
  //         if(JSON.stringify(checkExistEvo) !== JSON.stringify(subEvo)) {
  //           for(let checkPushEvo of monstersToPushToEvo) {
  //             if(JSON.stringify(checkPushEvo) === JSON.stringify(subEvo)) {
  //               exists = true;
  //             }
  //           }
  //         }
  //         if(!exists) {
  //           monstersToPushToEvo.push(subEvo);
  //         }
  //       }
  //     }
  //     // if(monster.id === 5157 && monster.ancestorId === 4305) {
  //     //   console.log('got')
  //     //   console.log(JSON.stringify(ancestor));
  //     //   console.log(JSON.stringify(monstersToPushToEvo));
  //     // }
  //     // for(let evo of monster.evoTree) {
  //     //   let befMonster = getMonsterByNumber(evo.evoFromId);
  //     //   //if(befMonster.id != monster.id) {
  //     //     if(befMonster && befMonster.evoTree) {
  //     //       for(let subEvo of befMonster.evoTree) {
  //     //         monstersToPushToEvo.push(subEvo);
  //     //       }
  //     //     }
  //     //   //}
  //     // }
  //     monster.evoTree = monster.evoTree.concat(monstersToPushToEvo);
  //   }
  //}
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

//function to copy all images from disc to mongo db... will prob never need this again.
function copyImagesToMongo() {
  var imagePaths = fs.readdirSync('client/public/images/monsterIcons');
  var imageDocs = [];
  for (var i = 0; i < imagePaths.length; i++) {
    var img = fs.readFileSync('client/public/images/monsterIcons/' + imagePaths[i]);
    var img64 = img.toString('base64');
    var imageDoc = {
      name : imagePaths[i],
      img: Buffer.from(img64, 'base64')
    };
    imageDocs.push(imageDoc);
  }
  util.insertImagesIntoDb(imageDocs)
      .then(result => {
        console.log(result);
      }).catch(err => {
        console.log("Failed to images in db " + err);
      });
}

app.listen(port, function () {
  console.log("booting... on port " + port ); 
  try {
    //don't constantly pull from the api.. the getmonsters will pull from the mongo db copy!. The api is only called daily.
    //getMonstersFromAPI();
    getMonsters();
  } catch(e) {
    console.error("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
  }

  //run once a day!
  setInterval(function(){
  try {
      console.info('Updating Library from Schedule!');
      getMonstersFromAPI();
  } catch(e) {
      console.error("SOMETHING FAILED IN MONSTER RETRIEVAL/PARSING " + e);
      getMonsters();
  }
  }, 86400000);
});
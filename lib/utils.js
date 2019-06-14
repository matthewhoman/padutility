const {
    connect,
    close,
    dbName
} = require('./mongohelper.js');

var ObjectID = require('mongodb').ObjectID; 
var gridfs = require('gridfs-stream');

//query only cards
//db.getCollection('na_cards').find({}, {'card': 1, "_id" : 0})
//query only cards - ids
//db.getCollection('na_cards').find({}, {'card.card_id': 1, "_id" : 0})

module.exports = {        
    // Retrieve user profile 
    getCardsJSON: async () => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            client.db(dbName).collection("na_cards").find(
                {}, {'card': 1, "_id" : 0} //all cards with no mongo id
            ).toArray().then(function (cards) {
                if (cards != null) {
                    resolve(cards);
                } else {
                    console.log(cards)
                    resolve("NA_CARDS NOT FOUND IN DB");
                }
                close(client);
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("NA_CARDS NOT FOUND IN DB");
            })
        }
        )))))()),
    deleteCards: async () => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //delete old collection
            client.db(dbName).collection("na_cards").deleteMany({
            })
            .then(function() {
                close(client);
                resolve("Successfully Deleted Cards")
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT DELETE CARDS FROM DB");
            });
        }
        )))))()),
    //TODO: ADD CHUNK LOGIC FOR LARGE DATA
    insertCardsJSON: async (cards) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //add new collection
            client.db(dbName).collection("na_cards").insertMany(
                cards
            )
            .then(function (doc) {
                close(client);
                resolve("Successfully Saved Cards ");
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT INSERT CARDS IN DB");
            });
        }
        )))))()),
    getEvolutionsJSON: async () => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            client.db(dbName).collection("evolutionList").find(
                {}, {"_id" : 0} //all evos with no mongo id
            ).toArray().then(function (evos) {
                if (evos != null) {
                    resolve(evos);
                } else {
                    console.log(evos)
                    resolve("EVOLUTIONS NOT FOUND IN DB");
                }
                close(client);
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("EVOLUTIONS NOT FOUND IN DB");
            })
        }
        )))))()),
    deleteEvolutions: async () => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //delete old collection
            client.db(dbName).collection("evolutionList").deleteMany({
            })
            .then(function() {
                close(client);
                resolve("Successfully Deleted Evolutions")
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT DELETE EVOS FROM DB");
            });
        }
        )))))()),
    insertEvolutionsJSON: async (evos) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //add new collection
            client.db(dbName).collection("evolutionList").insertMany(
                evos
            ).then(function (doc) {
                close(client);
                resolve("Successfully Saved Evolutions ");
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT INSERT EVOS IN DB");
            });
        }
        )))))()),
    insertImagesIntoDb: async (imgs) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //add new collection
            client.db(dbName).collection("monsterImages").insertMany(
                imgs
            ).then(function (doc) {
                close(client);
                resolve("Successfully Saved Imgs ");
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT INSERT IMG IN DB");
            });
        }
        )))))()),
    monsterImgExistsInDb: async (id) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //add new collection
            client.db(dbName).collection("monsterImages").find(
                {name: id}
            ).toArray().then(function (imgResult) {
                close(client);
                resolve(imgResult.length > 0 ? false : true);
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT INSERT IMG IN DB");
            });
        }
        )))))()),
    getMonsterImgFromDb: async (id) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            //add new collection
            client.db(dbName).collection("monsterImages").findOne(
                {name:id}, {_id: 0, name: 0}
            ).then(function (imgData) {
                close(client);
                resolve(imgData);
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve("COULD NOT RETRIEVE IMG FROM DB");
            });
        }
        )))))())
};
const mongoClient = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017';

module.exports = {

    /* 
     * 
     * Mongo Utility: Connect to Client */
    connect: async () => (
        client = await (() => (new Promise((resolve, reject) => (

            mongoClient.connect(mongoUrl, {
                    useNewUrlParser: true
                },
                (err, client) => {
                    if (err){
                        reject(err)
                    }
                    else {
                        resolve(client);
                    }
                })
        ))))()),

    /* 
     * 
     * Mongo Utility: Close Client */
    close: async (client) => {
        client.close();
        return true;
    },

    dbName: 'heroku_41nv1j02'
};
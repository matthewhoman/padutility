const {
    connect,
    close,
    dbName
} = require('./mongohelper.js');

var ObjectID = require('mongodb').ObjectID; 

module.exports = {

    // Sign up new user
    // The first and last name are stored in the user_profile table 
    // The email address and password (for now) are stored in the user_account table
    signUp: async (user) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let userAccountCollectionName = 'user_account';
            let userProfileCollectionName = 'user_profile'; 
            let insertedId = "";

            // Check to see if the email address already exists in the system.
            // We are using email as the way to uniquely identify a user.  
            client.db(dbName).collection(userAccountCollectionName).findOne({
                "email": user.email
            })
            .then(function (result) {
                if (result == null) {
                    console.log("USER=" + JSON.stringify(user));
                    console.log(user.email);
                    // construct the JSON to insert into the user_account table 
                    let useraccountobject = {
                        email: user.email,
                        password: user.password
                    }

                    client.db(dbName).collection(userAccountCollectionName).insertOne(useraccountobject)
                        .then(function (value) {
                            //console.log(value);
                            //console.log("*****=" + value.insertedId)
                            insertedId = String(value.insertedId); 

                            // After inserting into the user_account table then insert into the 
                            // user_profile table where first_name and last_name are being stored
                            let userprofileobject = {
                                user_id: insertedId, 
                                first_name: user.first_name,
                                last_name: user.last_name
                            }
                            // Using updateOne here because it can handle creating a new entry 
                            // or update an existing one when the upsert option is set to true.    
                            client.db(dbName).collection(userProfileCollectionName).updateOne({
                                    'user_id': insertedId
                                }, {
                                    $set: {
                                        'user_id': insertedId,
                                        'first_name' : user.first_name,
                                        'last_name' : user.last_name
                                    }
                                }, {
                                    upsert: true
                                })
                                .then(function (doc) {
                                    close(client);
                                    resolve({
                                        userAdded: true,
                                        duplicateAccount: false
                                    });
                                })
                                .catch(function (error) {
                                    close(client);
                                    reject(error);
                                });
                        })
                        .catch(function (error) {
                          console.log(error);
                          resolve({
                              userAdded: false,
                              duplicateAccount: false
                          });
                        })
                } else {
                    console.log(JSON.stringify(user) + " already exists in the database.") 
                    resolve({
                        userAdded: false,
                        duplicateAccount: true
                    });
                }
            })
        }
        )))))()),

    // Update the user profile 
    updateProfile: async (user) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let userProfileCollectionName = 'user_profile'; 

            // Update the first_name and/or last_name of the user_id  
            client.db(dbName).collection(userProfileCollectionName).updateOne(
                {"user_id": user.user_id},
                { $set: {"first_name" : user.first_name, "last_name" : user.last_name}},
            )
            .then(function (result) {
                if (result.modifiedCount) {
                    resolve({
                        matchedCount: result.matchedCount,
                        modifiedCount: result.modifiedCount
                    });
                    
                } else {
                    resolve({
                        matchedCount: result.matchedCount,
                        modifiedCount: result.modifiedCount
                    });
                }
            })
        }
        )))))()),
        
    // Retrieve user profile 
    getUserProfile: async (user) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let userProfileCollectionName = 'user_profile';
            let userAccountCollectionName = 'user_account';
            let profile = {
                first_name: null,
                last_name: null,
                email_address: null
            };

            console.log("USER_ID=" + user.user_id);
            // Get the first_name and last_name from the DB based on _id  
            client.db(dbName).collection(userProfileCollectionName).findOne({
                "user_id": user.user_id
            })
            .then(function (doc) {
                if (doc != null) {
                   
                    console.log("USER=" + JSON.stringify(doc));
                    client.db(dbName).collection(userAccountCollectionName ).findOne({_id: new ObjectID(user.user_id)})
                    .then(function (doc2) {
                        profile.first_name = doc.first_name;
                        profile.last_name = doc.last_name;

                        if (doc2 != null) {
                            profile.email_address = doc2.email;
                        }
                        else {
                            profile.email_address = '';
                        }
                        close(client);
                        resolve(profile);
                    })
                    .catch(function (error) {
                        console.log(error);
                        close(client);
                        resolve(profile);
                    })
                }
                else {
                    console.log(doc)
                    close(client);
                    resolve(profile);
                }
            })
            .catch(function (error) {
                console.log(error);
                close(client);
                resolve(profile);
            })
        }
        )))))()),

    // Register Patient to User
    registerUserPatient: async (register) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let collectionName = 'user_patient';

            // see if there is already existing document for user
            client.db(dbName).collection(collectionName).findOne({
                    "user_id": register.userId
                })
                .then(function (doc) {
                    let patient = {
                        patient_id: register.patientId,
                        name: register.name,
                        last_name: register.lastName,
                        active: true
                    };

                    if (doc == null) {

                        // insert new entry if user_patient entry does not exist
                        let userPatient = {
                            user_id: register.userId,
                            patients: [patient]
                        };
                        client.db(dbName).collection(collectionName).insertOne(userPatient)
                            .then(function (doc) {
                                close(client);
                                resolve(doc);
                            })
                            .catch(function (error) {
                                close(client);
                                reject(error);
                            });
                    } else {

                        // if user document exist, upsert the specific extry
                        console.log(doc);
                        let temp = doc.patients.filter(el => el.patient_id !== register.patientId);
                        temp.push(patient);

                        client.db(dbName).collection(collectionName).updateOne({
                                '_id': doc._id
                            }, {
                                $set: {
                                    'patients': temp
                                }
                            }, {
                                upsert: true
                            })
                            .then(function (doc) {
                                close(client);
                                resolve(doc);
                            })
                            .catch(function (error) {
                                close(client);
                                reject(error);
                            });
                    }
                })
                .catch(function (error) {
                    close(client);
                    reject(error);
                });
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })))))()),

    // Unsubscribe Patient from User
    unsubsribeUserPatient: async (userId, patientId) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let collectionName = 'user_patient';

            client.db(dbName).collection(collectionName).updateOne({
                    'user_id': userId,
                    'patients.patient_id': patientId
                }, {
                    $set: {
                        'patients.$.active': false
                    }
                }, {
                    upsert: true
                })
                .then(function (doc) {
                    close(client);
                    resolve(doc);
                })
                .catch(function (error) {
                    close(client);
                    reject(error);
                });
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })))))()),

    // Upserts to token_cache collection
    updateTokenCache: async (token) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {
            let collectionName = 'token_cache';

            // upserts the token
            token.lastUpdatedDate = new Date();
            client.db(dbName).collection(collectionName).findOneAndReplace({
                    'patientId': token.accessToken.patient
                }, token, {
                    upsert: true
                })
                .then(function (value) {
                    close(client);
                    resolve(true);
                })
                .catch(function (error) {
                    close(client);
                    reject(error);
                })
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })))))()),

    // Find a document for a collection
    findDocument: async (collectionName, query) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {

            client.db(dbName).collection(collectionName).findOne(query)
                .then(function (doc) {
                    close(client);
                    resolve(doc);
                })
                .catch(function (error) {
                    close(client);
                    reject(error);
                })
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })))))()),

    // Insert a document for a collection
    insertDocument: async (collectionName, document) => (await (() => (
        new Promise((resolve, reject) => (connect().then(client => {

            client.db(dbName).collection(collectionName).insertOne(document)
                .then(function (doc) {
                    close(client);
                    resolve(doc);
                })
                .catch(function (error) {
                    close(client);
                    reject(error);
                })
        }).catch(function (error) {
            console.log(error);
            reject(error);
        })))))())
};
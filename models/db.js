
const mongoose = require('mongoose');

//const TransactionModel = require('./UserModel.js');

const url = 'mongodb://localhost:27017/Kuuhaku';

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
};

const database = {

    connect: function () {
        mongoose.connect(process.env.MONGODB_URI || url, options, function (error) {
            if (error) throw error;
            if(process.env.MONGODB_URI){console.log('Connected to:' + process.env.MONGODB_URI)}
            else{console.log('Connected to:' + url)};
        });
    },

    insertOne: function (model, doc, callback) {
        model.create(doc, function (error, result) {
            if (error) return callback(false);
            console.log('Added ' + result);
            return callback(result);
        });
    },

    insertMany: function (model, docs, callback) {
        model.insertMany(docs, function (error, result) {
            if (error) return callback(false);
            console.log('Added ' + result);
            return callback(true);
        });
    },

    findOne: function (model, query, projection, callback) {
        model.findOne(query, projection, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
    },

    findMany: function (model, query, projection, callback) {
        model.find(query, projection, function (error, result) {
            if (error) return callback(false);
            return callback(result);
        });
    },

    updateOne: function (model, filter, update, callback) {
        model.updateOne(filter, update, function (error, result) {
            if (error) return callback(false);
            console.log('Document modified: ' + result.nModified);
            return callback(result);
        });
    },

    updateMany: function (model, filter, update, callback) {
        model.updateMany(filter, update, function (error, result) {
            if (error) return callback(false);
            console.log('Documents modified: ' + result.nModified);
            return callback(true);
        });
    },

    deleteOne: function (model, conditions, callback) {
        model.deleteOne(conditions, function (error, result) {
            if (error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
        });
    },

    deleteMany: function (model, conditions, callback) {
        model.deleteMany(conditions, function (error, result) {
            if (error) return callback(false);
            console.log('Document deleted: ' + result.deletedCount);
            return callback(true);
        });
    }

}

module.exports = database;


const mongoose = require('mongoose');
const db = require('../../models/db.js');

const Achievement = require('../../models/AchievementModel.js');
const achievmentsList = [
    {
      "name": "Savvy Saver I",
      "description": "Reach 2K savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 2000
      }
    },
    {
      "name": "Savvy Saver II",
      "description": "Reach 5K savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 5000
      }
    },
    {
      "name": "Savvy Saver III",
      "description": "Reach 10K savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 10000
      }
    },
    {
      "name": "Organized I",
      "description": "Have 5 categories with at least P500 each",
      "countType": "Category",
      "goal": 5,
      "condition": {
        "amount": 500
      }
    },
    {
      "name": "Organized II",
      "description": "Have 10 categories with at least P500 each",
      "countType": "Category",
      "goal": 10,
      "condition": {
        "amount": 500
      }
    },
    {
      "name": "Organized III",
      "description": "Have 20 categories with at least P500 each",
      "countType": "Category",
      "goal": 20,
      "condition": {
        "amount": 500
      }
    }
];

const updater = {

    updateAchievements: function ( ) {
        for(var i = 0 ; i < achievmentsList.length; i++)
        {
            Achievement.updateMany({name:achievmentsList[i].name}, achievmentsList[i], { upsert: true}, function (error, result) {
                if (error)  console.log('Failed to update achievement');
            });   
        }
    }

}

module.exports = updater;

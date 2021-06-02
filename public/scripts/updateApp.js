
const mongoose = require('mongoose');
const db = require('../../models/db.js');

const Achievement = require('../../models/AchievementModel.js');
const achievmentsList = [
    {
      "name": "Cashing In",
      "description": "Spend 2K worth of savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 2000
      }
    },
    {
      "name": "Breaking The Bank",
      "description": "Spend 5K worth of savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 5000
      }
    },
    {
      "name": "Worth It!",
      "description": "Spend 10K worth of savings",
      "countType": "Category",
      "goal": 1,
      "condition": {
        "category": "Savings",
        "amount": 10000
      }
    },
    {
      "name": "Organized Spender",
      "description": "Spend 500 in 5 categories",
      "countType": "Category",
      "goal": 5,
      "condition": {
        "amount": 500
      }
    },
    {
      "name": "Many Mouths To Feed",
      "description": "Spend 500 in 10 categories",
      "countType": "Category",
      "goal": 10,
      "condition": {
        "amount": 500
      }
    },
    {
      "name": "Where Did All The Money Go?",
      "description": "Spend 500 in 20 categories",
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

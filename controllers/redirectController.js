const db = require('../models/db.js');

const async = require('async');
const session = require('express-session');
const hash = require('password-hash');

const User = require('../models/UserModel.js');
const Category = require('../models/CategoryModel.js');
const Expense = require('../models/ExpenseModel.js');
const Income = require('../models/IncomeModel.js');
const Avatar = require('../models/AvatarModel.js');
const Achievement = require('../models/AchievementModel.js');
const Reward = require('../models/RewardModel.js');

const controller = {

    goToLogin: function (req, res) {
        res.render('login', {});
    },

    goToRegister: function (req, res) {
        res.render('register', {});
    },

    goToLanding: function (req, res) {
        db.findMany(Category, { username: req.session.username }, null, function (result) {
            var user = {
                username: req.session.username,
                displayname: req.session.displayname,
                level: req.session.level,
                hp: req.session.hp,
                maxHp: req.session.maxHp,
                hpPercent: req.session.hp * 100 / req.session.maxHp,
                hpColor: "red",
                xp: req.session.xp,
                maxXp: req.session.maxXp,
                xpPercent: req.session.xp * 100 / req.session.maxXp,
                xpColor: "gold",
                avatar: req.session.avatar,
                forButton: result[0]
            };
            // category: result

            var category = [];
            result.forEach(function (c, i) {
                c.amountLeft = c.maxAmount - c.amount;

                category.push(c);

                if (i == result.length - 1) {
                    user.category = category;
                    res.render('landing', user);
                }
            });

        });
    },

    goToAccount: function (req, res) {
        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar
        };

        res.render('account', user);
    },
    goToBudget: function (req, res) {
        var filter = {
            username: req.session.username,
            categoryName: { $ne: "Savings" }
        };

        db.findMany(Category, filter, null, function (result) {
            var user = {
                username: req.session.username,
                displayname: req.session.displayname,
                level: req.session.level,
                hp: req.session.hp,
                maxHp: req.session.maxHp,
                hpPercent: req.session.hp * 100 / req.session.maxHp,
                hpColor: "red",
                xp: req.session.xp,
                maxXp: req.session.maxXp,
                xpPercent: req.session.xp * 100 / req.session.maxXp,
                xpColor: "gold",
                avatar: req.session.avatar
            };

            var categories = [];
            result.forEach(function (elem, index) {
                var category = {
                    categoryName: elem.categoryName,
                    icon: elem.icon,
                    color: elem.color,
                    amount: elem.amount,
                    maxAmount: elem.maxAmount
                };

                if (elem.maxAmount == 0) {
                    category.percent = 100;
                }
                else {
                    var catValue = (-elem.amount / elem.maxAmount * 100).toFixed(2);
                    category.percent = 100;
                    if (catValue < 100) {
                        category.percent = catValue;
                    }
                }

                categories.push(category);

                if (index == result.length - 1) {
                    user.categories = categories;

                    filter.categoryName = "Savings";

                    db.findMany(Expense, filter, null, function (savings) {
                        var amt = 0;
                        savings.forEach(function (elem, index) {
                            amt += elem.amount;

                            if (index == savings.length - 1) {
                                user.savingsAmt = amt.toFixed(2);
                                res.render('budget', user);
                            }
                        });

                        if (savings.length == 0) {
                            user.savingsAmt = 0.00;
                            res.render('budget', user);
                        }
                    });
                }
            });

            if (result.length == 0) {
                user.categories = categories;
            }

            filter.categoryName = "Savings";

            db.findMany(Expense, filter, null, function (savings) {
                var amt = 0;
                savings.forEach(function (elem, index) {
                    amt += elem.amount;

                    if (index == savings.length - 1) {
                        user.savingsAmt = amt.toFixed(2);
                        res.render('budget', user);
                    }
                });

                if (savings.length == 0) {
                    user.savingsAmt = 0.00;
                    res.render('budget', user);
                }
            });
        });
    },

    goToIncome: async function (req, res) {
        var dateGroup = await Income.aggregate([
            { $match: { username: req.session.username}}, 
            {
                $project: {
                    year: { "$year": "$date" },
                    month: { "$month": "$date" }
                }
            },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: null,
                    distinctDates: { "$addToSet": { year: "$year", month: "$month"} }
                }
            }
        ]);

        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar,
        };

        var dates;
        if (dateGroup.length > 0) {
            dates = dateGroup[0].distinctDates;
            for (var i = 0; i < dates.length; i++) {
                dates[i].record = await Income.find({
                    username: req.session.username,
                    $expr: {
                        $and: [
                            { "$eq": [{ "$month": "$date" }, dates[i].month] },
                            { "$eq": [{ "$year": "$date" }, dates[i].year] }
                        ]
                    }
                });
            };
        }
        else {
            dates = [];
        }
        user.months= dates;
        res.render('income',user);
    },

    goToAchievements: async function (req, res) {
        var locked = [];
        var unlocked = [];
        var achievements = await Achievement.find({});
        for (var i = 0; i < achievements.length; i++) {
            var claimed = await Reward.findOne({ username: req.session.username, rewardname: achievements[i].name });
            if (claimed == null) {
                var cond = achievements[i].condition;
                cond.username = req.session.username;

                var count = await Category.find({username: req.session.username, amount: { $lte: -cond.amount }});

                if (count.length >= achievements[i].goal) {
                    await Reward.create({ username: req.session.username, rewardname: achievements[i].name });
                    console.log("Achievement Unlocked: " + achievements[i].name);
                    unlocked.push(achievements[i]);
                }
                else {
                    locked.push(achievements[i]);
                }
            }
            else {
                unlocked.push(achievements[i]);
            }
        }
        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar
        };
        user.unlocked = unlocked;
        user.locked = locked;
        res.render('achievements', user);

    },

    goToCategory: async function (req, res) {

        var dateGroup = await Expense.aggregate([
            { $match: { username: req.session.username, category: req.query.categoryName } }, //change to current category
            {
                $project: {
                    year: { "$year": "$date" },
                    month: { "$month": "$date" },
                    day: { "$dayOfMonth": "$date" }
                }
            },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: null,
                    distinctDates: { "$addToSet": { year: "$year", month: "$month", day: "$day" } }
                }
            }
        ]);

        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar,
        };

        var dates;
        if (dateGroup.length > 0) {
            dates = dateGroup[0].distinctDates;
            for (var i = 0; i < dates.length; i++) {
                dates[i].items = await Expense.find({
                    username: req.session.username, category: req.query.categoryName,  //change to current category
                    $expr: {
                        $and: [
                            { "$eq": [{ "$dayOfMonth": "$date" }, dates[i].day] },
                            { "$eq": [{ "$month": "$date" }, dates[i].month] },
                            { "$eq": [{ "$year": "$date" }, dates[i].year] }
                        ]
                    }
                });
            };
        }
        else {
            dates = [];
        }

        db.findOne(Category, { username: req.session.username, categoryName: req.query.categoryName }, null, function (result) {
            var amountLeft = result.maxAmount - result.amount;
            console.log("amt left");
            console.log(result);
            user.dates = dates;
            user.category = req.query.categoryName; //change to current category
            user.amountLeft = amountLeft;
            req.session.categoryPage = req.query.categoryName;
            res.render('category', user); //help
        });
    },

    goToSavings: async function (req, res) {
        var dateGroup = await Expense.aggregate([
            { $match: { username: req.session.username, category: "Savings" } },
            {
                $project: {
                    year: { "$year": "$date" },
                    month: { "$month": "$date" },
                    day: { "$dayOfMonth": "$date" }
                }
            },
            { $sort: { date: -1 } },
            {
                $group: {
                    _id: null,
                    distinctDates: { "$addToSet": { year: "$year", month: "$month", day: "$day" } }
                }
            }
        ]);

        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar,
        };

        var dates;
        if (dateGroup.length > 0) {
            dates = dateGroup[0].distinctDates;
            for (var i = 0; i < dates.length; i++) {
                dates[i].items = await Expense.find({
                    username: req.session.username, category: "Savings",
                    $expr: {
                        $and: [
                            { "$eq": [{ "$dayOfMonth": "$date" }, dates[i].day] },
                            { "$eq": [{ "$month": "$date" }, dates[i].month] },
                            { "$eq": [{ "$year": "$date" }, dates[i].year] }
                        ]
                    }
                });
            };
        }
        else {
            dates = [];
        }

        user.dates = dates;
        res.render('savings', user);
    },

    goToAvatar: function (req, res) {
        res.render('avatar_custom', { username: req.session.username, avatar: req.session.avatar }); //help
    },

    goToAbout: function (req, res) {
        var user = {
            username: req.session.username,
            displayname: req.session.displayname,
            level: req.session.level,
            hp: req.session.hp,
            maxHp: req.session.maxHp,
            hpPercent: req.session.hp * 100 / req.session.maxHp,
            hpColor: "red",
            xp: req.session.xp,
            maxXp: req.session.maxXp,
            xpPercent: req.session.xp * 100 / req.session.maxXp,
            xpColor: "gold",
            avatar: req.session.avatar
        };

        res.render('about', user);
    }
}

module.exports = controller;

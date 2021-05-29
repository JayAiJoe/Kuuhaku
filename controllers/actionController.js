const db = require('../models/db.js');
const hbs = require(`hbs`);
const session = require('express-session');
const bcrypt = require('bcryptjs');

const rdc = require(`../controllers/redirectController.js`);

//database models
const User = require('../models/UserModel.js');
const Expense = require('../models/ExpenseModel.js');
const Category = require('../models/CategoryModel.js');
const Income = require('../models/IncomeModel.js');
const Avatar = require('../models/AvatarModel.js');
const Achievement = require('../models/AchievementModel.js');
const Reward = require('../models/RewardModel.js');

const controller = {

    login: function (req, res) {

        db.findOne(User, { username: req.body.username }, { username: 1, password: 1 }, function (result) {

            if (result == null || !(bcrypt.compareSync(req.body.password, result.password))) {
                res.send('invalid');
            }
            else {
                //get user details
                db.findOne(User, { username: req.body.username }, {}, function (account) {
                    req.session.username = account.username;
                    req.session.displayname = account.displayname;
                    req.session.level = account.level;
                    req.session.hp = account.hp;
                    req.session.maxHp = account.maxHp;
                    req.session.xp = account.xp;
                    req.session.maxXp = account.maxXp;

                    db.findOne(Avatar, { username: req.session.username }, { username: 1, face: 1, hairf: 1, outfit: 1, hairb: 1, gender: 1 }, function (result) {
                        if (result == null) {
                            req.session.avatar = { gender: 'male', hairf: 1, face: 1, hairb: 1, outfit: 1 };
                        }
                        else {
                            req.session.avatar = result;
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
                        }

                        db.findMany(Category, { username: req.session.username }, null, function (result) {
                            user.forButton = result[0];

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

                    });
                });

            }
        });
    },

    verifyLogin: function (req, res, next) {

        if (req.session.username) {
            next();
        }
        else {
            res.redirect('/');
        }
    },

    register: function (req, res) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        var newUser = {
            username: req.body.username,
            password: hash,
            displayname: req.body.username,
            level: 1,
            hp: 200,
            maxHp: 200,
            xp: 0,
            maxXp: 1500
        };

        db.findOne(User, { username: req.body.username }, { username: 1 }, function (result) {
            if (result == null) {
                db.insertOne(User, newUser, function (result) {
                    if (result) {
                        req.session.username = newUser.username;
                        req.session.displayname = newUser.username;
                        req.session.level = newUser.level;
                        req.session.hp = newUser.hp;
                        req.session.maxHp = newUser.maxHp;
                        req.session.xp = newUser.xp;
                        req.session.maxXp = newUser.maxXp;

                        var category = {
                            username: req.session.username,
                            categoryName: 'Savings',
                            amount: 0,
                            maxAmount: 0,
                            color: '#88B14B',
                            icon: 'fa-piggy-bank'
                        };

                        var income ={
                            username: req.session.username,
                            description: "Default Income",
                            amount: 0
                        }

                        db.insertOne(Income,income, function(result)
                        {
                            
                        });

                        db.insertOne(Category, category, function (result) {
                            console.log("category");
                            console.log(result);


                            newUser.category = [result];

                            db.insertOne(Avatar, { username: req.session.username }, function (result) {
                                newUser.hpColor = "red";
                                newUser.xpColor = "gold";
                                newUser.hpPercent = req.session.hp * 100 / req.session.maxHp;
                                newUser.xpPercent = req.session.xp * 100 / req.session.maxXp;
                                newUser.avatar = result;
                                req.session.avatar = result;

                                res.render('landing', newUser);
                            });
                        });


                    }
                    else {
                        res.sendStatus(400);
                    }
                });
            }
            else {
                res.send('taken');
            }
        });
    },

    getAccountDetails: function (req, res) {
        db.findOne(User, { username: req.body.username }, {}, function (result) {
            res.send(result);
        });
    },

    logOut: function (req, res) {
        req.session.destroy();
        res.clearCookie('username');
        res.redirect('/')
    },

    deleteAccount: function (req, res) {
        //delete related documents first
        db.deleteOne(Avatar, { username: req.session.username }, function (result) { });
        db.deleteMany(Category, { username: req.session.username }, function (result) { });
        db.deleteMany(Expense, { username: req.session.username }, function (result) { });
        db.deleteMany(Income, { username: req.session.username }, function (result) { });

        db.deleteOne(User, { username: req.session.username }, function (result) {
            res.render('login');
        });
    },

    updateUsername: function (req, res) {
        var user = {
            username: req.session.username
        };

        var update = {
            $set: {
                username: req.body.user
            }
        };

        db.updateOne(User, user, update, function (result) {
            if (result) {
                req.session.username = req.body.user
            }
            console.log(req.session.username);
            res.send({ success: result });
        });
    },

    updateDisplayname: function (req, res) {
        var user = {
            username: req.session.username
        };

        var update = {
            $set: {
                displayname: req.body.user
            }
        };

        db.updateOne(User, user, update, function (result) {
            if (result) {
                req.session.displayname = req.body.user
            }
            console.log(req.session.displayname);
            res.send({ success: result });
        });
    },

    updatePassword: function (req, res) {
        var user = {
            username: req.session.username
        };

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.newpass, salt);

        var update = {
            $set: {
                password: hash
            }
        };

        db.updateOne(User, user, update, function (result) {
            console.log(req.session.displayname);
            res.send({ success: result });
        });
    },

    getCheckPassword: function (req, res) {
        var user = {
            username: req.session.username,
        };

        var projection = {
            username: 1,
            password: 1
        };

        db.findOne(User, user, projection, function (result) {
            if (bcrypt.compareSync(req.query.pass, result.password)) {
                res.send({ success: result });
            }
        });
    },

    searchExpenses: function (req, res) {
        var search =
        {
            $text: {
                $search: req.query.search
            }
        };

        Expense.createIndex({
            "description": "text"
        });

        db.findMany(Expense, search, {}, function (result) {
            console.log(result);
            res.send(result);
        });
    },

    getBudgetAllocation: function (req, res) {
        var filter = {
            username: req.session.username,
            categoryName: { $ne: "Savings" }
        };
        console.log(filter);

        var projection = {
            categoryName: 1,
            color: 1,
            maxAmount: 1
        };

        db.findMany(Category, filter, projection, function (result) {
            console.log(result);
            res.send(result);
        });
    },

    updateOneBudgetAllocation: function (req, res) {
        var filter = {
            username: req.session.username,
            categoryName: req.body.categoryName
        };

        var update = {
            $set: {
                maxAmount: req.body.maxAmount
            }
        };

        db.updateOne(Category, filter, update, function (result) {
            console.log(result);
            res.send(result);
        });
    },

    getCategoryDetails: function (req, res) {
        db.findOne(Category, { username: req.session.username, categoryName: req.session.categoryPage }, {}, function (result) {
            res.send(result);
        });
    },

    getCategories: function (req, res) {
        db.findMany(Category, { username: req.session.username }, {}, function (result) {
            res.send(result);
        });
    },

    addCategory: function (req, res) {
        var newCategory = {
            username: req.session.username,
            categoryName: req.query.categoryName,
            icon: "fa-utensils",
            color: "gold",
            amount: 0,
            maxAmount: 0
        };


        db.findOne(Category, { username: req.session.username, categoryName: req.query.categoryName }, { username: 1, categoryName: 1 }, function (result) {
            if (result) {
                console.log('Category already exists');
                res.send('');
            }
            else {
                db.insertOne(Category, newCategory, function (result) {
                    res.send(result);
                    // if (result) {
                    //     // var template = hbs.handlebars.partials.category_card;
                    //     // console.log(newCategory);
                    //     // var msg = template({
                    //     //     categoryName: req.query.categoryName,
                    //     //     icon: "fa-utensils",
                    //     //     percent: 100
                    //     // });
                    // }
                });
            }
        });

    },

    deleteCategory: function (req, res) {
        db.deleteOne(Category, { username: req.session.username, categoryName: req.query.category }, function (result) {
            if (result) {
                res.render('budget', { username: req.session.username, avatar: req.session.avatar });
            }
        });
    },

    addExpense: function (req, res) {
        var newExpense = {
            username: req.session.username,
            category: req.query.category,
            description: req.query.description,
            amount: req.query.amount
        }

        db.insertOne(Expense, newExpense, function (result) {
            if (result) {
                db.updateOne(Category, { username: req.session.username, categoryName: req.query.category }, { "$inc": { amount: -req.query.amount } },
                    function (err, doc) {
                        if (!err) {
                            var user = {
                                username: req.session.username,
                                displayname: req.session.displayname,
                                level: req.session.level,
                                xp: req.session.xp,
                                avatar: req.session.avatar
                            }
                            db.findMany(Category, { username: req.session.username }, null, function (result) {
                                res.render('landing', { category: result, forButton: result[0], user })
                            });
                        }
                    });
            }
            else {
                res.send('');
            }

        });
    },

    addCategoryExpense: function (req, res) {
        var newExpense = {
            username: req.session.username,
            category: req.query.category,
            description: req.query.description,
            amount: req.query.amount
        }

        db.insertOne(Expense, newExpense, function (result) {
            if (result) {
                var id = result._id;
                db.updateOne(Category, { username: req.session.username, categoryName: req.query.category }, { "$inc": { amount: -req.query.amount } },
                    function (result) {
                        if (result) {
                            res.send(id);
                            //rdc.goToCategory(req, res);
                        }
                        else {
                            res.send('');
                        }
                    }
                );

            }
        });
    },

    editExpense: function (req, res) {
        db.updateOne(Expense, { _id: req.query.id }, { amount: req.query.amount }, function (result) {
            if (result) {
                res.send('edit');
            }
            else {
                res.send('');
            }
        });
    },

    deleteExpense: function (req, res) {
        db.deleteOne(Expense, { _id: req.query.id }, function (result) {
            if (result) {
                res.send('delete');
            }
            else {
                res.send('');
            }
        });
    },

    addSavings: function (req, res) {
        var newSavings = {
            username: req.session.username,
            category: 'Savings',
            description: req.query.description,
            amount: req.query.amount
        };

        db.insertOne(Expense, newSavings, function (result) {
            res.render('landing', { username: req.session.username, avatar: req.session.avatar }); //whatever savings does
        });
    },

    addIncome: function (req, res) {
        var newIncome = {
            username: req.session.username,
            description: req.query.description,
            amount: req.query.amount
        }
        console.log(newIncome);
        db.insertOne(Income, newIncome, function (result) {
            if (result) {
                res.render('./partials/income_record', newIncome, function (err, html) {
                    res.send(html);
                })
            }
            else {
                res.send('');
            }
        });
    },

    editIncome: function (req, res) {
        db.updateOne(Income, { _id: req.query.id }, { amount: req.query.amount }, function (result) {
            if (result) {
                res.send('edit');
            }
            else {
                res.send('');
            }
        });
    },

    deleteIncome: function (req, res) {
        db.deleteOne(Income, { _id: req.query.id }, function (result) {
            if (result) {
                res.send('delete');
            }
            else {
                res.send('');
            }
        });
    },

    getAvatar: function (req, res) {
        db.findOne(Avatar, { username: req.session.username }, { username: 1, face: 1, hairb: 1, outfit: 1, hairf: 1, gender: 1 }, function (result) {
            if (result == null) {
                res.send({ haircolor: 'black', face: 1, hair: 1, outfit: 1 });
            }
            else {
                res.send(result);
            }
        });
    },

    editAvatar: function (req, res) {
        db.updateOne(Avatar, { username: req.session.username }, { hairb: req.query.hairb, hairf: req.query.hairf, gender: req.query.gender, face: req.query.face, outfit: req.query.outfit }, function (result) {
            db.findOne(Avatar, { username: req.session.username }, { username: 1, face: 1, hairb: 1, outfit: 1, hairf: 1, gender: 1 }, function (result) {
                req.session.avatar = result;
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
            });
        });
    },




}

module.exports = controller;

const express = require(`express`);
const rdc = require(`../controllers/redirectController.js`);
const atc = require(`../controllers/actionController.js`);

const app = express();

//Login Verification
app.all(['/landing', '/account', '/budget', '/income', '/achievements', '/category'], atc.verifyLogin);
//navigation
app.get(`/`, rdc.goToLogin);
app.get(`/login`, rdc.goToLogin);
app.get(`/register`, rdc.goToRegister);
app.get(`/landing`, rdc.goToLanding);
app.get(`/account`, rdc.goToAccount);
app.get(`/budget`, rdc.goToBudget);
app.get(`/income`, rdc.goToIncome);
app.get(`/achievements`, rdc.goToAchievements);
app.get('/category', rdc.goToCategory);
app.get('/avatar', rdc.goToAvatar);
app.get('/savings', rdc.goToSavings);
app.get('/about', rdc.goToAbout);

//database post actions
app.post('/loginAttempt', atc.login);
app.post('/registerAccount', atc.register);
app.post('/deleteAccount', atc.deleteAccount);

app.post('/updateOneBudgetAllocation', atc.updateOneBudgetAllocation);
app.post('/updateUsername', atc.updateUsername);
app.post('/updateDisplayname', atc.updateDisplayname);
app.post('/updatePassword', atc.updatePassword);

//database get actions
app.get('/getCategoryDetails', atc.getCategoryDetails);
app.get('/getAccountDetails', atc.getAccountDetails);
app.get('/checkPassword', atc.getCheckPassword);
app.get('/searchExpenses', atc.searchExpenses);
app.get('/deleteCategory', atc.deleteCategory);

app.get('/getBudgetAllocation', atc.getBudgetAllocation);
app.get('/getCategories', atc.getCategories);
app.get('/addCategory', atc.addCategory);
app.get('/addExpense', atc.addExpense);
app.get('/addIncome', atc.addIncome);
app.get('/addCategoryExpense', atc.addCategoryExpense);

app.get('/editIncome', atc.editIncome);
app.get('/editExpense', atc.editExpense);

app.get('/deleteIncome', atc.deleteIncome);
app.get('/deleteExpense', atc.deleteExpense);

app.get('/getAvatar', atc.getAvatar);
app.get('/editAvatar', atc.editAvatar);

app.get('/editCategory', atc.editCategory);

app.get('/logOut', atc.logOut);
module.exports = app;


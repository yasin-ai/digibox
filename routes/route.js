const path = require('path');
const express = require('express')
const app = express()
const router = express.Router();

router.get('/', (req, res, next) =>{
    res.render('main')
});

router.get('/login', (req, res) =>{
    res.render('login')
})
router.get('/signup', (req, res) =>{
    res.render('signup')
})
module.exports =  router;
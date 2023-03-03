const path = require('path');
const express = require('express')
const app = express()
const router = express.Router();
const axios = require('axios')
router.get('/', (req, res, next) =>{
    res.render('main')
});

router.get('/login', (req, res) =>{
    res.render('login')
})
router.get('/signup', (req, res) =>{
    res.render('signup')
})
router.get('/candidate/:username', async (req, res) => {
    const { username } = req.query;
    try {
      const response = await axios.get(`https://digirecruitserver.azurewebsites.net/candidate/details?username=${username}`);
      const candidateData = response.data;
      console.log(candidateData)
      res.json(candidateData);
      res.render('candidate', {candidateData})
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch candidate data' });
    }
  });
  
  
module.exports =  router;
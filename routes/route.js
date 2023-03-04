const path = require('path');
const express = require('express');
const multer = require('multer');
const app = express();
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage()
});

router.get('/', (req, res, next) => {
  res.render('main');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.get(`/candidate/details`, async (req, res) => {
  const { username } = req.query;
  try {
    const response = await axios.get(`https://digirecruitserver.azurewebsites.net/candidate/details?username=${username}`);
    const candidateData = response.data;
    console.log(candidateData);
    res.render('candidate', { candidateData });
  } catch (error) {
    console.error(error);
    res.render('candidateregister', { message: 'Failed to fetch candidate data. Please register below.' });
  }
});

// handle post request to /candidate/profile
router.post('/candidate/profile', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profile', maxCount: 1 }]), async (req, res) => {
  const { name, age, username } = req.body;
  const resumeFile = req.files.resume[0];
  const profileFile = req.files.profile[0];

  try {
    const form = new FormData();
    form.append('name', name);
    form.append('age', age);
    form.append('username', username);
    form.append('resume', resumeFile.buffer, {
      filename: resumeFile.originalname,
      contentType: resumeFile.mimetype,
    });
    form.append('profile', profileFile.buffer, {
      filename: profileFile.originalname,
      contentType: profileFile.mimetype,
    });

    const response = await axios.post(`https://digirecruitserver.azurewebsites.net/candidate/details?username=${username}`, form, {
      headers: form.getHeaders(),
    });

    const candidateData = response.data;
    console.log(candidateData);
    res.redirect(`/candidate/details?username=${username}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to complete profile' });
  }
});

router.get('/recruiter', async (req, res) => {
  const { username } = req.query;
  try {
    const response = await axios.get(`https://digirecruitserver.azurewebsites.net/candidate`);
    const recruiterData = response.data;
    console.log(recruiterData);
    res.render('recruiter', { recruiterData });
  } catch (error) {
    console.error(error);
    res.render('login', { message: 'Failed to fetch recruiter data.' });
    console.log(message)
  }
});

router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.post('https://digirecruitserver.azurewebsites.net/auth/login', {
      username: username,
      password: password
    });
    const responseData = response.data;
    if (responseData.profile === 'Candidate') {
      res.redirect(`/candidate/details?username=${username}`);
    } else if (responseData.profile === 'Recruiter') {
      res.redirect(`/recruiter?username=${username}`);
    }
  } catch (error) {
    console.error(error);
    res.render('login', { message: 'Failed to login. Please check your credentials and try again.' });
  }
});

module.exports = router;

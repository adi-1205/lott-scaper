require('dotenv').config();
const express = require('express');
const crons = require('./crons/crons');
const cron = require('node-cron');

const app = express()


cron.schedule('0 */1 * * * *', () => {
crons.fetchAndStorResults()
});


module.exports = app
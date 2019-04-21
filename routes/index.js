const express = require('express')
const path = require('path')

const csvFilePath = path.join(__dirname, '../data/HourList.csv')
const csv = require('csvtojson')

const router = express.Router()

const handleData = (shifts) => {

  // Get list on unique employees id
  
  // Get working shifts for each employee

  // Calculate total daily wage for each employee

  // Calculate monthly wage for each employee

  // Optionally, calculate monthly overtime calc for each employee
}

/* GET home page. */
router.get('/', (req, res) => {
  csv()
    .fromFile(csvFilePath)
    .then(json => {
      res.render('index', {title: 'Express', data: handleData(json)})
    })
})

module.exports = router

import express from 'express'
import path from 'path'
import csv from 'csvtojson'
import {handleData} from '../utils/helpers'
import {Shift} from '../utils/helpers'

const csvFilePath = path.join(__dirname, '../../data/HourList.csv')

const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
  csv({ignoreEmpty: true})
    .fromFile(csvFilePath)
    .then((json: Array<Shift>) => {
      res.render('index', {title: 'Wage calculation', data: handleData(json)})
    })
    .catch((error: Object) => {
      res.render('error', {error})
    })
})

export default router

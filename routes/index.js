const express = require('express')
const path = require('path')
const differenceInHours = require('date-fns/difference_in_hours')
const format = require('date-fns/format')

const csvFilePath = path.join(__dirname, '../data/HourList.csv')
const csv = require('csvtojson')

const router = express.Router()

const parseTime = (timeString) => {
  const splitTime = timeString.split(':')
  const hours = splitTime[0] < 10 ? `0${splitTime[0]}` : splitTime[0]
  const minutes = splitTime[1]

  return `${hours}:${minutes}`
}

const handleData = shifts => {
  // Get list on unique employees id
  const uniqueIDs = [...new Set(shifts.map(shift => shift['Person ID']))]
  // Get working shifts for each employee
  let employeesWithShifts = {}

  uniqueIDs.forEach(id => {
    // Getting all the shifts for each employee
    const employeeShifts = shifts.filter(shift => {
      return shift['Person ID'] === id
    })

    let monthlyTotalWage = ''

    employeeShifts.map(({'Person Name': name, Date: shiftDate, Start: shiftStart, End: shiftEnd}) => {
      const splitDate = shiftDate.split('.')
      const year = splitDate[2]
      const month = splitDate[1] < 10 ? `0${splitDate[1]}` : splitDate[1]
      const day = splitDate[0] < 10 ? `0${splitDate[0]}` : splitDate[0] 

      const startTime = parseTime(shiftStart)
      const endTime = parseTime(shiftEnd)

      const startDayTime = format(`${year}-${month}-${day}T${startTime}`, 'YYYY-MM-DDTHH:mm')

      // Assume that it's the same date to be compared to startDayTime
      const endDateTime = format(`${year}-${month}-${day}T${endTime}`, 'YYYY-MM-DDTHH:mm')

      const shiftEndsNextDay = differenceInHours(endDateTime, startDayTime) < 0

      if (shiftEndsNextDay) {
        console.log('NEXT DAY', name, shiftDate)
      } else {
        console.log('SAME DAY', name, shiftDate)
      }
    })

    


    /**
     * rreturn shape:
     * 
     * [
     *  {
     *    personId: 1,
     *    pesonName: 'Name',
     *    wages: [
     *      totalWage: 1000,
     *      overtimeCompensation: 200,
     *    ]
     *  },
     * ]
     *
    */

  })

  // Calculate total daily wage for each employee

  // Calculate monthly wage for each employee

  // Optionally, calculate monthly overtime calc for each employee
}

/* GET home page. */
router.get('/', (req, res) => {
  csv({ignoreEmpty: true})
    .fromFile(csvFilePath)
    .then(json => {
      res.render('index', {title: 'Express', data: handleData(json)})
    })
})

module.exports = router

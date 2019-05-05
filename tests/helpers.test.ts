import {currencyFormatter, getOvertimeWageRate, calculateDailyWage, handleData} from '../src/utils/helpers'

describe('currency formatter', () => {
  const formattedCurrency = currencyFormatter('en-US', 'USD').format(110.34)

  test('should not be undefined', () => {
    expect(formattedCurrency).toBeDefined()
  })

  test('should return correctly formatted currency', () => {
    expect(formattedCurrency).toMatch('$110.34')
  })
})

describe('overtime wage rage', () => {
  const overtimeHours = 7.5
  const baseRate = 23.4

  test('should not be undefined', () => {
    expect(getOvertimeWageRate(overtimeHours, baseRate)).toBeDefined()
  })

  test('should it should return correct rate', () => {
    expect(getOvertimeWageRate(overtimeHours, baseRate)).toEqual(310.05)
  })
})

describe('calculate daily wage', () => {
  const endDateTime = '2014-03-04T08:30'
  const startDayTime = '2014-03-04T23:30'
  const hoursWorked = 15

  test('should not be undefined', () => {
    expect(calculateDailyWage(endDateTime, startDayTime, hoursWorked)).toBeDefined()
  })

  test('should return correct object', () => {
    expect(calculateDailyWage(endDateTime, startDayTime, hoursWorked)).toEqual({compensationForTheShift: 285.02, overtimeHours: 7})
  })
})

describe('handleData', () => {
  const shifts = [
    {
      'Person Name': 'Scott Scala',
      'Person ID': '2',
      Date: '2.3.2014',
      Start: '6:00',
      End: '14:00'
    },
    {
      'Person Name': 'Janet Java',
      'Person ID': '1',
      Date: '3.3.2014',
      Start: '9:30',
      End: '17:00'
    },
    {
      'Person Name': 'Scott Scala',
      'Person ID': '2',
      Date: '3.3.2014',
      Start: '8:15',
      End: '16:00'
    }
  ]
  const expectedData = [
    {
      employeeId: '1',
      employeeName: 'Janet Java',
      monthlyHours: 7.5,
      monthlyOvertime: 0,
      monthlyWage: '$31.88'
    },
    {
      employeeId: '2',
      employeeName: 'Scott Scala',
      monthlyHours: 15.75,
      monthlyOvertime: 0,
      monthlyWage: '$66.94'
    }
  ]
  test('should not be undefined', () => {
    expect(handleData(shifts)).toBeDefined()
  })

  test('should return correct data', () => {
    expect(handleData(shifts)).toEqual(expectedData)
  })
})

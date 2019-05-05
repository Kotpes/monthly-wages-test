"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const difference_in_hours_1 = __importDefault(require("date-fns/difference_in_hours"));
const format_1 = __importDefault(require("date-fns/format"));
const get_hours_1 = __importDefault(require("date-fns/get_hours"));
// TODO: Move helper functions into it's own file
const normalizeTime = (timeString) => {
    const splitTime = timeString.split(':');
    const hours = parseInt(splitTime[0], 10) < 10 ? `0${splitTime[0]}` : splitTime[0];
    const minutes = splitTime[1];
    return `${hours}:${minutes}`;
};
const formatter = (locale, currency) => {
    return new Intl.NumberFormat(locale, {
        currency,
        minimumFractionDigits: 2,
        style: 'currency'
    });
};
const getOvertimeWageRate = (overtimeHours, baseRate) => {
    // TODO: fix overtime rate for 3 and more time of overtime
    return overtimeHours * baseRate * 0.25;
};
const calculateDailyWage = (endDateTime, startDayTime, hoursWorked) => {
    // Calculate regular hours pay
    const startingHour = get_hours_1.default(startDayTime);
    const endingHour = get_hours_1.default(endDateTime);
    const baseRate = 4.25;
    const eveningWorkRate = baseRate + 1.25;
    let regularDailyHours = hoursWorked;
    let eveningBeforeSix = 0;
    let eveningAfterSeven = 0;
    let overtimeCompensation = 0;
    let overtimeHours = 0;
    // Overtime case
    if (hoursWorked > 8) {
        overtimeHours = hoursWorked - 8;
        overtimeCompensation = getOvertimeWageRate(overtimeHours, baseRate) * baseRate;
    }
    // Case where shift starts before 6
    if (startingHour < 6) {
        if (endingHour < 6) {
            eveningBeforeSix = endingHour - startingHour;
            regularDailyHours -= eveningBeforeSix;
        }
        else {
            eveningBeforeSix = 6 - startingHour;
            regularDailyHours -= eveningBeforeSix;
        }
    }
    // Case where shift ends afer 19
    if (endingHour > 18) {
        // Case where shift starts during evening work compensation hours
        if (startingHour > 18) {
            eveningAfterSeven = endingHour - startingHour;
            regularDailyHours -= eveningAfterSeven;
        }
        else {
            eveningAfterSeven = endingHour - 19;
            regularDailyHours -= eveningAfterSeven;
        }
    }
    const eveningHours = eveningBeforeSix + eveningAfterSeven;
    const eveningWorkCompensation = eveningHours * eveningWorkRate;
    const regularDailyWage = regularDailyHours * baseRate;
    const compensationForTheShift = regularDailyWage + eveningWorkCompensation + overtimeCompensation;
    return { compensationForTheShift, overtimeHours };
};
exports.handleData = (shifts) => {
    // Get list on unique employee id
    const uniqueIDs = [...new Set(shifts.map(shift => shift['Person ID']))];
    const employeeData = [];
    uniqueIDs.forEach(id => {
        // Getting all the shifts for each employee
        const employeeShifts = shifts.filter(shift => {
            return shift['Person ID'] === id;
        });
        const monthlyTotalWage = [];
        const monthlyTotalOvertimeHours = [];
        employeeShifts.forEach(({ Date: shiftDate, Start: shiftStart, End: shiftEnd }) => {
            const splitDate = shiftDate.split('.');
            const year = splitDate[2];
            const month = parseInt(splitDate[1], 10) < 10 ? `0${splitDate[1]}` : splitDate[1];
            const day = parseInt(splitDate[0], 10) < 10 ? `0${splitDate[0]}` : splitDate[0];
            const startTime = normalizeTime(shiftStart);
            const endTime = normalizeTime(shiftEnd);
            const startDayTime = format_1.default(`${year}-${month}-${day}T${startTime}`, 'YYYY-MM-DDTHH:mm');
            // At first, assume that it's the same date that shift ends
            let endDateTime = format_1.default(`${year}-${month}-${day}T${endTime}`, 'YYYY-MM-DDTHH:mm');
            const shiftEndsNextDay = difference_in_hours_1.default(endDateTime, startDayTime) < 0;
            if (shiftEndsNextDay) {
                // Here I assume that if it's the last day of the month, data will not contain the next day hours
                const nextDay = parseInt(day, 10) + 1;
                endDateTime = format_1.default(`${year}-${month}-${nextDay}T${endTime}`, 'YYYY-MM-DDTHH:mm');
            }
            const hoursWorked = difference_in_hours_1.default(endDateTime, startDayTime);
            const regularDailyWage = calculateDailyWage(endDateTime, startDayTime, hoursWorked);
            monthlyTotalWage.push(regularDailyWage.compensationForTheShift);
            monthlyTotalOvertimeHours.push(regularDailyWage.overtimeHours);
        });
        const monthlyWage = monthlyTotalWage.reduce((acc, cur) => acc + cur);
        const monthlyOvertime = monthlyTotalOvertimeHours.reduce((acc, cur) => acc + cur);
        employeeData.push({
            employeeId: id,
            employeeName: employeeShifts[0]['Person Name'],
            monthlyWage: formatter('en-US', 'USD').format(monthlyWage),
            monthlyOvertime
        });
    });
    //Sorting in ascending order
    employeeData.sort((a, b) => {
        return parseInt(a.employeeId, 10) - parseInt(b.employeeId, 10);
    });
    return employeeData;
};
//# sourceMappingURL=helpers.js.map
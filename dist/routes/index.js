"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const csvtojson_1 = __importDefault(require("csvtojson"));
const helpers_1 = require("../utils/helpers");
const csvFilePath = path_1.default.join(__dirname, '../../data/HourList.csv');
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (req, res) => {
    csvtojson_1.default({ ignoreEmpty: true })
        .fromFile(csvFilePath)
        .then((json) => {
        res.render('index', { title: 'Wage calculation', data: helpers_1.handleData(json) });
    })
        .catch((error) => {
        res.render('error', { error });
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map
const axios = require("axios");
var moment = require('moment')
const yahooFinance = require('yahoo-finance2').default;

module.exports.MarketInsight = async (req, res) => {
    try {

        let { keyword } = req.body
        var setter = ''
        if (keyword == 'Technology') {
            setter = 'IBM'
        }
        if (keyword == 'SMEs') {
            setter = 'KNSL'
        }
        if (keyword == 'R&D') {
            setter = 'AMZN'
        }
        if (keyword == 'Robotics') {
            setter = 'IRBT'
        }
        if (keyword == 'Aviation') {
            setter = 'BA'
        }
        if (keyword == 'Education') {
            setter = 'LRN'
        }
        if (keyword == 'General Trading') {
            setter = 'SPY'
        }
        if (keyword == 'Retail') {
            setter = 'WMT'
        }
        if (keyword == 'Industrial') {
            setter = 'GE'
        }
        if (keyword == 'Travel & Tourism') {
            setter = 'EXPE'
        }
        if (keyword == 'Medical Care') {
            setter = 'JNJ'
        }
        if (keyword == 'Artificial Intelligence') {
            setter = 'NVDA'
        }
        if (keyword == 'Agriculture') {
            setter = 'DE'
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 5);  // Set to 5 years ago

        var results = await yahooFinance.historical(setter, {
            period1: startDate.toISOString().split('T')[0],  // Start date in 'YYYY-MM-DD' format
            period2: endDate.toISOString().split('T')[0],    // End date in 'YYYY-MM-DD' format
        });
        const yearlyData = aggregateDataByYear(results);
        return res.send({
            result:true,
            message:"data retrieved",
            data:yearlyData
        })

    } catch (error) {
        console.log(error);
        
        return res.send({
            result: false,
            message: error.message
        })
    }
}

function aggregateDataByYear(data) {
    const aggregatedData = {};

    data.forEach(entry => {
        const year = new Date(entry.date).getFullYear();
        if (!aggregatedData[year]) {
            aggregatedData[year] = {
                year: year,
                open: entry.open,
                close: entry.close,
                high: entry.high,
                low: entry.low,
                volume: entry.volume
            };
        } else {
            aggregatedData[year].close = entry.close; // Last close of the year
            aggregatedData[year].high = Math.max(aggregatedData[year].high, entry.high); // Highest price of the year
            aggregatedData[year].low = Math.min(aggregatedData[year].low, entry.low); // Lowest price of the year
            aggregatedData[year].volume += entry.volume; // Sum of volume for the year
        }
    });

    // Convert aggregatedData object to an array for easier processing
    return Object.values(aggregatedData);
}
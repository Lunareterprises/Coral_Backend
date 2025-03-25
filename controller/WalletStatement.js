var model = require('../model/UserContractList')
let userModel = require('../model/users')
const fs = require('fs')
const path = require('path');
const exceljs = require('exceljs');


module.exports.downloadStatement = async (req, res) => {
    try {
        var { user_id } = req.headers
        var { type, monthsAgo } = req.body
        if (!type || !monthsAgo) {
            return res.send({
                result: false,
                message: "Fields is required"
            })
        }
        if (type && type !== 'all' && type !== "invest" && type !== "withdraw" && type !== "fixed" && type !== "flexible") {
            return res.send({
                result: false,
                message: "Invalid type"
            })
        }
        if (!user_id) {
            return res.send({
                result: false,
                message: "User ID is required"
            })
        }
        let contracts = []
        if (type === 'all' || !type) {
            let contractsData = await model.GetUserContractList(user_id)
            let withdrawData = await model.GetUserWithdraw(user_id)
            contracts = [...contractsData, ...withdrawData].sort((a, b) => {
                const dateA = new Date(a.ui_date || a.wr_date); // Use ui_date if available, otherwise use wr_date
                const dateB = new Date(b.ui_date || b.wr_date);

                return dateB - dateA; // Sort in ascending order
            });
        } else if (type === 'invest') {
            let contractsData = await model.GetUserContractList(user_id)
            contracts = contractsData.sort((a, b) => b.ui_date - a.ui_date)
        } else if (type === 'withdraw') {
            let withdrawData = await model.GetUserWithdraw(user_id)
            contracts = withdrawData.sort((a, b) => b.wr_date - a.wr_date);
        } else if (type === 'fixed') {
            let contractsData = await model.GetUserContractList(user_id)
            contracts = contractsData.sort((a, b) => b.ui_date - a.ui_date).filter(contract => contract.ui_type.toLowerCase() === 'fixed');
        } else if (type === 'flexible') {
            let contractsData = await model.GetUserContractList(user_id)
            contracts = contractsData.sort((a, b) => b.ui_date - a.ui_date).filter(contract => contract.ui_type.toLowerCase() === 'flexible')
        } else {
            return res.send({
                result: false,
                message: "Invalid type"
            })
        }
        if (contracts.length > 0) {
            let currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - monthsAgo); // Subtract months

            // Format the currentDate to be comparable (in UTC format)
            let filterDate = currentDate.toISOString();
            let filteredData = contracts.filter((el) => {
                // Check if it's a withdrawal (wr_* fields)
                if (el.wr_id) {
                    return new Date(el.wr_date) >= new Date(filterDate);
                }
                // Check if it's an investment (ui_* fields)
                else if (el.ui_id) {
                    return new Date(el.ui_date) >= new Date(filterDate);
                }
                return false; // Return false if it's neither
            });
            let user = await userModel.getUser(user_id)
            const dirname = path.join(__dirname, '../uploads/statements'); // Corrected path
            const timestamp = Date.now(); // Get the current timestamp
            const outputFilePath = path.join(dirname, `wallet_statement_user_${user[0].u_name}_${timestamp}.xlsx`); // Full file path

            // Ensure the folder exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true }); // Create directories recursively
            }

            // Create a new workbook and add a worksheet
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Wallet Statement ${user[0].u_name}`);

            // Add headings and format the first section (similar to 'Withdraw Request' in previous code)
            let headingRow1 = worksheet.addRow(['Wallet Statement']);
            worksheet.mergeCells('A1:D1');
            headingRow1.getCell(1).font = { bold: true, size: 16, name: 'Liberation Serif' };
            headingRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            let headingRow2 = worksheet.addRow(["SL NO.", "CONTRACT NAME", "AMOUNT", "STATUS", "DATE"]);
            headingRow2.getCell(1).font = { bold: true, size: 14, name: 'Liberation Serif' };
            headingRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.addRow([]); // Empty row for spacing

            worksheet.columns = [
                { key: 'sl_no', width: 15 },
                { key: 'type', width: 15 },
                { key: 'amount', width: 15 },
                { key: 'status', width: 15 },
                { key: 'date', width: 15 },
            ];

            // Add data rows to the worksheet
            filteredData.forEach((el, index) => {
                if (el.wr_id) {
                    // Add withdraw data to the worksheet
                    worksheet.addRow([
                        index + 1, // Serial Number
                        'Withdraw', // Type
                        el.wr_amount, // Amount
                        el.wr_status, // Status
                        el.wr_date,   // Date
                    ]);
                } else if (el.ui_id) {
                    // Add investment data to the worksheet
                    worksheet.addRow([
                        index + 1, // Serial Number
                        'Invest', // Type
                        el.ui_amount, // Amount
                        el.ui_status, // Status
                        el.ui_date,   // Date
                    ]);
                }
            });
            // Write the workbook to the file
            workbook.xlsx.writeFile(outputFilePath)
            return res.send({
                result: true,
                message: "data retrieved",
                file: req.protocol + "://" + req.get("host") + outputFilePath.replace(process.cwd(), '')
            })
        } else {
            return res.send({
                result: false,
                message: "No data found"
            })
        }
    } catch (error) {
        return res.send({
            result: false,
            message: error.message
        })
    }
}
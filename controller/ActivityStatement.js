var walletModel = require('../model/wallettransaction')
var contractModel = require('../model/UserContractList')
var transferModel = require('../model/contracttransfer')
var referralModel = require('../model/referralBonus')
var userModel = require('../model/users')
const fs = require('fs')
const path = require('path');
const exceljs = require('exceljs');

module.exports.downloadStatement = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({ result: false, message: "User id not found" })
        }
        let { monthsAgo } = req.query
        if (!monthsAgo) {
            monthsAgo = 0
        }
        let { type } = req.body
        if (!type) {
            return res.send({ result: false, message: "Type is required" })
        }
        let data = []
        if (type === "all") {
            let walletData = await walletModel.Getwallet(user_id)
            let contractsData = await contractModel.GetUserContractList(user_id)
            let withdrawData = await contractModel.GetUserWithdraw(user_id)
            let transferData = await transferModel.getInvestedData(user_id)
            let refferalData = await referralModel.getReferralBonus(user_id)
            data = [...contractsData, ...withdrawData, ...walletData, ...transferData, ...refferalData].sort((a, b) => {
                const dateA = new Date(a.ui_date || a.wr_date || a.w_date || a.date || 0);
                const dateB = new Date(b.ui_date || b.wr_date || b.w_date || b.date || 0);
                return dateB - dateA;
            });
        } else if (type === "profit") {
            let contractsData = await contractModel.GetUserContractList(user_id)
            data = contractsData.sort((a, b) => {
                const dateA = new Date(a.ui_date || a.wr_date || a.w_date || 0);
                const dateB = new Date(b.ui_date || b.wr_date || b.w_date || 0);
                return dateB - dateA;
            })
        } else if (type === "withdraw") {
            let withdrawData = await contractModel.GetUserWithdraw(user_id)
            data = withdrawData.sort((a, b) => {
                const dateA = new Date(a.ui_date || a.wr_date || a.w_date || 0);
                const dateB = new Date(b.ui_date || b.wr_date || b.w_date || 0);
                return dateB - dateA;
            })
        } else if (type === "transfer") {
            let transferData = await transferModel.getInvestedData(user_id)
            data = transferData
                .filter(el => el.ui_status === "requestedForTransfer" || el.ui_status === "transfered")
                .sort((a, b) => {
                    const dateA = new Date(a.ui_date || a.wr_date || a.w_date || 0);
                    const dateB = new Date(b.ui_date || b.wr_date || b.w_date || 0);
                    return dateB - dateA;
                });

        } else if (type === "termination") {
            let transferData = await transferModel.getInvestedData(user_id)
            data = transferData
                .filter(el => el.ui_status === "terminated" || el.ui_status === "requestedForTermination")
                .sort((a, b) => {
                    const dateA = new Date(a.ui_date || a.wr_date || a.w_date || 0);
                    const dateB = new Date(b.ui_date || b.wr_date || b.w_date || 0);
                    return dateB - dateA;
                });
        } else if (type === "referral") {
            let refferalData = await referralModel.getReferralBonus(user_id)
            data = refferalData.sort((a, b) => {
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                return dateB - dateA;
            })
        } else {
            res.send({ result: false, message: "Invalid type" })
        }
        if (data.length > 0) {
            let currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - monthsAgo); // Subtract months

            // Format the currentDate to be comparable (in UTC format)
            let filterDate = currentDate.toISOString();
            let filteredData = data.filter((el) => {
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
            const outputFilePath = path.join(dirname, `activity_statement_user_${user[0].u_name}_${timestamp}.xlsx`); // Full file path

            // Ensure the folder exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true }); // Create directories recursively
            }

            // Create a new workbook and add a worksheet
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Activity Statement ${user[0].u_name}`);

            // Add headings and format the first section (similar to 'Withdraw Request' in previous code)
            let headingRow1 = worksheet.addRow(['Activity Statement']);
            worksheet.mergeCells('A1:E1');
            headingRow1.getCell(1).font = { bold: true, size: 16, name: 'Liberation Serif' };
            headingRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            let headingRow2 = worksheet.addRow(["SL NO.", "TYPE", "AMOUNT", "STATUS", "DATE"]);
            headingRow2.getCell(1).font = { bold: true, size: 14, name: 'Liberation Serif' };
            headingRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.addRow([]); // Empty row for spacing

            worksheet.columns = [
                { key: 'sl_no', width: 7 },
                { key: 'type', width: 15 },
                { key: 'amount', width: 24 },
                { key: 'status', width: 15 },
                { key: 'date', width: 21 },
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
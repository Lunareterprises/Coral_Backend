var model = require('../model/profitStatement')
const fs = require('fs')
const path = require('path');
const exceljs = require('exceljs');

module.exports.downloadStatement = async (req, res) => {
    try {
        let { user_id } = req.headers
        if (!user_id) {
            return res.send({
                result: false,
                message: "user id is required"
            })
        }
        let { monthsAgo } = req.query
        let data = await model.getProfitStatement(user_id, monthsAgo)
        if (data.length > 0) {
            let user=await model.getUser(user_id)
            const dirname = path.join(__dirname, '../uploads/statements'); // Corrected path
            const timestamp = Date.now(); // Get the current timestamp
            const outputFilePath = path.join(dirname, `profit_statement_user_${user[0].u_name}_${timestamp}.xlsx`); // Full file path

            // Ensure the folder exists
            if (!fs.existsSync(dirname)) {
                fs.mkdirSync(dirname, { recursive: true }); // Create directories recursively
            }

            // Create a new workbook and add a worksheet
            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet(`Profit Statement ${user[0].u_name}`);

            // Add headings and format the first section (similar to 'Withdraw Request' in previous code)
            let headingRow1 = worksheet.addRow(['Profit Statement']);
            worksheet.mergeCells('A1:J1');
            headingRow1.getCell(1).font = { bold: true, size: 16, name: 'Liberation Serif' };
            headingRow1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            let headingRow2 = worksheet.addRow(["SL NO.", "INVESTED DATE", "INVESTED DURATION", "INVESTED AMOUNT", "INVESTED PERCENTAGE", "INVESTED RETURN", "INVESTED TYPE", "INVESTED STATUS", "INVESTED SECURITY","INVESTED PROJECT"]);
            headingRow2.getCell(1).font = { bold: true, size: 14, name: 'Liberation Serif' };
            headingRow2.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };

            worksheet.addRow([]); // Empty row for spacing

            worksheet.columns = [
                { key: 'sl_no', width: 7 },
                { key: 'ui_date', width: 21 },
                { key: 'ui_duration', width: 18 },
                { key: 'ui_amount', width: 24 },
                { key: 'ui_percentage', width: 24 },
                { key: 'ui_return', width: 13 },
                { key: 'ui_type', width: 13 },
                { key: 'ui_status', width: 13 },
                { key: 'ui_security_option', width: 13 },
                { key: 'ui_project_name', width: 13 },

            ];

            // Add data rows to the worksheet
            data.forEach((el,index) => {
                worksheet.addRow([
                    index + 1,
                    el.ui_date,
                    el.ui_duration,
                    el.ui_amount,
                    el.ui_percentage,
                    el.ui_return,
                    el.ui_type,
                    el.ui_status,
                    el.ui_security_option,
                    el.ui_project_name
                ]);
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
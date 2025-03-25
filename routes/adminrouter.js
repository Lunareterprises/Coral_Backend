var express = require('express')
var route = express.Router();
var { verifyToken } = require('../componets/jwt')

route.post('/add/top-company', verifyToken, require('../controller/addtopcompany').AddTopCompany)

route.post('/list/top-company', verifyToken, require('../controller/listtopcompany').ListTopcompany)

route.post('/deletesection', verifyToken, require('../controller/admindeletesection').AdminDeleteSection)

route.post('/login', require('../controller/adminlogin').AdminLogin)

route.post('/subadmin-list', verifyToken, require('../controller/adminlist').AdminList)

route.post('/add/subadmin', verifyToken, require('../controller/addsubadmin').AddSubAdmin)

route.post('/edit/subadmin', verifyToken, require('../controller/editsubadmin').EditSubAdmin)

route.post('/list/contracts', verifyToken, require('../controller/adContractList').ContractList)

route.post('/list/withdraw_request', verifyToken, require('../controller/adWithdrawList').WithdrawRequestList)

route.post('/list/investers', verifyToken, require('../controller/adInvesterList').InvestersList)

route.post('/list/investers-bank', verifyToken, require('../controller/adInvesterbankdetails').InvesterBankDetails)

// route.post('/list/wallet', verifyToken, require('../controller/adwalletlist').WalletList)


module.exports = route
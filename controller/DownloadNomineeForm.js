



module.exports.DownloadNomineeForm = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);

        return res.send({
            result: false,
            message: error.message
        })
    }
}
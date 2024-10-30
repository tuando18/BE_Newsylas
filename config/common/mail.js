var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "tuandvph31763@fpt.edu.vn",
        pass: "tuan123"
    }
});
module.exports = transporter 
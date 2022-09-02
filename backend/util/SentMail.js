const nodemailer = require("nodemailer");
const config = require("../config/config");
const env = process.env.NODE_ENV || "development";

// if this does not work replace line 11-14 with below 3 line and check
// host: "smtp.office365.com",
// secureConnection: true,
// port: 587,

// var transporter = nodemailer.createTransport({
//   // service: 'Godaddy',
//   host: "smtpout.secureserver.net",
//   secureConnection: true,
//   port: 465,

//   auth: {
//     user: config[env].mailId,
//     pass: config[env].mailPassword
//   },
//   // tls: { rejectUnauthorized: false }
// });

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config[env].mailId,
    pass: config[env].mailPassword,
  },
});

var mailOptions = {
  from: "youremail@gmail.com",
  to: "myfriend@yahoo.com",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

const sentMail = async (mailOptions) => {
  mailOptions = {
    ...mailOptions,
    from: config[env].mailId,
  };
  try {
    // console.log("Email mailOptions: " + mailOptions);
    var response = await transporter.sendMail(mailOptions);
    // console.log("Email sent: " + response);
    return { status: 200, message: "Mail sent" };
  } catch (error) {
    if (error) {
      console.log(error);
      return { status: 500, message: "Error!!!" };
    }
  }
};

module.exports = {
  sentMail,
};

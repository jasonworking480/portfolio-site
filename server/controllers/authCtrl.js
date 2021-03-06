require('dotenv').config();
const nodemailer = require("nodemailer")

function main(email, full_name) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jasonsportfoliosite@gmail.com",
      pass: "nhbnhbnhb1312",
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  const mailOptions = {
    from: "Jason",
    to: email,
    subject: "Thank you from Jason",
    text: "Thank you for taking a look at my portfolio",
    html: `<!DOCTYPE html>
    <!-- PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> -->
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Jasons Portfolio site</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin: 0; padding: 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%"> 
        <p>Hey ${full_name},  </p>
        <p>I just wanted to say thank you for viewing my portfolio site.  If you have any questions for me or would like to set up a meeting feel free to respond to this email.</p>
        <p>My resume can be found at <a href="https://docs.google.com/document/d/1vjiSuzBqHXKnctNhwCjmns3WZHL5LWyK_yoOL-ghCdc/edit?usp=sharing">My Resume</a></p>
        <p>My GitHub can be found at <a href="https://github.com/jtown970">My GitHub</a></p>
    </body>
    </html>`,
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
    } else {
      console.log("email sent:" + info.response)
    }
  })
}

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db')
    const {full_name, email} = req.body

    const existingUser = await db.check_user(email)
    if (existingUser[0]) {
      return res.status(409).send("user already exists")
    }

    const [newUser] = await db.register_user([full_name, email])
    req.session.user = [newUser]
    res.status(200).send(req.session.user)
    main(email, full_name)

  },
  login: async (req, res) => {
    const db = req.app.get('db')
    const {email} = req.body

    const existingUser = await db.check_user(email)

    if (!existingUser[0]) {
      return res.status(404).send("user does not exist")
    }

    req.session.user = existingUser[0]
    res.status(200).send(req.session.user)

  },
  updateInfo: async (req, res) => {},
  logout: async (req, res) => {
    req.session.destroy()
    res.sendStatus(200)
  },
  getUser: async (req, res) => {
    if (req.session.user) {
      res.status(200).send(req.session.user)
    } else {
      res.sendStatus(404)
    }
  },
}
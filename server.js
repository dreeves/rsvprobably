var express = require('express')
var app = express()
var Mailgun = require('mailgun-js')

function mailself(subj, body) {
  var mailgun = new Mailgun({apiKey: process.env.MAILGUN_KEY, 
                             domain: process.env.MAILGUN_DOMAIN})
  var data = {
    from:    process.env.MAILGUN_FROM,
    to:      process.env.MY_EMAIL,
    subject: subj,
    text:    body,
  }
  mailgun.messages().send(data, (err, body) => {
    //console.log("sent: " + JSON.stringify(body))
    //if (err) {
    //  response.render('error', { error: err })
    //  console.log("error1422: ", err)
    //} else {
    //  console.log("sent: " + body)
    //}
  })
}

app.use(express.static('public'))

app.get("/", (req, resp) => {
  resp.sendFile(__dirname + '/views/index.html')
})

app.get("/favthings", (req, resp) => {
  resp.send(favthings)
})

// could also use the POST body instead of query string: 
// http://expressjs.com/en/api.html#req.body
app.post("/favthings", (req, resp) => {
  favthings.push(req.query.favthing)
  mailself('RSVP', req.query.favthing)
  resp.sendStatus(200)
})

var favthings = [
]

var listener = app.listen(process.env.PORT, () => {
  console.log('RSVP app is running on port ' + listener.address().port)
})
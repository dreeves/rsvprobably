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

var listener = app.listen(process.env.PORT, () => {
  console.log('RSVP app is running on port ' + listener.address().port)
})

var favthings = []

/* Case studies:
SSC meetup on 2017-05-07:
RSVPs predicted 9.05 to 12.7 people.
Actual was 13 people at the peak but one person arrived not too much before the first 
person left. If we count everyone's attendance fractionally then the total attendance
was 10.3 people.
["danny is hosting and definitely will be there",
"bee is schlepping kids around and won't be",
"echo is probable",
"sam is definite",
"eric is unlikely",
"isaac is 90%",
"jeff is probable",
"jennifer is out of town",
"kelley is very probable",
"matthew is unlikely",
"andrew is likely-ish",
"noah is very likely",
"dennis & fionna are maybes",
"hugh is very likely",
"joe is definite",
"john is probable",]
*/
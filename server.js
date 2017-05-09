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

app.use(express.static('pub'))

app.get("/rsvps", (req, resp) => {
  resp.send(rsvps)
})

// could also use the POST body instead of query string: 
// http://expressjs.com/en/api.html#req.body
app.post("/rsvps", (req, resp) => {
  rsvps.push(req.query.rsvp)
  mailself('RSVP', req.query.rsvp)
  resp.sendStatus(200)
})

var listener = app.listen(process.env.PORT, () => {
  console.log('RSVP app is running on port ' + listener.address().port)
})

var rsvps = [
  "Danny is definitely coming",
  "Bee will be there with beels on",
]

/* Case studies:
["danny is hosting and definitely will be there", // 1
"bee is schlepping kids around and won't be", // 0
"echo is probable", // 12:46
"sam is definite", // 12:34
"eric is unlikely", // cookies? lawyer?
"isaac is 90%", // 1
"jeff is probable", // 13:28
"jennifer is out of town", // 0
"kelley is very probable", // 0
"matthew is unlikely", // 0
"andrew is likely-ish", // 0
"noah is very likely", // 1
"dennis & fionna are maybes", // 2
"hugh is very likely", // cookies? lawyer?
"joe is definite", // 12:43
"john is probable",] // 12:49
*/
const express = require('express')
const app = express()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function mailself(subj, body) {
  sgMail.send({
    to: 'dreev.es@gmail.com',
    from: 'bot@dreev.es',
    subject: subj,
    text: body,
    //html: 'optional <i>html</i> version',    
  }).then(() => {
    console.log(`Email sent w/ subject: ${subj}`)
  })
  .catch((error) => {
    console.error(error)
  })
}

function shn(x) {
  return Math.round(10*x)/10
}

app.use(express.static('pub'))

app.get("/rsvps", (req, resp) => { resp.send(rsvps.map(l => l[0])) })

app.get("/min", (req, resp) => { resp.send(shn(rsvps.reduce((acc,x) => acc+x[1], 0))) })
app.get("/max", (req, resp) => { resp.send(shn(rsvps.reduce((acc,x) => acc+x[2], 0))) })

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
  ["Curtis (>50%)", .5, .9],
  ["Echo (65%)", .65, .65],
  ["Jennifer (<10%)", 0, .1],
  ["Sam (75%)", .75, .75],
  ["Isaac (>90%)", .9, 1],
  ["Martin (1%)", .01, .01],
]

/*
{1,1}+{.9,1}+{0,.1}*(4/5*0+1)+{.8,.8}+{.5,.9}+{0,0}+{0,0}
(* Fractional attendance given arrival time, assuming a 12:30-15:00 event *)
f[h_, m_] := Clip[((15+0/60) - (h+m/60)) /
                  ((15+0/60) - (12-30/60)), {0, 1}]
*/

/* Case studies:
"danny is hosting and definitely will be there", // 1
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
"john is probable", // 12:49

"Danny is definitely coming (a)", // 1
"Bee will be there with beels on (a)", // 1
"Caitlin is now unlikely (d)", // 0
"Echo = B+ (80%)", // 1
"Matthew = B! (>50%)", // 0
"Lillian = no, cuz 7pm is real late for her!", // 0
"Ian = no, cuz he's in Seattle", // 0

2017 June 10 SSC meetup:
  ["Danny = a", 1, 1],
  ["Sam is quite likely coming! (>80% chance)", .8, .9],
  ["Kelley = b", .5, .9],
  ["1% chance i (John swanson) will make it as we have a trip to Alaska planned", .01, .01],
  ["Noah is coming. >80%", .8, .9],
  ["A mystery person will probably be there unless something horrible happens. Will be leaving a bit early, though.", .5, .9],
  ["Echo is maybe probably coming (60%)", .6, .6],
  ["(a) for Curtis", .9, 1],
  ["Isaac: 90%", .9, .9],

*/
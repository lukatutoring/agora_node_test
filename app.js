const express = require('express');
const https = require("https");
const cors = require("cors");
require("dotenv").config();
const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')
const customerKey = process.env.customerKey;
const customerSecret = process.env.customerSecret;
const plainCredential = customerKey + ":" + customerSecret
encodedCredential = Buffer.from(plainCredential).toString('base64')
authorizationField = "Basic " + encodedCredential


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


const port = process.env.PORT || 4000;

const options = {
  hostname: 'api.agora.io',
  port: 443,
  path: '/dev/v1/projects',
  method: 'GET',
  headers: {
    'Authorization':authorizationField,
    'Content-Type': 'application/json'
  }
}

app.get('/', (req, res) => {
  res.send("heelo")
});


app.post('/api/v1/channel',(req,res) => {
  const { channelName } = req.body;
  const appId = process.env.appId;
  const appCertificate = process.env.appCertificate;
  const uid = 0;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
  // Build token with uid
  const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
  // res.send("Token with integer number Uid: " + tokenA)

  const response = {
    channelToken : tokenA
  }
  res.status(200).send(response)
})

app.listen(port, () => {
  console.log(`server is listening at localhost:4000`);
});
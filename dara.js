const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();


app.use(bodyParser.json());

// Replace with your actual Daraja API credentials
const consumerKey = 'KpS9enJHHoWV939vtXQ1HYgmpu4xG2zf';
const consumerSecret = 'Y2Rdte8gTXudF9pek';
const baseUrl = 'https://sandbox.safaricom.co.ke';

// Generate an access token for authentication
const generateAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  try {
    const response = await axios.get(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    return response.data.access_token;
  } catch (error) {
    throw error;
  }
};

// Initiate a C2B payment
app.post('/c2b/payment', async (req, res) => {
  try {
    const accessToken = await generateAccessToken();
    
    const { MSISDN, amount, reference } = req.body;
    const transactionId = `T${Math.floor(Math.random() * 1000000000)}`;
    
    const response = await axios.post(`${baseUrl}/mpesa/c2b/v1/simulate`, {
      ShortCode: '174379',
      CommandID: 'CustomerPayBillOnline',
      Amount: '100',
      Msisdn: '254708374149',
      BillRefNumber: 'TestApi'
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json({ transactionId, message: 'C2B payment initiated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.get('/', (req, res) => {
    res.send("Server is running");
  });

app.listen(3000, (err, live) => {
    if(err){
        console.error(err)
    }
    console.log("server running")
});

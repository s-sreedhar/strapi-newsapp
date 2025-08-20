// Test script for email-news API
// This demonstrates how to use the /api/email-news/send-email endpoint

const axios = require('axios');

// Configuration
const STRAPI_URL = 'http://localhost:1337';
const API_ENDPOINT = '/api/email-news/send-email';

// Test email data
const emailData = {
  to: 'test@example.com', // Replace with your test email
  subject: 'Test Email from Strapi + Brevo',
  htmlContent: `
    <html>
      <head>
        <title>Test Email</title>
      </head>
      <body>
        <h1>Hello from Strapi!</h1>
        <p>This is a test email sent using the email-news API with Brevo integration.</p>
        <p>If you receive this email, the integration is working correctly!</p>
        <br>
        <p>Best regards,<br>Your Strapi Application</p>
      </body>
    </html>
  `
};

async function testEmailAPI() {
  try {
    console.log('Testing email-news API...');
    console.log('Endpoint:', `${STRAPI_URL}${API_ENDPOINT}`);
    console.log('Email data:', {
      to: emailData.to,
      subject: emailData.subject,
      htmlContent: emailData.htmlContent.substring(0, 100) + '...'
    });

    const response = await axios.post(`${STRAPI_URL}${API_ENDPOINT}`, emailData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Error!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Instructions
console.log('='.repeat(60));
console.log('EMAIL-NEWS API TEST SCRIPT');
console.log('='.repeat(60));
console.log('\nTo test the email-news API:');
console.log('1. Make sure your Strapi server is running (npm run develop)');
console.log('2. Update the "to" email address in this script');
console.log('3. Run: node test-email-news.js');
console.log('\nAPI Endpoint: POST /api/email-news/send-email');
console.log('Required fields: to, subject, htmlContent');
console.log('\nExample usage:');
console.log(JSON.stringify({
  to: 'recipient@example.com',
  subject: 'Your Subject',
  htmlContent: '<h1>Your HTML content</h1>'
}, null, 2));
console.log('\n' + '='.repeat(60));

// Uncomment the line below to actually send the test email
// testEmailAPI();

module.exports = { testEmailAPI, emailData };
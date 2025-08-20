# Email-News API Documentation

This document describes the email-news API implementation following the [Strapi + Brevo newsletter tutorial](https://strapi.io/blog/how-to-build-a-newsletter-with-nextjs-strapi-and-brevo).

## Overview

The email-news API provides a simple endpoint to send emails using Brevo (formerly Sendinblue) email service. This implementation follows the exact pattern described in the Strapi documentation.

## API Structure

```
src/api/email-news/
├── controllers/
│   └── email-news.js     # Controller with send method
├── services/
│   └── email-news.js     # Service with Brevo integration
└── routes/
    └── email-news.js     # Routes configuration
```

## Configuration

### Environment Variables

The following environment variables are required in your `.env` file:

```env
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_EMAIL=your-verified-sender-email@domain.com
BREVO_SENDER_NAME=Your Business Name
```

### Dependencies

The API uses the `@getbrevo/brevo` package (modern replacement for deprecated `sib-api-v3-sdk`):

```bash
npm install @getbrevo/brevo
```

## API Endpoint

### Send Email

**Endpoint:** `POST /api/email-news/send-email`

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Your Email Subject",
  "htmlContent": "<h1>Your HTML content</h1><p>Email body content...</p>"
}
```

**Response (Success):**
```json
{
  "message": "Email sent successfully"
}
```

**Response (Error):**
```json
{
  "error": "Failed to send email",
  "details": "Error message details"
}
```

## Usage Examples

### Using cURL

```bash
curl -X POST http://localhost:1337/api/email-news/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "htmlContent": "<h1>Hello!</h1><p>This is a test email.</p>"
  }'
```

### Using JavaScript/Axios

```javascript
const axios = require('axios');

const emailData = {
  to: 'recipient@example.com',
  subject: 'Newsletter Update',
  htmlContent: `
    <html>
      <body>
        <h1>Newsletter Title</h1>
        <p>Your newsletter content here...</p>
      </body>
    </html>
  `
};

try {
  const response = await axios.post(
    'http://localhost:1337/api/email-news/send-email',
    emailData
  );
  console.log('Email sent:', response.data);
} catch (error) {
  console.error('Error:', error.response.data);
}
```

### Using Fetch API

```javascript
const emailData = {
  to: 'recipient@example.com',
  subject: 'Newsletter Update',
  htmlContent: '<h1>Hello!</h1><p>Newsletter content...</p>'
};

fetch('http://localhost:1337/api/email-news/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(emailData)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## Implementation Details

### Service Layer (`services/email-news.js`)

The service handles the Brevo API integration:

- Initializes Brevo TransactionalEmailsApi
- Configures API key authentication
- Sends emails using SendSmtpEmail object
- Handles errors and logging

### Controller Layer (`controllers/email-news.js`)

The controller handles HTTP requests:

- Validates required fields (to, subject, htmlContent)
- Calls the email service
- Returns appropriate HTTP responses
- Handles error cases

### Routes Layer (`routes/email-news.js`)

Defines the API endpoint:

- POST `/send-email` route
- Maps to `email-news.send` controller method
- No authentication policies (can be added if needed)

## Testing

A test script is provided (`test-email-news.js`) to verify the API functionality:

```bash
# Update the email address in test-email-news.js
# Then run:
node test-email-news.js
```

## Security Considerations

1. **API Key Protection:** Never commit your Brevo API key to version control
2. **Input Validation:** The API validates required fields
3. **Rate Limiting:** Consider adding rate limiting for production use
4. **Authentication:** Add authentication policies if needed

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify BREVO_API_KEY in .env file
   - Ensure API key has transactional email permissions

2. **"Sender Email Not Verified" Error**
   - Verify sender email in Brevo dashboard
   - Check BREVO_SENDER_EMAIL configuration

3. **"Missing required fields" Error**
   - Ensure all required fields are provided: to, subject, htmlContent

4. **Network/Connection Errors**
   - Check internet connection
   - Verify Brevo service status

### Debug Mode

Enable debug logging by checking the Strapi console output when sending emails.

## Integration with Existing Newsletter System

This email-news API can work alongside your existing newsletter system:

- Use `/api/newsletters/:id/send` for full newsletter campaigns
- Use `/api/email-news/send-email` for individual email sending
- Both use the same Brevo configuration and service

## Next Steps

1. Add authentication policies if needed
2. Implement email templates
3. Add email tracking and analytics
4. Set up email scheduling
5. Add bulk email sending capabilities

## References

- [Original Strapi + Brevo Tutorial](https://strapi.io/blog/how-to-build-a-newsletter-with-nextjs-strapi-and-brevo)
- [Brevo API Documentation](https://developers.brevo.com/)
- [Strapi API Documentation](https://docs.strapi.io/)
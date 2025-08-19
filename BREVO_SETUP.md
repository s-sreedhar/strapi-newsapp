# Brevo Email Integration Setup Guide

This guide will help you set up Brevo (formerly Sendinblue) email integration for sending newsletters from your Strapi backend.

## Prerequisites

1. A Brevo account (sign up at https://www.brevo.com/)
2. Your Strapi application running
3. Node.js and npm installed

## Step 1: Get Brevo API Key

1. Log in to your Brevo account
2. Go to **Settings** → **API Keys**
3. Create a new API key with **SMTP** permissions
4. Copy the API key (you'll need it for the next step)

## Step 2: Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add the following variables:

```env
# Brevo API Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_SENDER_EMAIL=your_sender_email@domain.com
BREVO_SENDER_NAME=Your Newsletter Name

# Strapi Configuration (if not already set)
HOST=0.0.0.0
PORT=8080
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt_here
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
JWT_SECRET=your_jwt_secret_here
```

**Important Notes:**
- Replace `your_brevo_api_key_here` with your actual Brevo API key
- Replace `your_sender_email@domain.com` with a verified sender email in your Brevo account
- Replace `Your Newsletter Name` with your desired sender name

## Step 3: Verify Sender Email in Brevo

1. In your Brevo account, go to **Settings** → **Senders & IP**
2. Add and verify your sender email address
3. Wait for the verification email and click the verification link

## Step 4: Install Dependencies

The Brevo SDK has already been installed. If you need to reinstall:

```bash
npm install @getbrevo/brevo
```

## Step 5: Restart Your Strapi Application

```bash
npm run develop
```

## Step 6: Test the Integration

### Using the API Endpoints

1. **Send a test newsletter:**
   ```bash
   POST /api/newsletters/{newsletter_id}/send-test
   Content-Type: application/json
   
   {
     "testEmail": "your-test-email@example.com"
   }
   ```

2. **Send newsletter to all subscribers:**
   ```bash
   POST /api/newsletters/{newsletter_id}/send
   ```

3. **Get newsletter statistics:**
   ```bash
   GET /api/newsletters/{newsletter_id}/stats
   ```

### Using Strapi Admin Panel

1. Create a newsletter in the Strapi admin panel
2. Add subscribers to the newsletter-subscription collection
3. Use the custom API endpoints to send newsletters

## API Endpoints

### Send Newsletter to All Subscribers
- **URL:** `POST /api/newsletters/:id/send`
- **Description:** Sends the newsletter to all active subscribers
- **Response:** Returns success/failure statistics

### Send Test Newsletter
- **URL:** `POST /api/newsletters/:id/send-test`
- **Body:** `{ "testEmail": "test@example.com" }`
- **Description:** Sends a test newsletter to a specific email address

### Get Newsletter Statistics
- **URL:** `GET /api/newsletters/:id/stats`
- **Description:** Returns newsletter statistics including subscriber count

## Newsletter Content Structure

Your newsletter content should be created using Strapi's rich text editor. The system will automatically convert the rich text to HTML for email sending.

## Troubleshooting

### Common Issues

1. **"Invalid API Key" Error**
   - Verify your Brevo API key is correct
   - Ensure the API key has SMTP permissions

2. **"Sender Email Not Verified" Error**
   - Verify your sender email in Brevo account
   - Wait for verification email and click the link

3. **"No Active Subscribers" Error**
   - Add subscribers to the newsletter-subscription collection
   - Ensure subscribers have `isActive: true`

4. **Email Not Received**
   - Check spam/junk folder
   - Verify sender email is properly configured
   - Check Brevo dashboard for delivery status

### Debug Mode

To enable debug logging, add this to your `.env` file:
```env
NODE_ENV=development
```

## Security Considerations

1. **API Key Security:**
   - Never commit your API key to version control
   - Use environment variables for all sensitive data
   - Rotate API keys regularly

2. **Email Compliance:**
   - Ensure you have permission to email subscribers
   - Include unsubscribe links in emails
   - Follow CAN-SPAM and GDPR regulations

3. **Rate Limiting:**
   - Brevo has rate limits (check your plan)
   - Implement proper error handling for rate limit errors

## Monitoring and Analytics

1. **Brevo Dashboard:**
   - Monitor email delivery rates
   - Track open rates and click rates
   - View bounce and complaint rates

2. **Strapi Logs:**
   - Check application logs for errors
   - Monitor API endpoint usage

## Support

- **Brevo Documentation:** https://developers.brevo.com/
- **Strapi Documentation:** https://docs.strapi.io/
- **API Reference:** Check the generated API documentation in your Strapi admin panel

## Next Steps

1. Set up email templates in Brevo for better customization
2. Implement email tracking and analytics
3. Add unsubscribe functionality
4. Set up automated newsletter scheduling
5. Implement A/B testing for newsletter content

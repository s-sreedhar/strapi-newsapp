/**
 * newsletter controller
 */

import { factories } from '@strapi/strapi';
import brevoEmailService from '../../../services/brevo-email';

export default factories.createCoreController('api::newsletter.newsletter', ({ strapi }) => ({
  // Send newsletter to all active subscribers
  async sendNewsletter(ctx) {
    try {
      const { id } = ctx.params;
      
      // Get the newsletter
      const newsletter = await strapi.entityService.findOne('api::newsletter.newsletter', id);
      
      if (!newsletter) {
        return ctx.notFound('Newsletter not found');
      }
      
      if (newsletter.docstatus === 'sent') {
        return ctx.badRequest('Newsletter has already been sent');
      }
      
      // Get all active subscribers
      const subscribers = await strapi.entityService.findMany('api::newsletter-subscription.newsletter-subscription', {
        filters: {
          isActive: true
        }
      });
      
      if (subscribers.length === 0) {
        return ctx.badRequest('No active subscribers found');
      }
      
      // Send newsletter via Brevo
      const results = await brevoEmailService.sendNewsletterToSubscribers(newsletter, subscribers);
      
      // Update newsletter status
      await strapi.entityService.update('api::newsletter.newsletter', id, {
        data: {
          docstatus: 'sent',
          sentAt: new Date()
        }
      });
      
      // Count successful and failed sends
      const successfulSends = results.filter(r => r.success).length;
      const failedSends = results.filter(r => !r.success).length;
      
      return {
        message: 'Newsletter sent successfully',
        totalSubscribers: subscribers.length,
        successfulSends,
        failedSends,
        results
      };
      
    } catch (error) {
      console.error('Error sending newsletter:', error);
      return ctx.internalServerError('Failed to send newsletter');
    }
  },
  
  // Send test newsletter to specific email
  async sendTestNewsletter(ctx) {
    try {
      const { id } = ctx.params;
      const { testEmail } = ctx.request.body;
      
      if (!testEmail) {
        return ctx.badRequest('Test email is required');
      }
      
      // Get the newsletter
      const newsletter = await strapi.entityService.findOne('api::newsletter.newsletter', id);
      
      if (!newsletter) {
        return ctx.notFound('Newsletter not found');
      }
      
      // Create a mock subscriber for testing
      const testSubscriber = {
        email: testEmail,
        fullname: 'Test User',
        isActive: true
      };
      
      // Send test email
      const result = await brevoEmailService.sendNewsletterToSubscribers(newsletter, [testSubscriber]);
      
      return {
        message: 'Test newsletter sent successfully',
        result: result[0]
      };
      
    } catch (error) {
      console.error('Error sending test newsletter:', error);
      return ctx.internalServerError('Failed to send test newsletter');
    }
  },
  
  // Get newsletter statistics
  async getNewsletterStats(ctx) {
    try {
      const { id } = ctx.params;
      
      // Get the newsletter
      const newsletter = await strapi.entityService.findOne('api::newsletter.newsletter', id);
      
      if (!newsletter) {
        return ctx.notFound('Newsletter not found');
      }
      
      // Get total subscribers count
      const totalSubscribers = await strapi.entityService.count('api::newsletter-subscription.newsletter-subscription', {
        filters: {
          isActive: true
        }
      });
      
      return {
        newsletter,
        totalSubscribers,
        isSent: newsletter.docstatus === 'sent',
        sentAt: newsletter.sentAt
      };
      
    } catch (error) {
      console.error('Error getting newsletter stats:', error);
      return ctx.internalServerError('Failed to get newsletter statistics');
    }
  }
}));

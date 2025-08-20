/**
 * newsletter-subscription controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::newsletter-subscription.newsletter-subscription', ({ strapi }) => ({
  // Override create method with enhanced validation and response
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Ensure required fields are present
      if (!data?.email || !data?.fullname) {
        return ctx.badRequest('Email and full name are required');
      }

      // Create the subscription
      const entity = await strapi.entityService.create('api::newsletter-subscription.newsletter-subscription', {
        data: {
          ...data,
          subscribedAt: new Date(),
          isActive: true
        }
      });

      // Return success response
      ctx.status = 201;
      ctx.body = {
        data: entity,
        meta: {
          message: 'Successfully subscribed to newsletter'
        }
      };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      // Handle unique constraint violation (duplicate email)
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.code === '23505') {
        return ctx.conflict('Email is already subscribed to the newsletter');
      }
      
      return ctx.internalServerError('Failed to subscribe to newsletter');
    }
  },

  // Add unsubscribe method
  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body;
      
      if (!email) {
        return ctx.badRequest('Email is required for unsubscription');
      }

      // Find the subscription
      const subscriptions = await strapi.entityService.findMany(
        'api::newsletter-subscription.newsletter-subscription',
        {
          filters: {
            email: email.toLowerCase().trim(),
            isActive: true
          },
          limit: 1
        }
      );

      if (!subscriptions || subscriptions.length === 0) {
        return ctx.notFound('No active subscription found for this email address');
      }

      const subscription = subscriptions[0];

      // Deactivate the subscription instead of deleting
      await strapi.entityService.update(
        'api::newsletter-subscription.newsletter-subscription',
        subscription.id,
        {
          data: {
            isActive: false,
            unsubscribedAt: new Date()
          }
        }
      );

      ctx.status = 200;
      ctx.body = {
        data: {
          email: email.toLowerCase().trim(),
          unsubscribed: true,
          unsubscribedAt: new Date()
        },
        meta: {
          message: 'Successfully unsubscribed from newsletter'
        }
      };
    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      return ctx.internalServerError('Failed to unsubscribe from newsletter');
    }
  },

  // Override find method to only show active subscriptions by default
  async find(ctx) {
    const { query } = ctx;
    
    // By default, only show active subscriptions
    if (!query.filters || !(query.filters as any).isActive) {
      query.filters = {
        ...(query.filters as Record<string, any> || {}),
        isActive: true
      };
    }
    
    return await super.find(ctx);
  }
}));

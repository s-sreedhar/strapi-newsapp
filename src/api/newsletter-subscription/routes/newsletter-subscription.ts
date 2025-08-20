/**
 * newsletter-subscription router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::newsletter-subscription.newsletter-subscription', {
  config: {
    create: {
      auth: false, // Allow public subscriptions
      policies: [],
    },
    find: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
    findOne: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
    update: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
    delete: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
});

/**
 * newsletter router
 */

import { factories } from '@strapi/strapi';

export default {
  routes: [
    // Default CRUD routes
    {
      method: 'GET',
      path: '/newsletters',
      handler: 'newsletter.find',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/newsletters/:id',
      handler: 'newsletter.findOne',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletters',
      handler: 'newsletter.create',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/newsletters/:id',
      handler: 'newsletter.update',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/newsletters/:id',
      handler: 'newsletter.delete',
      config: {
        policies: ['admin::isAuthenticatedAdmin'],
        middlewares: [],
      },
    },
    
    // Custom routes for newsletter sending
    {
      method: 'POST',
      path: '/newsletters/:id/send',
      handler: 'newsletter.sendNewsletter',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/newsletters/:id/send-test',
      handler: 'newsletter.sendTestNewsletter',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/newsletters/:id/stats',
      handler: 'newsletter.getNewsletterStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

import { request } from '@strapi/helper-plugin';

const newsletterService = {
  async sendNewsletter(newsletterId) {
    try {
      const response = await request(`/api/newsletters/${newsletterId}/send`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async sendTestNewsletter(newsletterId, testEmail) {
    try {
      const response = await request(`/api/newsletters/${newsletterId}/send-test`, {
        method: 'POST',
        body: { testEmail },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getNewsletterStats(newsletterId) {
    try {
      const response = await request(`/api/newsletters/${newsletterId}/stats`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getActiveSubscribers() {
    try {
      const response = await request('/api/newsletter-subscriptions', {
        method: 'GET',
        params: {
          filters: {
            isActive: {
              $eq: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default newsletterService;
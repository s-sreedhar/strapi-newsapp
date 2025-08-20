import { env } from "process";

export default ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-brevo',
      providerOptions: {
        apiKey: env('BREVO_API_KEY'),
      },
      settings: {
        defaultSenderEmail: env('BREVO_SENDER_EMAIL'),
        defaultSenderName: env('BREVO_SENDER_NAME'),
        defaultReplyTo: env('BREVO_SENDER_EMAIL'),
        testAddress: env('BREVO_SENDER_EMAIL'),
      },
    },
  },
  // 'email-designer-5': {
  //   enabled: true,
  // },
  'populate-deep': {
    config: {
      defaultDepth: 5, // Default is 5
    }
  },
  seo: {
    enabled: true,
  },
  slugify: {
    enabled: true,
    config: {
      contentTypes: {
        article: {
          field: 'slug',
          references: 'title',
        },
        category: {
          field: 'slug',
          references: 'name',
        },
        author: {
          field: 'slug',
          references: 'name',
        },
        tag: {
          field: 'slug',
          references: 'name',
        },
      },
    },
  },
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
      },
    }
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'News CMS API',
        description: 'API documentation for News CMS',
        contact: {
          name: 'API Support',
          email: 'support@newscms.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      'x-strapi-config': {
        mutateDocumentation: (generatedDocumentationDraft: any) => {
          // Customize documentation here if needed
          return generatedDocumentationDraft;
        },
      },
    },
  },
});
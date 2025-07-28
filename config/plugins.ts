export default () => ({
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
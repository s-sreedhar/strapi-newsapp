// import path from 'path';

// export default ({ env }) => {
//   const client = env('DATABASE_CLIENT', 'sqlite');

//   const connections = {
//     // mysql: {
//     //   connection: {
//     //     host: env('DATABASE_HOST', 'localhost'),
//     //     port: env.int('DATABASE_PORT', 3306),
//     //     database: env('DATABASE_NAME', 'strapi'),
//     //     user: env('DATABASE_USERNAME', 'strapi'),
//     //     password: env('DATABASE_PASSWORD', 'strapi'),
//     //     ssl: env.bool('DATABASE_SSL', false) && {
//     //       key: env('DATABASE_SSL_KEY', undefined),
//     //       cert: env('DATABASE_SSL_CERT', undefined),
//     //       ca: env('DATABASE_SSL_CA', undefined),
//     //       capath: env('DATABASE_SSL_CAPATH', undefined),
//     //       cipher: env('DATABASE_SSL_CIPHER', undefined),
//     //       rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
//     //     },
//     //   },
//     //   pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
//     // },
//     postgres: {
//       connection: {
//         connectionString: env('DATABASE_URL'),
//         // host: env('DATABASE_HOST', 'localhost'),
//         // host: env('DATABASE_HOST', '127.0.0.1'),
//         host: env('DATABASE_HOST'),
//         port: env.int('DATABASE_PORT', 5432),
//         // database: env('DATABASE_NAME', 'strapi'),
//         database: env('DATABASE_NAME'),
//         // user: env('DATABASE_USERNAME', 'strapi'),
//         user: env('DATABASE_USERNAME'),
//         // password: env('DATABASE_PASSWORD', 'strapi'),
//         password: env('DATABASE_PASSWORD'),
//         ssl: env.bool('DATABASE_SSL', false) && {
//           key: env('DATABASE_SSL_KEY', undefined),
//           cert: env('DATABASE_SSL_CERT', undefined),
//           ca: env('DATABASE_SSL_CA', undefined),
//           capath: env('DATABASE_SSL_CAPATH', undefined),
//           cipher: env('DATABASE_SSL_CIPHER', undefined),
//           rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
//         },
//         schema: env('DATABASE_SCHEMA', 'public'),
//       },
//       pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
//     },
//     sqlite: {
//       connection: {
//         filename: path.join(__dirname, '..', '..', env('DATABASE_FILENAME', '.tmp/data.db')),
//       },
//       useNullAsDefault: true,
//     },
//   };

//   return {
//     connection: {
//       client,
//       ...connections[client],
//       acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
//     },
//   };
// };

// export default ({ env }) => ({
//   connection: {
//     client: 'postgres',
//     connection: {
//       host: env('DATABASE_HOST', '127.0.0.1'),
//       port: env.int('DATABASE_PORT', 5432),
//       database: env('DATABASE_NAME', 'strapidb'),
//       user: env('DATABASE_USERNAME', 'strapi'),
//       password: env('DATABASE_PASSWORD', 'strapi'),
//       ssl: {
//         ca: env('DATABASE_SSL_CA'),
//       },
//     },
//     debug: false,
//   },
// });


// config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'), // From DO dashboard
      port: env.int('DATABASE_PORT', 25060), // Default DO PostgreSQL port
      database: env('DATABASE_NAME', 'defaultdb'), // DO's default database name
      user: env('DATABASE_USERNAME', 'doadmin'), // DO's default admin user
      password: env('DATABASE_PASSWORD'), // From DO dashboard
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true), // Required for DO
        ca: env('DATABASE_SSL_CA'), // Get from DO connection details
      },
    },
    pool: {
      min: 0,
      max: 5,
      idleTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
    debug: false,
  },
});
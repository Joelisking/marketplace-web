/* eslint-disable */
module.exports = {
  marketplace: {
    input: {
      target: '../marketplace-api/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: 'lib/api',
      client: 'react-query',
      baseUrl: 'http://localhost:4000',
      override: {
        prettier: true,
        clean: true,
      },
    },
  },
};

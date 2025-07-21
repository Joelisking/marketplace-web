module.exports = {
  marketplace: {
    input: {
      target: '../marketplace-api/openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      target: 'lib/api',
      client: 'react-query',
      override: {
        prettier: true,
        clean: true,
      },
    },
  },
};

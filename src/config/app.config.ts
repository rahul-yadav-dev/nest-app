export const APP_CONFIG = {
  mode: process.env.APP_MODE || 'app', // 'app' or 'consumer'
  port: process.env.PORT || (process.env.APP_MODE === 'consumer' ? 4003 : 4002),
  kafka: {
    brokers: ['localhost:9092'],
    clientId: 'nest-app',
    groupId: 'my-group',
    topic: 'my-test',
  },
};

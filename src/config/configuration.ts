export default () => ({
  metaTraderSocket:{
    apiKey: process.env.API_KEY || 'CHANGEME',
    reqUrl: process.env.REQ_URL || 'tcp://127.0.0.1:5555',
    pullUrl: process.env.PULL_URL || 'tcp://127.0.0.1:5556',
  }
});

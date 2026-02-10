const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000, // React will access video here
    allow_origin: '*',
    mediaroot: './media',
  }
};

var nms = new NodeMediaServer(config);
nms.run();

console.log('Media Server Request URL: rtmp://192.168.1.74:1935/live/drone');
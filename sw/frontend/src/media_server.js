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
    port: 8000,
    allow_origin: '*',
    mediaroot: './media',
  },
  trans: {
    ffmpeg: 'C:/Users/thoma/Downloads/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/ffmpeg-2026-02-09-git-9bfa1635ae-full_build/bin/ffmpeg.exe', 
    tasks: [
      {
        app: 'live',
        mp4: true,
        mp4Flags: '[movflags=faststart]',
      }
    ]
  }
};

var nms = new NodeMediaServer(config);
nms.run();

console.log('Drone Media Server Active');
console.log('Target URL: rtmp://192.168.1.74:1935/live/drone');
const key = require('./keys');
const redis = require('redis');
const urlRedis = `redis://default:default@${key.hostRedis}:${key.portRedis}`
const redisClient = redis.createClient({
    url: urlRedis
});
(async () => {
    redisClient.on('error', async (error) => {
        console.log('Redis connect error: ', error);
        await redisClient.reconnecting();
    })
    await redisClient.connect();
})();

function caculFibo(index) {
    if (index < 2) return 1;
    return caculFibo(index - 2) + caculFibo(index - 1);
}

const subscriber = redisClient.duplicate();
(async () => {
    await subscriber.connect();
    await subscriber.subscribe("insert",async (message) => {
        await redisClient.hSet('values', message, caculFibo(parseInt(message)))
    });
})();

const keys = require('./keys');
const bodyPaser = require('body-parser');
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');

const uslRedis = `redis://default:default@${keys.redisHost}:${keys.redisPort}`
const app = express();
const redisClient = redis.createClient({
    url: uslRedis
});

(async() => {
    redisClient.on('error', (err) => {
        console.log("Connect redis error: ", err);
    })
    await redisClient.connect();
})();

const publisher = redisClient.duplicate();
(async () => {
    await publisher.connect();
})();

app.use(cors());
app.use(bodyPaser.json());
const pgClient = new Pool({
    user: keys.pgUser,
    port: keys.pgPort,
    host: keys.pgHost,
    password: keys.pgPassword,
    database: keys.pgDatabase
});

pgClient.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }
    client.query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.log(err))
})

app.get('/', (req, res) => {
    res.send('Hi there');
});

app.get('/getAll', async(req, res) => {
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values.rows);
});
app.get('/getRedis', async(req, res) => { 
    const values = await redisClient.hGetAll('values');
    res.send(values);
});
app.post('/caculFibo', async(req, res) => {
    const index = req.body.index;
    if(index > 40){
        res.send("Index too high!");
    }
    await redisClient.hSet('values', index, "Nothing yet!");
    publisher.publish('insert', index);
    await pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({ working: true});
})

app.listen(5000, () => {
    console.log("Listening on port:5000")
})
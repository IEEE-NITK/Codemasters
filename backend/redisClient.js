const { createClient } = require('redis');

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 12484,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function connectAndTest() {
  try {
    await client.connect();

    await client.set('foo', 'bar');
    const result = await client.get('foo');
    console.log(result == 'bar' ? 'Connected To Redis!' : 'Test failed!');
  } catch (err) {
    console.error('Error:', err);
  }
}

connectAndTest();

import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});

export async function connectToRedis() {
  await redisClient.connect();

  redisClient.on("error", (error) => {
    console.error(`Error connecting to Redis: ${error}`);
  });

  return redisClient;
}

export default redisClient;

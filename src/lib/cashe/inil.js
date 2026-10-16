
import { RadisCacheProvider } from "../../pkg/cashe/radis.js";
import { env } from "../config/env.js";

export const cacheProvider = new RadisCacheProvider({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password || '',

});
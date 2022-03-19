import { createClient, RedisClient } from 'redis';
import Bot from '../../Bot';
import Base from '../../structures/Base';

export default class Redis extends Base {
    public client: RedisClient;

    public constructor(bot: Bot) {
        super(bot);
        this.client = createClient({
            password: process.env.REDIS_PASS
        });
    }
}
import { Bot } from "./core";
import { config } from 'dotenv';
import Listener from "./Listener";
config();

export const DEV = true;

if(DEV) {
    config({path: ".env.dev"});
} else {
    config({path: ".env.prod"});
}

(async() => {
    const bot = new Bot(process.env.TOKEN!, {
        autoreconnect: true,
        compress: true,
        allowedMentions: {
            everyone: false,
            repliedUser: true,
            roles: true,
            users: true
        },
        intents: 14319,
        eventManager: new Listener,
    });
    try {
        await bot.start();
    } catch (err) {
        bot.logger.critical(err.message);
    }
})();
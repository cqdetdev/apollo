"use strict"
const { Bot, EventManager } = require('../dist/core');
const { config } = require('dotenv');
config();

class E extends EventManager {
    async registerListeners() {}
}

const main = async() => {
    const bot = new Bot(process.env.TOKEN, {
        eventManager: new E,
        intents: 14319
    });

    bot.on('ready', () => {
        process.exit();
    })

    await bot.start();
}
main();

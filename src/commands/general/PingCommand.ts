import { Message } from "eris";
import { Bot, Command } from "../../core";

export default class PingCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'ping', 'general', ['p', 'pong', 'pung', 'pang'], 'ping', 'A command to test the latency of the bot');
    }

    public async run(_bot: Bot, msg: Message, _args: string[]): Promise<void> {
        const m = await msg.channel.createMessage("Pinging...");
        const ping = Math.floor(m.timestamp - msg.timestamp);
        m.edit(`Pong! \`${ping}ms\``)
    }
}
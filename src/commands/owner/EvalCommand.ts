import { Message } from "eris";
import { Bot, Command } from "../../core";
import { transpile } from 'typescript';
import { inspect } from 'util';

export default class EvalCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'eval', 'owner', ['ev', 'e'], ['eval <code>'], 'A command to eval Typescript code');
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        if(msg.author.id !== '522895569039917066') return;
        const code = args.slice(0).join(' ');
        const js = transpile(code);
        let res;
        try {
            res = eval(js);
        } catch (err) {
            res = err.toString();
        } 
        if (typeof res !== 'string') {
            res = inspect(res, { depth: 0 });
        }
        if(res.includes(process.env.TOKEN!)) {
            res = res.replace(process.env.TOKEN!, 'TOKEN');
        }
        msg.channel.createMessage(`\`\`\`${res}\`\`\``);
    }
}
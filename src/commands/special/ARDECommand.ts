import { Message } from "eris";
import { Bot, Command, Embed } from "../../core";

export default class AvatarCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'arde', 'special', ['ar'], ['arde <subcommand>'], 'A command to use ARDE (Anti-Raid Data Engine)', ['manageGuild'], []);
    }

    public async run(_bot: Bot, msg: Message, _args: string[]): Promise<void> {
        msg.channel.createMessage(new Embed().setColor(this.fmt.colors.red).setDescription('This feature is still in development'));
    }
}
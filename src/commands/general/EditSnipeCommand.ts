import { Message } from "eris";
import { Bot, Command, Embed } from "../../core";

export default class EditSnipeCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'editsnipe', 'general', ['es'], 'editsnipe', 'A command to showcase the last editted message');
    }

    public async run(bot: Bot, msg: Message, _args: string[]): Promise<void> {
        if(!bot.store.has(msg.channel.id + "e")) {
            msg.channel.createMessage('There\'s nothing to snipe!');
        } else {
            let m: Message = bot.store.get(msg.channel.id + "e");
            const e = new Embed()
            .setAuthor(this.fmt.join(msg.author.username, "#", msg.author.discriminator), msg.author.avatarURL)
            .setColor(this.fmt.colors.cyan)
            .setTimestamp(new Date(m.timestamp))
            .setDescription(m.content || "")
            if(m.attachments.length) {
                e.setImage(m.attachments[0].url)
            }
            msg.channel.createMessage(e);
        }
    }
}
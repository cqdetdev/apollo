import { Message } from "eris";
import { Bot, Command, Embed } from "../../core";
import { cpuUsage, freememPercentage } from 'os-utils';

export default class InfoCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'info', 'general', ['inf', 'i'], 'info', 'A command to get information on the bot');
    }

    public async run(bot: Bot, msg: Message, _args: string[]): Promise<void> {
        cpuUsage((cpu) => {
            const e = new Embed()
            .setTitle('Bot Info')
            .setThumbnail(bot.user.dynamicAvatarURL('png', 256))
            .setColor(this.fmt.colors.blue)
            .addField('Name', this.fmt.join(bot.user.username, "#", bot.user.discriminator), true)
            .addField('Author', 'Caggy#0001')
            .addField('Library', 'Eris - Dev', true)
            .addField('Language', 'Typescript')
            .addField('CPU Usage', Math.round(cpu) + "%")
            .addField('Memory Usage', Math.round(freememPercentage() * 100) + "MB")
            msg.channel.createMessage(e);
        })
    }
}
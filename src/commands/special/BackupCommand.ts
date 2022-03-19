import { Message } from "eris";
import { Bot, Command, Embed } from "../../core";
import { performance } from 'perf_hooks';

export default class AvatarCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'backup', 'special', ['b'], ['backup <subcommand>'], 'A command to use the server backups module', ['manageGuild'], ['administrator']);
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        switch(args[0]) {
            case "create": {
                const p1 = performance.now();
                await this.bot.backup.saveGuild(msg.member?.guild!);
                const p2 = performance.now();
                msg.channel.createMessage(`Backed up server in \`${Math.floor(p2 - p1)}ms\``)
                return;
            }
            case "load": {
                // return;
                // const b = await this.bot.backup.getGuild(msg.member?.guild!)!;
                // if(b) {
                //     await this.bot.backup.loadGuild(msg.member?.guild!);
                // } else {
                //     msg.channel.createMessage(
                //         new Embed()
                //         .setColor(this.fmt.colors.red)
                //         .setDescription('No backup found, please create a backup with `backup load`')
                //     );
                // }
                return;
            }
            case "info": {
                const b = await this.bot.backup.getGuild(msg.member?.guild!);
                if(b) {
                    // TODO
                } else {
                    msg.channel.createMessage(
                        new Embed()
                        .setColor(this.fmt.colors.red)
                        .setDescription('No backup found, please create a backup with `backup load`')
                    );
                }
                return;
            }
            default: {
                const e = new Embed()
                .setTitle('Backup Command')
                .setColor(this.fmt.colors.blue)
                .setDescription(
                    `\`create\` - Used to create a backup
                    \`load\` - Used to load a backup`
                    )
                .setFooter('NOTICE: Backup loading is disabled due to difficulties with Discord')
                msg.channel.createMessage(e);
            }
        }
    }
}
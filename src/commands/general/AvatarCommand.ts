import { Message } from "eris";
import { Bot, Command, Embed, MemberArgument } from "../../core";

export default class AvatarCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'avatar', 'general', ['av'], ['avatar', 'avatar @Cqdet', 'avatar Cqdet', 'avatar 522895569039917066'], 'A command to get the avatar of a server member');
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        const _ = new MemberArgument(bot, 0, false).parse(msg, args, msg.member?.guild!);
        const member = _ ?? msg.member!;
        const user = member.user;
        // @ts-ignore
        let av = user.dynamicAvatarURL(null, 256);
        av = av.match(/.gif/) ? `${av}&f=.gif` : av;
        const e = new Embed()
        .setTitle('Avatar')
        .setColor(this.fmt.colors.cyan)
        .setAuthor(this.util.tag(user), )
        .setImage(av);
        msg.channel.createMessage(e);
    }
}
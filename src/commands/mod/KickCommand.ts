import { Message } from "eris";
import { Bot, Command, Embed, MemberArgument } from "../../core";

export default class KickCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'kick', 'mod', ['k'], ['userinfo', 'kick @Cqdet', 'kick Cqdet', 'kick 522895569039917066'], 'A command to kick a member from the server', ['kickMembers'], ['kickMembers']);
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        const member = new MemberArgument(bot, 0, true).parse(msg, args, msg.member?.guild!)!;
        const me = msg.member?.guild!.members.get(bot.user.id)!;
        const m = msg.member?.guild!.members.get(msg.author.id)!;
        if(this.permissionManager.kickable(member, m) &&
            this.permissionManager.kickable(member, me)) {
                // TODO: Add flags!!!
                const reason = args[1];
                await member.kick(reason ?? 'No Reason');

        } else {
            msg.channel.createMessage(
                new Embed()
                .setColor(this.fmt.colors.red)
                .setDescription('You cannot kick this user. You may not have a higher role than this user or sufficient permissions')
            );
        }
    }
}
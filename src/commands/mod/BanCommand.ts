import { Message } from "eris";
import { Bot, Command, Embed, MemberArgument } from "../../core";

export default class BanCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'ban', 'mod', [], ['ban', 'ban @Cqdet', 'ban Cqdet', 'ban 522895569039917066'], 'A command to ban a member from the server', ['banMembers'], ['banMembers']);
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        const member = new MemberArgument(bot, 0, true).parse(msg, args, msg.member?.guild!)!;
        const me = msg.member?.guild!.members.get(bot.user.id)!;
        const m = msg.member?.guild!.members.get(msg.author.id)!;
        if(this.permissionManager.bannable(member, m) &&
            this.permissionManager.bannable(member, me)) {
                // TODO: Add flags!!!
                const reason = args[1];
                await member.ban(0, reason ?? 'No Reason');

        } else {
            msg.channel.createMessage(
                new Embed()
                .setColor(this.fmt.colors.red)
                .setDescription('You cannot ban this user. You may not have a higher role than this user or sufficient permissions')
            );
        }
    }
}
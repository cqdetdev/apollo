import { Message } from "eris";
import { Bot, Command, CSVArgument, Embed, MemberArgument } from "../../core";

export default class MBanCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'mban', 'mod', [], ['mban', 'ban @Cqdet, @xdolmation', 'mban 522895569039917066, 724001043356319875'], 'A command to ban multiple members from your server', ['banMembers'], ['banMembers']);
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        let memberIDs: string[] = new CSVArgument(bot, 0, true).parse(msg, args, msg.member?.guild!)!;
        memberIDs = memberIDs.map(m => m.replace(this.util.mentionRegex, ""));
        const members = memberIDs.map(m => msg.member.guild.members.get(m)).filter(_ => !!_);
        if(!members.length) {
            msg.channel.createMessage(
                new Embed()
                .setColor(this.fmt.colors.red)
                .setDescription('Failed to find any specified member(s)')
            )
            return;
        } else if(members.length > 5) {
            msg.channel.createMessage(
                new Embed()
                .setColor(this.fmt.colors.red)
                .setDescription('You may not ban more than 5 members at once')
            )
            return;
        }
        const me = msg.member?.guild!.members.get(bot.user.id)!;
        const m = msg.member?.guild!.members.get(msg.author.id);
        const t: [string, boolean][] = [];
        for (let member of members) {
            if(this.permissionManager.bannable(member, m) &&
            this.permissionManager.bannable(member, me)) {
                // TODO: Add flags!!!
                const reason = args[1];
                try {
                    await member.ban(0, reason ?? 'No Reason');
                    t.push([member.id, true])
                } catch {
                    t.push([member.id, false])
                }
            } else {
                t.push([member.id, false]);
            } 
        }
        msg.channel.createMessage(
            new Embed()
            .setTitle('Multi-Ban Response')
            .setColor(this.fmt.colors.blue)
            .setDescription(
                `Succeeded: ${t.filter(([_, s]) => !!s).map((id, _) => `<@${id}>`) ?? 'None'}
                Failed: Succeeded: ${t.filter(([_, s]) => !s).map((id, _) => `<@${id}>`) ?? 'None'}
                `
            )
        );
    }
}
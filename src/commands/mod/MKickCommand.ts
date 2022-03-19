import { Message } from "eris";
import { Bot, Command, CSVArgument, Embed } from "../../core";

export default class MKickCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'mkick', 'mod', [], ['mkick', 'mkick @Cqdet, @xdolmation', 'mkick 522895569039917066, 724001043356319875'], 'A command to kick multiple members from your server', ['kickMembers'], ['kickMembers']);
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        let memberIDs: string[] = new CSVArgument(bot, 0, true).parse(msg, args, msg.member?.guild!)!;
        memberIDs = memberIDs.map(m => m.replace(this.util.mentionRegex, ""));
        const members = memberIDs.map(m => msg.member!.guild.members.get(m)).filter(_ => !!_);
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
                .setDescription('You may not kick more than 5 members at once')
            )
            return;
        }
        const me = msg.member?.guild!.members.get(bot.user.id)!;
        const m = msg.member?.guild!.members.get(msg.author.id)!;
        const t: [string, boolean][] = [];
        for (let member of members) {
            member = member!;
            if(this.permissionManager.kickable(member, m) &&
            this.permissionManager.kickable(member, me)) {
                // TODO: Add flags!!!
                const reason = args[args.length - 1];
                try {
                    await member.kick(reason ?? 'No Reason');
                    t.push([member.id, true])
                } catch {
                    t.push([member.id, false])
                }
            } else {
                t.push([member.id, false]);
            } 
        }
        let s = t.filter(([_, s]) => !!s).map(([id, _]) => `<@${id}>`);
        let f = t.filter(([_, s]) => !s).map(([id, _]) => `<@${id}>`);
        msg.channel.createMessage(
            new Embed()
            .setTitle('Multi-Kick Response')
            .setColor(this.fmt.colors.blue)
            .setDescription(
                `Succeeded: ${s.length ? s : 'None'}
                Failed: ${f.length ? f : 'None'}
                Reason: ${args[args.length - 1]}
                `
            )
        );
    }
}
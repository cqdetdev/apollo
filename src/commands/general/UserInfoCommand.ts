import { Message } from "eris";
import { Bot, Command, MemberArgument, Embed } from "../../core";


export default class UserInfoCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'userinfo', 'general', ['ui', 'usrinfo'], ['userinfo', 'userinfo @Cqdet', 'userinfo Cqdet', 'userinfo 522895569039917066'], 'A command to get information of a server member');
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        const _ = new MemberArgument(bot, 0, false).parse(msg, args, msg.member?.guild!);
        const guild = msg.member?.guild!;
        let member = _ ?? msg.member!;
        let roles = member.roles.map(r => guild.roles.get(r)!);
        roles = roles.filter(r => r.id !== guild.id);
        const { createdAt, joinedAt } = member;
        let permissions = Object.entries(member.permissions.json).map(([p, w]) => {
            return w ? p : undefined;
        }).filter(p => !!p) as string[];
        const e = new Embed()
        .setThumbnail(member.avatarURL)
        .setAuthor(this.fmt.join(member.username, "#", member.discriminator), member.avatarURL, member.avatarURL)
        .setColor(this.fmt.colors.green)
        .addField("Joined At", new Date(joinedAt).toDateString(), true)
        .addField("Created At", new Date(createdAt).toDateString(), true)
        .addField(`Roles [${roles.length}]`, roles.map(r => this.fmt.join("<@&", r.id, ">")).join(" "))
        .addField(`Permissions [${permissions.length}]`, permissions.map(p => this.fmt.toCode(p)).join(" "))
        msg.channel.createMessage(e)
    }
}
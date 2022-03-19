import { GuildAuditLogEntry, Member, Message } from "eris";
import { Bot, Command, Embed } from "../../core";

export default class AuditLogsCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'auditlogs', 'admin', ['al', 'audit'], 'audit', 'A command to showcase the last few audit logs', ['administrator'], ['viewAuditLog', 'viewAuditLogs']);
    }

    public async run(_bot: Bot, msg: Message, _args: string[]): Promise<void> {
        const guild = msg.member?.guild!;
        const log = await guild.getAuditLog({ limit: 15 });
        let messages = log.entries.map(e => this.processAuditEntry(e));
        const e = new Embed()
        .setTitle('Audit Logs')
        .setColor(this.fmt.colors.blue)
        e.setDescription(messages.map((m, i) => {
            return `${(`[${(i + 1).toString()}]`)}: ${m}`
        }).join('\n'));

        msg.channel.createMessage(e);
    }

    private processAuditEntry(e: GuildAuditLogEntry): string {
        switch(e.actionType) {
            case 10: {
                const channel = e.after;
                return `<@${e.user.id}> created a channel named __${channel!.name}__`
            }
            case 11: {
                const before = e.before as any;
                const after = e.after as any;
                let obj = Object.keys(before);
                let data = obj.map(o => `__${o}__ from __${before[o]}__ to __${after[o]}__`);
                return `<@${e.user.id}> editted a channel: ${data.join("& ")}`
            }
            case 12: {
                const channel = e.before;
                return `<@${e.user.id}> deleted a channel named __${channel!.name}__`;
            }
            // case 13 14 15
            case 20: {
                return `<@${e.user.id}> kicked <@${e.targetID}> for __${e.reason ?? 'no reason'}__`;
            }
            // case 21
            case 22: {
                return `<@${e.user.id}> banned <@${e.targetID}> for __${e.reason ?? 'no reason'}__`;
            }
            case 23: {
                return `<@${e.user.id}> unbanned <@${e.targetID}>`;
            }
            case 24: {
                return `<@${e.user.id}> editted nickname from __${e.before!.nick || (e.target as Member).username}__ to __${e.after!.nick}__`;
            }
            case 25: {
                if(e.after!["$remove"]) {
                    let data = (e.after!["$remove"] as any)[0]!;
                    return `<@${e.user.id}> removed the role <@&${data.id}> from <@!${e.targetID}>`
                } else if (e.after!["$add"]) {
                    let data = (e.after!["$add"] as any)[0]!;
                    return `<@${e.user.id}> added the role <@&${data.id}> to <@!${e.targetID}>`
                } else {
                    return 'Unsupported Audit Message'
                }
            }
            case 26: {
                return `<@${e.user.id}> moved to voice channel __${e.channel?.name}__`
            }
            case 27: {
                return `<@${e.user.id}> disconnected from voice channel __${e.channel?.name}__` 
            }
            case 30: {
                const role = e.after as any;
                return `<@${e.user.id}> created a role named __${role.name}__`
            }
            case 31: {
                const before = e.before as any;
                const after = e.after as any;
                let obj = Object.keys(before);
                let data = obj.map(o => `__${o}__ from __${before[o]}__ to __${after[o]}__`);
                return `<@${e.user.id}> editted a role: ${data.join("& ")}`
            }
            // case 28
            case 32: {
                const role = e.before as any;
                return `<@${e.user.id}> deleted a role named __${role.name}__`
            }
            case 40: {
                const invite = e.after as any;
                return `<@${invite.inviter_id}> created an invite with code __${invite.code}__`;
            }
            // case 41
            case 42: {
                const invite = e.before as any;
                return `<@${invite.inviter_id}> deleted as invite with code __${invite.code}__`;
            }
            // case 52, 51, 50
            case 60: {
                const after = e.after as any;
                const emoji = e.guild.emojis.find(e => e.name === after.name)!; 
                return `<@${e.user.id}> created an emoji called __${after.name}__ (<:${after.name}:${emoji.id}>)`
            }
            case 61: {
                const after = e.after as any;
                const before = e.before as any;
                const emoji = e.guild.emojis.find(e => e.name === after.name)!; 
                return `<@${e.user.id}> editted an emoji's name from __${before.name}__ to __${after.name}__ (<:${after.name}:${emoji.id}>)`;
            }
            case 62: {
                let data = e.before as any;
                return `<@${e.user.id}> deleted named an emoji named __${data.name}__`;
            }
            case 72:
                return `<@${e.user.id}> deleted a message in <#${e.channel?.id}>`;
            case 73:
                return `<@${e.user.id}> bulk deleted messages`;
            case 74:
                return `<@${e.user.id}> pinned a __[message](https://canary.discord.com/channels/${e.guild.id}/${e.channel?.id}/${e.message?.id})__ in <#${e.channel?.id}>`
            case 75:
                return `<@${e.user.id}> unpinned a __[message](https://canary.discord.com/channels/${e.guild.id}/${e.channel?.id}/${e.message?.id})__ in <#${e.channel?.id}>`
            default:
                return "Unsupported Audit Message"
            }
    }
}
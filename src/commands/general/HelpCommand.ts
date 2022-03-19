import { Message } from "eris";
import { Bot, Command, Embed } from "../../core";

export default class HelpCommand extends Command {
    public constructor(bot: Bot) {
        super(bot, 'help', 'general', ['h'], ['help', 'help ping'], 'A command to get help on bot commands');
    }

    public async run(bot: Bot, msg: Message, args: string[]): Promise<void> {
        const commands = bot.commandHandler.commands;
        if(args[0]) {
            let cmd = commands.find(c => c.name === args[0]) ?? commands.find(c => c.aliases.includes(args[0]));
            if(!cmd) return;
            const data: [string, string][] = [];
            data.push(['Aliases', cmd.aliases.join(', ')]);
            data.push(['Description', cmd.description]);
            data.push(['Usage', cmd.usage instanceof Array ? cmd.usage.map(c => msg.prefix + c).join("\n") : msg.prefix + cmd.usage]);
            data.push(['Permissions', !!cmd.permissions.length ? cmd.permissions.map(p => this.fmt.toCode(p)).join(' ') : "None"]);
            const d = data.map(i => {
                return `${this.fmt.toBold(i[0])}: ${i[1]}`
            });
            const e = new Embed()
            .setTitle(`Command: ${cmd.name}`)
            .setColor(this.fmt.colors.blue)
            .setDescription(d.join('\n'))
            msg.channel.createMessage(e);
        } else {
            const general = commands.filter(c => c.group === 'general');
            const mod = commands.filter(c => c.group === 'mod');
            const admin = commands.filter(c => c.group === 'admin');
            const special = commands.filter(c => c.group === 'special');
            const e = new Embed()
            .setTitle('Commands')
            .setColor(this.fmt.colors.blue)
            .setDescription(`> Use ${msg.prefix}help <command> to get more detailed information on a command`)
            .addField('General', general.map(c => this.fmt.toCode(c.name)).join(" "))
            .addField('Mod', mod.map(c => this.fmt.toCode(c.name)).join(" "))
            .addField('Admin', admin.map(c => this.fmt.toCode(c.name)).join(" "))
            .addField('Special', special.map(c => this.fmt.toCode(c.name)).join(" "))
            msg.channel.createMessage(e);
        }
    }
}
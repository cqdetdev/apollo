import { Message } from "eris";
import { lstatSync, readdirSync } from "fs";
import { join } from "path";
import Base from "../structures/Base";
import Command from "./Command";
import CommandPermission from "./CommandPermission";

export default class CommandHandler extends Base {
    /** An array of loaded commands */
    public commands: Command[] = [];

    public async processMessage(msg: Message, prefix: string): Promise<void> {
        if(!msg.content.startsWith(prefix)) return;
        if(!msg.member) return;
        msg.prefix = prefix;
        let args = msg.content.split(" ");
        let str = args.shift()?.slice(prefix.length)!;
        if(!str) return;
        const cmd = this.commands.find(c => c.name === str) ?? this.commands.find(c => c.aliases.includes(str));
        if(!cmd) return; // No command found
        if(cmd.permissions.length && msg.member.guild.ownerID !== msg.member.id) {
            for(let perm of cmd.permissions) {
                if(msg.member.permissions.has(perm)) continue;
                // TODO: Find all of missing perms
                return await cmd.np([perm as CommandPermission], msg);
            }
        }
        if(cmd.selfPermissions.length) {
            for(let perm of cmd.selfPermissions) {
                let self = msg.member.guild.members.get(this.bot.user.id)!;
                if(self.permissions.has(perm)) continue;
                // TODO: Find all of missing perms
                return await cmd.snp([perm as CommandPermission], msg);
            }
        }
        try {
            await cmd.run(this.bot, msg, args);
        } catch (err) {
            await cmd.err(err, msg);
        }
    }

    public async dynLoadCommands(): Promise<void> {
        let path = join(process.cwd(), 'dist/commands');
        await this.recursiveDynImport(path);
    };

    private async recursiveDynImport(path: string) {
        for(let item of readdirSync(path)) {
            let newPath = join(path, item);
            if(lstatSync(newPath).isDirectory()) {
                this.recursiveDynImport(newPath);
                continue;
            } else {
                let imp = await import(newPath);
                imp = new imp.default(this.bot) ?? new imp(this.bot);
                this.commands.push(imp);
                this.logger.success(`Successfully loaded command: ${imp.name}`);
            };
        }
    }
}
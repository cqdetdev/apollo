import { Message } from "eris";
import Bot from "../Bot";
import Base from "../structures/Base";
import { Embed } from "../util";
import CommandPermission from "./CommandPermission";

export default abstract class Command extends Base {
    /** Name of the command */
    public name: string;
    /** Group of the command */
    public group: string;
    /** Aliases of the command */
    public aliases: string[];
    /** Usage of the command */
    public usage: string | string[];
    /** Description of the command */
    public description: string;
    /** Permissions of the command */
    public permissions: CommandPermission[];
    /** Permissions needed by bot */
    public selfPermissions: CommandPermission[];

    public constructor(
        bot: Bot,
        name: string,
        group: string,
        aliases: string[] = [],
        usage: string | string[],
        description: string,
        permissions: CommandPermission[]  = [],
        selfPermissions: CommandPermission[] = []
    ) {
        super(bot);
        this.name = name;
        this.group = group;
        this.aliases = aliases;
        this.usage = usage;
        this.description = description;
        this.permissions = permissions;
        this.selfPermissions = selfPermissions;
    }

    /**
     * Method to run command
     */
    public abstract run(bot: Bot, msg: Message, args: string[]): Promise<void>;
    /**
     * Method to handle command error
     */
    public async err(e: Error, msg: Message): Promise<void> {
        this.logger.error(e.message + "\n" + e.stack!);
        msg.channel.createMessage(new Embed().setColor(this.fmt.colors.red).setDescription("Something went wrong..."));
    };
    /**
     * Method to handle missing permissions on command
     */
    public async np(p: CommandPermission[], msg: Message): Promise<void> {
        msg.channel.createMessage(new Embed().setColor(this.fmt.colors.red).setDescription(`You're missing the following permissions(s): ${
            p.map(_ => this.fmt.toCode(_)).join(" ")
        }`))
    }; 

    public async snp(p: CommandPermission[], msg: Message): Promise<void> {
        msg.channel.createMessage(new Embed().setColor(this.fmt.colors.red).setDescription(`I am missing the following permissions(s): ${
            p.map(_ => this.fmt.toCode(_)).join(" ")
        }`))
    }
}
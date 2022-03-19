import { Message, OldMessage } from "eris";
import { EventManager } from "./core"

export default class Listener extends EventManager {
    public async registerListeners() {
        this.bot.on('ready', this.onReady.bind(this));
        this.bot.on('messageCreate', this.onMessageCreate.bind(this));
        this.bot.on('messageDelete', this.onMessageDelete.bind(this));
        this.bot.on('messageUpdate', this.onMessageUpdate.bind(this));
    }

    private async onReady(): Promise<void> {
        this.bot.logger.success('Successfully connected to Discord');
        this.bot.logger.success(`User: ${this.bot.user.username}#${this.bot.user.discriminator}`);
    }

    private async onMessageCreate(msg: Message): Promise<void> {
        this.bot.db.query(`insert into messages (
            id,
            authorID,
            channelID,
            guildID,
            content,
            attachment
        ) values ($1, $2, $3, $4, $5, $6)`, msg.id, msg.author.id, msg.channel.id, msg.guildID! ?? msg.member?.guild.id!, msg.content, msg.attachments.length ? msg.attachments.map(m => m.url).join(" ") : "None");
        if(msg.content.startsWith("?")) {
            await this.bot.commandHandler.processMessage(msg, "?");
        }
    }

    private async onMessageDelete(msg: Message | Partial<Message>): Promise<void> {
        this.bot.store.set(msg.channel?.id!, msg);
    }

    private async onMessageUpdate(newMsg: Message | Partial<Message>, oldMsg: OldMessage): Promise<void> {
        this.bot.store.set(newMsg.channel?.id! + "e", oldMsg);
    }
}
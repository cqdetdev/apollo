import { Message } from "eris";
import { Bot } from "../../core";
import ARDEUtil from "./ARDEUtil";
import MessageMeta from "./meta/MessageMeta";
import UserMeta from "./meta/UserMeta";

export default class ARDE {
    public bot: Bot;
    public store: Map<string, UserMeta | MessageMeta>;
    public util: ARDEUtil;

    public constructor(bot: Bot) {
        this.bot = bot;
        this.store = new Map();
        this.util = new ARDEUtil();
    }

    public async listen(): Promise<void> {
        this.bot.on('messageCreate', this.processMessage.bind(this));
    }

    public async processMessage(msg: Message): Promise<void> {
        let meta = MessageMeta.from(msg);
        this.store.set(meta.id, meta);
    }
}
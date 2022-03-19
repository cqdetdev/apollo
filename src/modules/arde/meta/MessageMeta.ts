import { Attachment, Message, Role, User } from "eris";

export default class MessageMeta {
    public id: string;
    public content: string;
    public attachments: Attachment[];
    public timestamp: number;
    public mentions: User[];
    public roleMentions: Role[];
    public mentionsEveryone: boolean;

    public constructor(data: any) {
        this.id = data.id;
        this.content = data.content;
        this.attachments = data.attachments;
        this.timestamp = data.timestamp;
        this.mentions = data.mentions;
        this.roleMentions = data.roleMentions;
        this.mentionsEveryone = data.mentionsEveryone;
    }

    public static from(msg: Message) {
        const {
            id,
            content,
            attachments,
            timestamp,
            mentions,
            roleMentions,
            mentionEveryone
        } = msg;
        return new MessageMeta({
            id,
            content,
            attachments,
            timestamp,
            mentions,
            roleMentions,
            mentionEveryone
        });
    } 
}
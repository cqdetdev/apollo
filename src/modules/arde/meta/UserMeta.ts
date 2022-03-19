import { User } from "eris";

export default class UserMeta {
    public id: string;
    public createdAt: number;
    public username: string;
    public avatar: string;
    public bot: boolean;

    public constructor(data: any) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.username = data.username;
        this.avatar = data.avatar;
        this.bot = data.bot;
    } 

    public static from(user: User) {
        const {
            id,
            createdAt,
            username,
            avatar,
            bot
        } = user;
        return new UserMeta({
            id,
            createdAt,
            username,
            avatar,
            bot
        });
    }
}
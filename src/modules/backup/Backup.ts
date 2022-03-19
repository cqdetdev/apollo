import { CategoryChannel, Guild, GuildChannel, Permission, PermissionOverwrite, TextChannel } from "eris";
import { Bot } from "../../core";
import { CategoryData, GuildBackupData, PermissionData } from "./Types";

export default class Backup {
    #bot: Bot;
    #queue: Set<string> = new Set();
    
    public constructor(bot: Bot) {
        this.#bot = bot;
    }

    public async saveGuild(guild: Guild): Promise<void> {
        let data: GuildBackupData = {
            id: guild.name,
            name: guild.name,
            iconURL: guild.iconURL!,
            bans: [],
            roles: [],
            channels: {
                categories: [],
                others: []
            }
        }
        let bans = await guild.getBans();
        data.bans = bans.map(b => {
            return {
                id: b.user.id,
                reason: b.reason ?? "No Reason"
            }
        });
        data.roles = guild.roles
            .filter(r => !r.managed)
            .sort((a, b) => b.position - a.position)
            .map(r => {
                return {
                    id: r.id,
                    name: r.name,
                    color: r.color,
                    hoist: r.hoist,
                    permissions: r.permissions,
                    mentionable: r.mentionable,
                    position: r.position
                }
            });
        let categories: CategoryChannel[] = (guild.channels
            .filter(c => c instanceof CategoryChannel) as CategoryChannel[])
            .sort((a, b) => a.position - b.position);;
        for(const category of categories) {
            let categoryData: CategoryData = {
                id: category.id,
                name: category.name,
                permissions: [],
                children: []
            }
            categoryData.permissions = category.permissionOverwrites.map(p => {
                return {
                    type: p.type as "role" | "member",
                    idOrName: p.type === 'role' ? guild.roles.get(p.id)!.name : p.id,
                    permission: new Permission(p.allow, p.deny)
                } as PermissionData
            })
            const children: GuildChannel[] = category.channels.map(c => c).sort((a, b) => 
                a.position - b.position
            );
            for(const child of children) {
                categoryData.children.push({
                    id: child.id,
                    type: child instanceof TextChannel ? 'text' : 'voice',
                    name: child.name,
                    // @ts-ignore
                    bitrate: child?.bitrate,
                    // @ts-ignore
                    userLimit: child?.userLimit,
                    // @ts-ignore
                    rateLimitPerUser: child?.rateLimitPerUser,
                    parent: guild.channels.get(child.parentID!)!.name,
                    permissions: child.permissionOverwrites.map(p => {
                        return {
                            type: p.type as "role" | "member",
                            idOrName: p.type === 'role' ? guild.roles.get(p.id)!.name : p.id,
                            permission: new Permission(p.allow, p.deny)
                        } as PermissionData
                    })
                });
            }
            data.channels.categories.push(categoryData);
        }
        let others: GuildChannel[] = guild.channels.filter(c => c !instanceof CategoryChannel && !c.parentID && c.type !== 4);
        for (let other of others) {
            data.channels.others.push({
                id: other.id,
                type: other instanceof TextChannel ? 'text' : 'voice',
                name: other.name,
                // @ts-ignore
                bitrate: other?.bitrate,
                // @ts-ignore
                userLimit: other?.userLimit,
                // @ts-ignore
                rateLimitPerUser: other?.rateLimitPerUser,
                permissions: other.permissionOverwrites.map(p => {
                    return {
                        type: p.type as "role" | "member",
                        idOrName: p.type === 'role' ? guild.roles.get(p.id)!.name : p.id,
                        permission: new Permission(p.allow, p.deny)
                    } as PermissionData
                })
            })
        }
        const res = await this.#bot.db.query('select * from backups where guildID = $1', guild.id);
        if(res.rows.length && res.rows[0]) {
            // Update clause if the row exists
            await this.#bot.db.query('update backups set jsonString = $1 where guildID = $2', JSON.stringify(data), guild.id)
        } else {
            // Creating a new row clause if the row does not initially exists
            await this.#bot.db.query('insert into backups (guildID, jsonString) values ($1, $2)', guild.id, JSON.stringify(data));
        }
    }

    public async loadGuild(guild: Guild): Promise<void> {
        this.#queue.add(guild.id);
        let roles = [...guild.roles.values()];
        // if(roles.sort((b , a) => a.position - b.position)[0].id !== this.#bot.user.id) {
        //     throw new Error('Bot does not have highest role in the server, cannot perform a server backup');
        // }
        for(let role of roles) {
            try {
                await role.delete().catch();
                await this.sleep(250);
            } catch (err) {
                continue
            }
        }
        let channels = [...guild.channels.values()];
        for(let ch of channels) {
            await ch.delete().catch();
            await this.sleep(250);
        }

        let backup = await this.getGuild(guild);
        if(!backup) {
            throw new Error('No backup is created, cannot perform a server backup');
        }

        await guild.edit({
            name: backup.name,
            icon: backup.iconURL
        }).catch();

        for (let role of backup.roles) {
            if(role.id === guild.id) continue;
            await guild.createRole({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions.allow,
                mentionable: role.mentionable,
                position: role.position,
            }).catch();
            await this.sleep(250);
        }

        for(let cat of backup.channels.categories) {
            let perms = cat.permissions.map(p => {
                let id = p.type === 'role' ? guild.roles.find(r => r.name === p.idOrName)!.id : guild.members.get(p.idOrName)!.id;
                if(!id) return;
                return {
                    id,
                    type: p.type,
                    allow: p.permission.allow,
                    deny: p.permission.deny,
                } as PermissionOverwrite
            }).filter(p => !!p) as PermissionOverwrite[];
            const category = await guild.createChannel(cat.name, 4, {
                permissionOverwrites: perms,
            }).catch();
            await this.sleep(250);
            for (let child of cat.children) {
                if(child.type === 'text') {
                    await guild.createChannel(child.name, 0, {
                        parentID: category.id,
                        rateLimitPerUser: child.rateLimitPerUser,
                    }).catch();
                } else {
                    await guild.createChannel(child.name, 2, {
                        parentID: category.id,
                        bitrate: child.bitrate,
                        userLimit: child.userLimit
                    }).catch();
                }
                await this.sleep(250);
            }

            for (let other of backup.channels.others) {
                if(other.type === 'text') {
                    await guild.createChannel(other.name, 0, {
                        parentID: category.id,
                        rateLimitPerUser: other.rateLimitPerUser,
                    }).catch();
                } else {
                    await guild.createChannel(other.name, 2, {
                        parentID: category.id,
                        bitrate: other.bitrate,
                        userLimit: other.userLimit
                    }).catch();
                }
                await this.sleep(250);
            }
        }
        this.#queue.delete(guild.id);
    }

    public async getGuild(guild: Guild): Promise<GuildBackupData | undefined> {
        const res = await this.#bot.db.query('select jsonString from backups where guildID = $1', guild.id);
        if(res.rows.length && res.rows[0]) {
            let data: GuildBackupData = JSON.parse(res.rows[0].jsonstring);
            return data;
        } else {
            return undefined;
        }
    }

    public isLoading(guild: Guild): boolean {
        return this.#queue.has(guild.id);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}
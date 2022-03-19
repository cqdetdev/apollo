import { Permission } from "eris"

export type BanData = {
    id: string;
    reason: string;
}

export type RoleData = {
    id: string;
    name: string;
    color: number,
    hoist: boolean,
    permissions: Permission;
    mentionable: boolean;
    position: number;
}

export type ChannelData = {
    categories: CategoryData[]
    others: Omit<ChildChannelData, "parent">[]
}

export type CategoryData = {
    id: string;
    name: string;
    permissions: PermissionData[],
    children: ChildChannelData[]
}

export type ChildChannelData = {
    id: string;
    type: "voice" | "text";
    name: string;
    bitrate?: number;
    userLimit?: number;
    rateLimitPerUser?: number;
    parent: string;
    permissions: PermissionData[]
}

export type PermissionData = {
    type: "member " | "role";
    idOrName: string;
    permission: Permission;
}

export type GuildBackupData = {
    id: string;
    name: string;
    iconURL: string;
    bans: BanData[]
    roles: RoleData[]
    channels: ChannelData
}
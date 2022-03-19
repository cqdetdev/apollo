import { Guild, Member, Role, User } from "eris";
import Base from "../structures/Base";

export default class PermissionManager extends Base {

	public isDeveloper(user: User) {
        ['522895569039917066'].includes(user.id);
	}

    public kickable(t: Member, m: Member): boolean {
        return (
            m.id == m.guild.ownerID || (
                t.id !== t.guild.ownerID &&
                m.permissions.has('kickMembers') &&
                (this.highestRole(m.guild, m)?.position ?? 0) > (this.highestRole(t.guild, t)?.position ?? 0)
            )
        )
    }

    public bannable(t: Member, m: Member): boolean {
        return (
            m.id == m.guild.ownerID || (
                t.id !== t.guild.ownerID &&
                m.permissions.has('banMembers') &&
                (this.highestRole(m.guild, m)?.position ?? 0) > (this.highestRole(t.guild, t)?.position ?? 0)
            )
        )
    }

    public highestRole(guild: Guild, member: Member): Role {
		let roles = member.roles.map((id: string) => guild.roles.get(id));
		roles = this.sortRoles(roles);
		return roles[0]!;
	}

    public sortRoles(roles: any): Role[] {
		return roles.size ?
			[...roles.values()].sort((r1: Role, r2: Role) =>
				(r1.position !== r2.position) ? r2.position - r1.position : <any>r1.id - <any>r2.id) :
				roles.sort((r1: Role, r2: Role) => (r1.position !== r2.position) ? r2.position - r1.position : <any>r1.id - <any>r2.id);
	}
}
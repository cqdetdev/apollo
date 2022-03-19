import { Message, Guild, Member } from "eris";
import Bot from "../Bot";
import Argument from "./Argument";

/**
 * Argument to parse to a Member
 */
export default class MemberArgument extends Argument {
  public constructor(client: Bot, position: number, required = true) {
    super(client, "member", position, required);
  }

  public parse(
    msg: Message,
    args: string[],
    guild: Guild,
  ): Member | undefined {
    if (!args[this.position] && this.required) {
      throw new Error("No member specified");
    } else if (!args[this.position] && !this.required) {
      return undefined;
    }
    const m: string = args[this.position].replace(
      new RegExp(`/${this.client.util.fmt.userRegex}/g`),
      "",
    );

    const member = guild.members.get(m) ??
      guild.members.find((member) =>
        member.nick
          ? !!member.nick.toLowerCase().startsWith(m.toLowerCase())
            ? member.nick.toLowerCase().startsWith(m.toLowerCase())
            : member.user.username.toLowerCase().startsWith(m.toLowerCase())
          : member.user.username.toLowerCase().startsWith(m.toLowerCase())
      ) ?? guild.members.get(msg.mentions[0]?.id);

    if (!member && this.required) {
      throw new Error("Cannot find specified member");
    }
    return member;
  }
}
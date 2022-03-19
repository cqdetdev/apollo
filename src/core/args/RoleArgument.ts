import { Message, Guild, Role } from "eris";
import Bot from "../Bot";
import Argument from "./Argument";

export default class RoleArgument extends Argument {
    public constructor(client: Bot, position: number, required = true) {
      super(client, "role", position, required);
    }
  
    public parse(
      _msg: Message,
      args: string[],
      guild: Guild,
    ): Role | undefined {
      if (!args[this.position] && this.required) {
        throw new Error("No role specified");
      } else if (!args[this.position] && !this.required) {
        return undefined;
      }
      const m = args[this.position];
  
      const role = guild.roles.get(m) ||
        guild.roles.find((role) => role.id === <string> m) ||
        guild.roles.find((role) =>
          role.name.toLowerCase().startsWith((<string> m).toLowerCase())
        );
  
      if (!role && this.required) {
        throw new Error("Cannot find specified role");
      }
  
      return role;
    }
  }
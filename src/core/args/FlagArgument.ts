import { Message, Guild } from "eris";
import Bot from "../Bot";
import Argument from "./Argument";

/**
 * Flag based argument:
 * ```txt
 * -f, --allow-all, --set-prefix
 * ```
 */
export default class FlagArgument extends Argument {
    public constructor(client: Bot, position: number, required = true) {
      super(client, 'flag', position, required);
    }
  
    public parse(
      _msg: Message,
      args: string[],
      _guild: Guild
    ): { name: string; value: string[] }[] {
      const list = args.slice(this.position);
      const flags: { name: string; value: string[] }[] = [];
      let tmp = '';
      for (let i of list) {
        if (i.startsWith('-')) {
          tmp = i;
          i = i.split('-')[1];
          flags.push({ name: i, value: [] });
        } else {
          let flag = flags.find((f) => f.name === tmp.split('-')[1]);
          if (!flag) continue;
          flag.value.push(i);
        }
      }
  
      return flags;
    }
  }
import Eris from "eris";
import Bot from "../Bot";
import Argument from "./Argument";

/**
 * Comma Seperated Values (CSV) Argument
 * ```txt
 * hello, world, csv, list
 * ```
 */
export default class CSVArgument extends Argument {
    public constructor(client: Bot, position: number, required = true) {
      super(client, "csv", position, required);
    }
  
    public parse(
      _msg: Eris.Message,
      args: string[],
      _guild: Eris.Guild,
    ): string[] | undefined {
      if (!args[this.position] && this.required) {
        throw new Error("List not specified");
      } else if (!args[this.position] && !this.required) {
        return undefined;
      }
  
      const list = args.join(" ").split(", ");
  
      list[list.length - 1] = list[list.length - 1].split(" ")[0]; // Case with FlagArguments
      return list;
    }
  }
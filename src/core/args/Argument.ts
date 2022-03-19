import { Message } from "eris";
import Bot from "../Bot";

/**
 * Base argument class
 */
export default abstract class Argument {
  protected client: Bot;
  public name: string;
  public position: number;
  public required: boolean;

  constructor(client: Bot, name: string, position: number, required: boolean) {
    this.client = client;
    this.name = name;
    this.position = position;
    this.required = required;
  }

  /**
   * Method to parse arguments through an `Argument` class
   * @param msg
   * @param args
   * @param additional
   */
  public abstract parse(
    msg: Message,
    args: string[],
    ...additional: unknown[]
  ): any;
}
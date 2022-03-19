import Bot from "../Bot";
import Base from "../structures/Base";

export default abstract class Task extends Base {
    name: string;
    #timeout: number;
    #t!: NodeJS.Timeout;
  
    public constructor(bot: Bot, name: string, timeout: number) {
      super(bot);
      this.name = name;
      this.#timeout = timeout;
    }
  
    public execute(): NodeJS.Timeout {
      return (this.#t = setInterval(async () => {
        await this.onRun();
      }, this.#timeout));
    }
  
    public cancel(): void {
      return clearInterval(this.#t);
    }
  
    protected abstract onRun(): Promise<void>;
  }
import { Client, Guild, Member, User, Channel } from "eris";
import Bot  from "../Bot";
import Base from "../structures/Base"

export default class RESTManager extends Base {
    #rest: Client;
    public constructor(bot: Bot) {
      super(bot);
      const opts = this.bot.options;
      opts.restMode = true;
      this.#rest = new Client(process.env.TOKEN!, opts);
    }
  
    public async resolveGuild(id: string): Promise<Guild> {
      return this.#rest.getRESTGuild(id);
    }
  
    public async resolveChannel<T extends Channel>(id: string): Promise<T> {
      return (<any>this.#rest.getRESTChannel(id)) as Promise<T>;
    }
  
    public async resolveMember(
      guildID: string,
      memberID: string
    ): Promise<Member> {
      return this.#rest.getRESTGuildMember(guildID, memberID);
    }
  
    public async resolveUser(id: string): Promise<User> {
      return this.#rest.getRESTUser(id);
    }
  }
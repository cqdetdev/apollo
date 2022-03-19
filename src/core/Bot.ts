import { Client, ClientOptions } from "eris";
import EventManager from "./event/EventManager";
import CommandHandler from "./command/CommandHandler";
import RESTManager from "./rest/RESTManager";
import TaskManager from "./task/TaskManager";
import Logger from "./util/Logger";
import Util from "./util/Util";
import Emojis from "./util/Emojis"

import Database from "./data/db/Database";
import Redis from "./data/cache/Redis";

import ARDE from "../modules/arde/ARDE";
import Backup from "../modules/backup/Backup";
import PermissionManager from "./permission/PermissionManager";


export type BotOptions = {
    eventManager: EventManager,
} & ClientOptions;

export default class Bot extends Client {
    public logger: Logger;
    public util: Util;
    public commandHandler: CommandHandler;
    public restManager: RESTManager;
    public taskManager: TaskManager;
    public eventManager: EventManager;
    public permissionManager: PermissionManager;
    public store: Map<any, any> = new Map();

    public db: Database;
    public redis: Redis;

    public arde: ARDE;
    public backup: Backup;

    public emojis: typeof Emojis

    public constructor(token: string, options: BotOptions) {
        super(token, options);
        this.logger = new Logger('MAIN');
        this.util = new Util();
        this.commandHandler = new CommandHandler(this);
        this.restManager = new RESTManager(this);
        this.taskManager = new TaskManager(this);
        this.eventManager = options.eventManager;
        this.eventManager.bot = this;
        this.permissionManager = new PermissionManager(this);

        this.db = new Database(this);
        this.redis = new Redis(this);
        
        this.arde = new ARDE(this);
        this.backup = new Backup(this);

        this.emojis = Emojis;
    }

    public async start(): Promise<void> {
        await this.commandHandler.dynLoadCommands();
        this.taskManager.start();
        await this.eventManager.registerListeners();
        await this.db.connect();
        await this.connect();
        await this.arde.listen();
    }
}
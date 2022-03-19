import Bot from "../Bot";
import Redis from "../data/cache/Redis";
import Database from "../data/db/Database";
import EventManager from "../event/EventManager";
import PermissionManager from "../permission/PermissionManager";
import RESTManager from "../rest/RESTManager";
import TaskManager from "../task/TaskManager";
import FMT from "../util/FMT";
import Logger from "../util/Logger";
import Util from "../util/Util";

export default class Base {
    protected bot: Bot;
    protected logger: Logger;

    public constructor(bot: Bot) {
        this.bot = bot;
        this.logger = new Logger(this.constructor.name);
    }

    public get eventManager(): EventManager {
        return this.bot.eventManager;
    }

    public get restManager(): RESTManager {
        return this.bot.restManager;
    }

    public get taskManager(): TaskManager {
        return this.bot.taskManager;
    }

    public get permissionManager(): PermissionManager {
        return this.bot.permissionManager;
    }

    public get util(): Util {
        return this.bot.util;
    }

    public get fmt(): FMT {
        return this.bot.util.fmt;
    }

    public get db(): Database {
        return this.bot.db;
    }

    public get redis(): Redis {
        return this.bot.redis;
    }
}
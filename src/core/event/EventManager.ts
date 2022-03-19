import { Bot } from "..";

export default abstract class EventManager {
    public bot!: Bot;

    public abstract registerListeners(): Promise<void>
}
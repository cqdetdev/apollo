import { Constants } from "eris";

type CommandPermission = keyof typeof Constants.Permissions;

export default CommandPermission;
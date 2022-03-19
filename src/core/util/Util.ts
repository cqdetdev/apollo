import { createHash } from "crypto";
import { User } from "eris";
import FMT from "./FMT";

export default class Util {
  #encoder: TextEncoder = new TextEncoder();
  #decoder: TextDecoder = new TextDecoder();
  public fmt: FMT = new FMT();
  public mentionRegex: RegExp = /[\\<>@#&!]/g;

  public tag(user: User): string {
    return `${user.username}#${user.discriminator}`;
  }

  public printf(str: string, ...args: any[]) {
    for (let arg of args) {
      str = str.replace("{}", arg);
    }
    console.log(str);
  }

  public clean(str: string): string {
    return str.replace(this.fmt.cleanRegex, "\\$&");
  }

  public toBase64(str: string): string {
    return btoa(str);
  }

  public fromBase64(str: string): string {
    return atob(str);
  }

  public encode(str: string): Uint8Array {
    return this.#encoder.encode(str);
  }

  public decode(arr: Uint8Array): string {
    return this.#decoder.decode(arr);
  }

  public toSHA256(str: string): string {
    return createHash("sha256").update(str).toString();
  }

  public getRandomString() {
    return Math.random().toString(36).substring(2, 7);
  }

  public getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  public toJSON(object: Object) {
    const json: any = {};
    for (let prop in object) {
      json[prop] = object[prop as keyof object];
      if (json[prop] instanceof Object) {
        json[prop] = this.toJSON(json[prop]);
      }
    }
    return json;
  }
}
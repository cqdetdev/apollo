export default class FMT {
    public colors = {
      red: 0xb51e0d,
      orange: 0xd67d00,
      yellow: 0xd6af00,
      green: 0x158209,
      cyan: 0x04b398,
      blue: 0x1661ab,
      purple: 0x7505ad,
      magenta: 0xad02ad,
    };
  
    public bold = "**";
    public italicize = "*";
    public underline = "__";
    public spoiler = "||";
    public code = "`";
  
    public channelRegex = new RegExp("{#([a-zA-Z0-9-_]+)}", "g");
    public roleRegex = new RegExp("{&([^}]+)}", "g");
    public userRegex = /[\\<>@#&!]/g;
    public cleanRegex = new RegExp("([_\*`])", "g");
  
    public join(...strings: string[]) {
      return strings.join("");
    }
  
    public toCamel(s: string): string {
      return s.replace(/(?:^\w|[A-Z]|\b\w)/g, (w: string, i: number) => {
        return i === 0 ? w.toLowerCase() : w.toUpperCase();
      }).replace(/\s+/g, "");
    }
  
    public toSnake(s: string): string {
      return s.replace(/\W+/g, " ")
        .split(/ |\B(?=[A-Z])/)
        .map((w) => w.toLowerCase())
        .join("_");
    }
  
    public toProper(s: string): string {
      return s.charAt(0).toUpperCase() + s.slice(1) + ".";
    }
  
    public toBold(s: string): string {
      return `**${s}**`;
    }
  
    public toItalicize(s: string): string {
      return `*${s}*`;
    }
  
    public toUnderline(s: string): String {
      return `__${s}__`;
    }
  
    public toSpoiler(s: string): string {
      return `||${s}||`;
    }
  
    public toCode(s: string): string {
      return `\`${s}\``;
    }
  }
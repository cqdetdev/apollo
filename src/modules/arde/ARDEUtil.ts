export default class ARDEUtil {
    public compareString(str1: string, str2: string): number {
        if(str1 === str2) return 1;
        if(str1.includes(str2)) return 1;
        return str1.match(`/${str2}/g`)?.length ?? 0;
    }
}
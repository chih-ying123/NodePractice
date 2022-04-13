import * as fs from 'fs';

export class Dir {

    public static Make(path: string): void {
        if (fs.existsSync(path)) return; // 路徑已包含物件
        fs.mkdirSync(path, { recursive: true });
    }

}
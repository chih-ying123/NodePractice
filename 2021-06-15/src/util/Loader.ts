const fs = require("fs");

export class Loader {

    public static GetENV<T>(path: string): T {
        if (!fs.existsSync(path)) return null;
        var data = JSON.parse(fs.readFileSync(path, 'utf8'));
        return data as any;
    }

}
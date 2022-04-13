import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

interface IRouter {
  Name: string;
  URI: string;
}

const router: IRouter[] = JSON.parse(fs.readFileSync("public/share/.router", "utf8"));

@Injectable()
export class AppService {

  GetRouter(): string {
    let res = router.map(x => `<a href="${x.URI}" target="_blank">${x.Name}</a>`);
    return res.join("</br>");
  }

}

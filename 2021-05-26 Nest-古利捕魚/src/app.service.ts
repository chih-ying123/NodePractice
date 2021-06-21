import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

interface IRouter {
  Name: string;
  URI: string;
}

// 思考… 加新專案都會異動到( 先這樣吧 by chris )
const router: IRouter[] =  JSON.parse(fs.readFileSync("public/share/.router", "utf8")) ;

@Injectable()
export class AppService {

  GetRouter(): string {
    let res = router.map(x => `<a href="${x.URI}" target="_blank">${x.Name}</a>`);
    return res.join("</br>");
  }

}

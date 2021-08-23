import * as fs from 'fs';
import { Common } from "src/util";
import { IEVOBetDataForDB } from './env.interface';

export class BetInfo {
    public static Template_BetInfo: string;
    public static dragontiger: string;

    public static init() {
        BetInfo.Template_BetInfo = fs.readFileSync("./src/evo/view/betinfo.html","utf8"); 
        BetInfo.dragontiger = fs.readFileSync("./src/evo/view/dragontiger.html","utf8");       
    }

    public static ToHtml(bet: IEVOBetDataForDB) {

        let startedAt = bet.startedAt.replace('T', ' ').replace('Z', '');
        let settledAt = bet.settledAt.replace('T', ' ').replace('Z', '');
        
        let items = {
            id: bet.id,
            gameType: bet.gameType,
            status: bet.status,
            settledAt: settledAt,
            playerId: bet.playerId,
            stake: bet.stake,
            payout: bet.payout,
            winlose: bet.winlose,
            transactionId: bet.transactionId,
            startedAt: startedAt
        };

        var dist = {
            items 
        }
        
/*
        if(!fs.existsSync("./src/evo/betinfo")) {
            fs.mkdir("./src/evo/betinfo", { recursive: true }, (err) => {
                if (err) throw err;
            });
        }
*/
        let output = Common.renderHtml(BetInfo.Template_BetInfo,  dist);
        //fs.writeFileSync("./src/evo/betinfo/"+bet.refNo+".html", output);
       return output;
        
    }

    public static ViewInfo(gameType, result) {

        let output = '123';

        if ( gameType === 'dragontiger'){
            let resultList = {
                dragon: result.dragon.score,
                tiger: result.tiger.score,
                outcome: result.outcome
            }
            var dist = {
                resultList 
            }
            
            output = Common.renderHtml(BetInfo.dragontiger,  dist);
        }

        return output;
        

    }
}


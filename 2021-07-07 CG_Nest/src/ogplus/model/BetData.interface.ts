export interface IBetData {
    id: number;
    membername: string;
    gamename: string;
    bettingcode: number;
    bettingdate: string;
    gameid: string;
    roundno: string;
    game_information: GameInformation;
    result: string;
    bet: string;
    winloseresult: string;
    bettingamount: number;
    validbet: number;
    winloseamount: number;
    balance: number;
    currency: string;
    handicap: null;
    status: string;
    gamecategory: string;
    settledate: string;
    remark: string;
    vendor_id: string;
}

export interface GameInformation {
    playerCards: string;
    bankerCards: string;
}

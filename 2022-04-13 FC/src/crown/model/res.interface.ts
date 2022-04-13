
export interface IResTheirData {
    agname: string;
    method: string;
    responeid: string;
    agid: string;
    wager_totalpage: number;
    page: number;
    respcode: string;
    wager_data: Result[];
    wager_cashout: Result[];
}

export interface token {
    respcode: string;
    method: string;
    aid: string;
    username: string;
    token: string;
    timestamp: string;
    status: string;
    responeid: string;
}
//一般單
export interface Result {
    id: string;
    oddsFormat: string;
    strong: string;
    gtype: string;
    degold: string;
    settle: string;
    mid: string;
    wingold_d: string;
    orderdate: string;
    wingold: string;
    gold: string;
    result: string;
    rtype: string;
    score: string;
    tname_home: string;
    gold_d: string;
    cashoutid: string;
    odds: string;
    wtypecode: string;
    currency: string;
    degold_d: string;
    adddate: string;
    order: string;
    cashout_d: string;
    tname_away: string;
    handicap: string;
    pname: string;
    IP: string;
    league: string;
    ioratio: string;
    rtypecode: string;
    members_vgold: string;
    ordertime: string;
    cashout: string;
    report_test: string;
    wtype: string;
    resultdetail: string;
    vgold: string;
    resultdate: string;
    result_score: string;
    username: string;
    cashoutdata: OrginalCashoutData;
}
export interface OrginalCashoutData {
    id: string;
    oddsFormat: string;
    strong: string;
    gtype: string;
    degold: string;
    settle: string;
    mid: string;
    wingold_d: string;
    orderdate: string;
    wingold: string;
    gold: string;
    result: string;
    rtype: string;
    score: string;
    tname_home: string;
    gold_d: string;
    cashoutid: string;
    odds: string;
    wtypecode: string;
    currency: string;
    degold_d: string;
    adddate: string;
    order: string;
    cashout_d: string;
    tname_away: string;
    handicap: string;
    pname: string;
    IP: string;
    league: string;
    ioratio: string;
    rtypecode: string;
    members_vgold: string;
    ordertime: string;
    cashout: string;
    report_test: string;
    wtype: string;
    resultdetail: string;
    vgold: string;
    resultdate: string;
    result_score: string;
    username: string;
}
//過關單
export interface IResParData {
    agname: string;
    method: string;
    responeid: string;
    agid: string;
    wager_totalpage: number;
    page: number;
    respcode: string;
    wager_data: ParResult[];
    wager_cashout: ParResult[];
}

export interface ParResult {
    id: string;
    gtype: string;
    degold: string;
    settle: string;
    parlay: string;
    mid: string;
    wingold_d: string;
    orderdate: string;
    wingold: string;
    gold: string;
    result: string;
    gold_d: string;
    cashoutid: string;
    odds: string;
    wtypecode: string;
    currency: string;
    degold_d: string;
    adddate: string;
    cashout_d: string;
    handicap: string;
    IP: string;
    ioratio: string;
    members_vgold: string;
    cashout: string;
    wtype: string;
    resultdetail: string;
    vgold: string;
    resultdate: string;
    username: string;
    parlaynum: number;
    parlaysub: Item[];
    cashoutdata: string;
}
export interface Item {
    oddsFormat: string;
    strong: string;
    gtype: string;
    tname_away: string;
    pname: string;
    league: string;
    ioratio: string;
    ordertime: string;
    orderdate: string;
    report_test: string;
    score: string;
    wtype: string;
    tname_home: string;
    resultdetail: string;
    wtypecode: string;
    result_score: string;
    order: string;
}

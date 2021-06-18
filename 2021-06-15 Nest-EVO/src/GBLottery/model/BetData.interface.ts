export class APIResponse {
    GB: Result;
}
export class Result {
    Result:betdata;
}
export class betdata {
    Method: string;
    Success: number;
    ReturnSet: ReturnSet;
}

export class ReturnSet {
    BetTotalCnt: string;
    BetTotalAmt: string;
    SettleList: SettleList[];
}
export class SettleList {
    SettleID: number;
    BetID: number;
    BetGrpNO: string;
    TPCode: string;
    GBSN: number;
    MemberID: string;
    CurCode: string;
    BetDT: string;
    BetType: string;
    BetTypeParam1: string;
    BetTypeParam2: string;
    Wintype: string;
    HxMGUID: string;
    InitBetAmt: number;
    RealBetAmt: number;
    HoldingAmt: number;
    InitBetRate: number;
    RealBetRate: number;
    PreWinAmt: number;
    BetResult: string;
    WLAmt: number;
    RefundAmt: number;
    TicketBetAmt: number;
    TicketResult: string;
    TicketWLAmt: number;
    SettleDT: string;
    KenoList: KenoList[];
    LottoList:[];
    SscList:[];
    PkxList: [];
    KsList: [];
    SportList: [];
}
export class KenoList {
    SettleOID: number;
    DetailID: number;
    SrcCode: string;
    DrawNo: string;
    OptCode: string;
    OptParam1: number;
    MaxRate: number;
    RealRate: number;
    DrawDT: string;
    OptResult: string;
    KenoBalls: KenoBalls[];
}
export class KenoBalls {
    SettleODID: number;
    BallID: number;
    BallNum: number;
    OptResult: string;
}
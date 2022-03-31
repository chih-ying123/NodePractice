//固定回傳資料
export class ParAPIResponse {
    SerialKey: string;
    Timestamp: string;
    Code: string;
    Message: string;
    Data: ParBetData[];
}
//混合過關細單資料
export class ParBetData {
    SourceName: string;
    Amt: string;
    AwayId: string;
    AwayScore: string;
    Choice: string;
    CreateTS: string;
    CurCode: string;
    DangerStatus: string;
    ExRate: string;
    FTScore: string;
    HAG: string;
    Hdp: string;
    HomeId: string;
    HomeScore: string;
    HTScore: string;
    IsBetHome: string;
    IsFH: string;
    IsHomeGive: string;
    IsRun: string;
    LeagueId: string;
    MatchGroupId: string;
    MatchId: string;
    Odds: string;
    ParDangerStatus: string;
    ParOdds: string;
    ParStatus: string;
    ParTransType: string;
    RefNo: string;
    RiskLose: string;
    RiskWin: string;
    SocTransId: string;
    SocTransParId: string;
    SpecialId: string;
    SportType: string;
    Status: string;
    TransDate: string;
    TransType: string;
    UpdateTS: string;
    WinAmt: string;
    WinRate: string;
    StateUpdateTs: string;
    AOSExcluding: string;
    HomeTeamName: string; //查詢的隊名塞進來
    AwayTeamName: string;
    LeagueName: string;
}




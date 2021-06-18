//固定回傳資料
export class APIResponse {
    SerialKey: string;
    Timestamp: string;
    Code: string;
    Message: string;
    Data: IBetData[];
}
//一般注單
export class IBetData {
    Id: string;
    SourceName: string;
    ReferenceNo: string;
    SocTransId: string;
    IsFirstHalf: string;
    TransDate: string;
    IsHomeGive: string;
    IsBetHome: string;
    BetAmount: string;
    Outstanding: string;
    Hdp: string;
    Odds: string;
    Currency: string;
    WinAmount: string;
    ExchangeRate: string;
    WinLoseStatus: string;
    TransType: string; //判斷是否是混合過關
    DangerStatus: string;
    MemCommission: string;
    BetIp: string;
    HomeScore: string;
    AwayScore: string;
    RunHomeScore: string;
    RunAwayScore: string;
    IsRunning: string;
    RejectReason: string;
    SportType: string;
    Choice: string;
    WorkingDate: string;
    OddsType: string;
    MatchDate: string;
    HomeTeamId: string;
    AwayTeamId: string;
    LeagueId: string;
    SpecialId: string;
    StatusChange: string;
    StateUpdateTs: string;
    MemCommissionSet: string;
    IsCashOut: string;
    CashOutTotal: string;
    CashOutTakeBack: string;
    CashOutWinLoseAmount: string;
    BetSource: string;
    AOSExcluding: string;
    MMRPercent: string;
    MatchID: string;
    MatchGroupID: string;
    BetRemarks: string;
    IsSpecial: string;
    //查詢的隊名塞進來
    HomeTeamName: string; 
    AwayTeamName: string;
    LeagueName: string;
    //查詢球賽結果塞進來
    HTHomeScore: string;
    HTAwayScore: string;
}



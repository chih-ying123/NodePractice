export interface IEnv {
    apiURI: string;
    channelId: string;
    key: string;
    iv: string;
}

export interface IAPIResponse{
    errorCode: number;
    data: IData[];
}

export interface IData{
    SerialNumber: number;
    GameType: string;
    LogTime: string;
    BetMoney: number;
    MoneyWin: number; 
    NormalWin: number;
    BonusWin: number;
    JackpotMoney: number;
    ThirdPartyAccount: string;
    ValidBet: number;
    Device: string;
    IPAddress: string;
    WinLose: number;
}


export interface IResponse {
    ErrorCode: string;
    Message: string;
    Data: ResponseList;
}
export interface ResponseList {
    Result: Result[];
    Pagination: Pagination;
}
export interface Result {
  Account: string;
  WagersId: number;
  GameId: number;
  WagersTime: string;
  BetAmount: number;
  PayoffTime: string;
  PayoffAmount: number;
  Status: number;
  SettlementTime: string;
  GameCategoryId: number;
  VersionKey: number;
  Jackpot: number;
  Type: number;
}
//int 是 number嗎?
export interface Pagination {
    CurrentPage: number;
    TotalPages: number;
    PageLimit: number;
    TotalNumber: number;
}
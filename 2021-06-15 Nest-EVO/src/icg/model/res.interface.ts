
export interface IResponse {
    data: ResponseList[];
    page: number;
    pageSize: number;
    totalSize: number;
}
export interface ResponseList {
    id: string;
    createdAt: string;
    updatedAt: string;
    player: string;
    playerId: number;
    parent: string;
    parentId: number;
    game: string;
    gameId: string;
    setId: string;
    productId: string;
    currency: string;
    gameType: string;
    status: string;
    win: number;
    bet: number;
    validBet:number;
}

export interface Token{
    data:[];
    token:string;
    permissions:[];
}

export interface ErrorMsg {
    error: ErrorData[];
}
export interface ErrorData{
    status: string;
    message: string;
    ip: string;
}
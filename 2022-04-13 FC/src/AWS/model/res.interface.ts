
export interface IResTheirData {
    msg: string;
    code: number;
    data: Data[];
}

export interface Data {
    totalSize: number;
    items: Item[];
    beginTime: string;
    endTime: string;
}
export interface Item {
    username: string;
    orderId: number;
    stake: number;
    bet: number;
    win: number;
    balanceBefore: number;
    balanceAfter: number;
    operationType: string;
    operationId: number;
    betTime: string;
    cnGameName: string;
    enGameName: string;
    device: number;
    gameId: string;
    finalView: string;
    txnId: string;
    currency: string;
}


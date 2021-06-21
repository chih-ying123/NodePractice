export interface IResTheirData {
    totalCount:         number;
    items:              Item[];
    totals:             Totals;
    generationDateTime: string;
}

export interface Item {
    agentId:             string;
    agentName:           string;
    casinoPlayerId:      string;
    casinoId:            string;
    playerName:          string;
    gameDate:            string;
    gameStartDate:       string;
    gameNumber:          number;
    gameName:            string;
    gameId:              string;
    gameNameId:          string;
    bet:                 number;
    win:                 number;
    payout:              number;
    jpBet:               number;
    jpWin:               number;
    currency:            string;
    roundId:             string;
    balanceStart:        number;
    balanceEnd:          number;
    platform:            string;
    externalGameId:      number;
    sideBet:             number;
    featureContribution: number;
    featurePayout:       number;
    featureTypeName:     null|string;
    scatterWon:          null|string;
    winLossAmount:       number;
    gameTechnologyId:    number;
    betIpAddress:        string;
    id:                  number;
}

export interface JackpotDetail {
    jpType: null | string;
    jpBet:  number;
}

export interface Totals {
}
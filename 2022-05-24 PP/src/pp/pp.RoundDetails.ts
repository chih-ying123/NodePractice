const template = {};

template["701"] = function(jsondata){
    let bet = [];
    for(let i=0; i< jsondata.bets.length; i++){
        bet.push(jsondata.bets[i].c)
    };
    let allBet = bet.join(',');
    
    return `Bet:${allBet}, Result:${jsondata.result}`
}

template["1101"] = function(jsondata){
    let bet = [];
    for(let i=0; i< jsondata.bets.length; i++){
        bet.push(jsondata.bets[i].c)
    };
    let allBet = bet.join(',');
    
    return `Bet:${allBet}, Result:${jsondata.result}`
}

template["558"] = function(jsondata){
    
    let result = [];

    // Spade 黑桃 , Heart 紅心 , Diamond 方塊 , Club 梅花
    if (jsondata.result.S1H0) {
        let seat1 = jsondata.result.S1H0.replace('S','Spade').replace('H','Heart').replace('D','Diamond').replace('C','Club');
        result.push(`seat1: ${seat1}`)
    }
    if (jsondata.result.S1H1) {
        let seat1_1 = jsondata.result.S1H1.replace('S','Spade').replace('H','Heart').replace('D','Diamond').replace('C','Club');
        result.push(`seat1-1: ${seat1_1}`)
    }
    if (jsondata.result.S2H0) {
        let seat2 = jsondata.result.S2H0.replace('S','Spade').replace('H','Heart').replace('D','Diamond').replace('C','Club');
        result.push(`seat2: ${seat2}`)
    }
    if (jsondata.result.S2H1) {
        let seat2_1 = jsondata.result.S2H1.replace('S','Spade').replace('H','Heart').replace('D','Diamond').replace('C','Club');
        result.push(`seat2-1: ${seat2_1}`)
    }
    if (jsondata.result.D) {
        let D = jsondata.result.D.replace('S','Spade').replace('H','Heart').replace('D','Diamond').replace('C','Club');
        result.push(`Dealer: ${D}`)
    }
   
    console.log(`${result.join('\n')}`); //數字跟花色黏在一起 明天調
    
    return `Result:${result.join('\n')}`
}

export default template;
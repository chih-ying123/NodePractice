var aes256Cryto = require("./aes256Encryption");
const fetch = require("node-fetch");

// for test
var str = `{
    "startTime":"2018-06-24T00:00:00.646+01:00",
    "endTime":"2018-06-26T23:59:59.646+01:00",
    "method":"data"
    }
    `;
var key = 'Pf9t8OaUDC4sjWxFZ3HKfnE3wSAIValVqtwOqLdtCw4=';
var iv = 'MJ2MTl6sSHYLLmdu4T5Hxg==';

//加密
afterEncrypted = aes256Cryto.Encrypt(str, key, iv);
console.log('encrypt->',afterEncrypted);

//解密
afterDecrypted = aes256Cryto.Decrypt( '2B+c+9POrpA93BqEC/70pU9aKZ5FcYLCw1SnYfLaZFqTuiImDxB3m7h7Ss7Yv2gv', key, iv);
console.log('decrypt->',afterDecrypted);



//連API
let postStr = {
    channelId: 77668
    , data: afterEncrypted
}

let fetchHeader = {
      method: 'post'
    , headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    , body: `{
          channelId:77668
        , data:${afterEncrypted}
    }`
}

async function fetchAPI() {

    let response = await fetch(`http://testenv-dev.cg11systems.com/client/api/getGameRecord.php`,fetchHeader);
    let jsonData = await response.json();
    console.log (jsonData);

}

fetchAPI()



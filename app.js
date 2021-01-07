const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
// const fullNode = new HttpProvider("http://192.168.1.162:8090");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
const privateKey = "dd84514bed5f2c0391536105157cb79c6e5df981ca9d7ca2e523435803e5d0ca";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);


const CONTRACT = "TYcpHdZTw9sBM4GXFfb83rkpDyWfXvrpHj"; // USDT
const ACCOUNT = "TLf33GZGbTP8Yda7Sksi1XhYVKBJpCmWuE";
const ASSETHASH= "TTKAMJf48xGDrk83oPwfQ4YF2UwC5PpcJy"
const TOADDR = "0x4a03aaf03d12fd4d46bfcc260bda73ecef33b83b"

async function main() {
  let {
    transaction,
    result
  } = await tronWeb.transactionBuilder.triggerSmartContract(
      CONTRACT, 'lock(address,string memory,uint256)', {
        feeLimit: 1000000000,
        callValue: 0
      },
      [ {
        type: 'address',
        value: ASSETHASH
      },{
        type: 'string',
        value: TOADDR
      }, {
        type: 'uint256',
        value: 100
      }]
  );
  if (!result.result) {
    console.error("error:", result);
    return;
  }
  console.log("transaction =>", JSON.stringify(transaction, null, 2));

  const signature = await tronWeb.trx.sign(transaction.raw_data_hex);
  console.log("Signature:", signature);
  transaction["signature"] = [signature];

  const broadcast = await tronWeb.trx.sendRawTransaction(transaction);
  console.log("result:", broadcast);

  const {
    message
  } = broadcast;
  if (message) {
    console.log("Error:", Buffer.from(message, 'hex').toString());
  }
}

main().then(() => {
  console.log("ok");
})
    .catch((err) => {
      console.trace(err);
    });

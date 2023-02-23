import dotenv from "dotenv";
import { 
  Keypair, 
  Server, 
  TransactionBuilder, 
  Networks, 
  Operation, 
  Asset, 
  BASE_FEE
} from "stellar-sdk";

dotenv.config({ path: ".env.local" });

const ACCOUNT_SECRET_KEY = process.env.ACCOUNT_SECRET_KEY as string;
const URL_SERVER = process.env.URL_SERVER || "https://horizon-testnet.stellar.org";

const questKeypair = Keypair.fromSecret(ACCOUNT_SECRET_KEY);
const ACCOUNT_DESTINATION_PUBLIC_KEY = process.env.ACCOUNT_DESTINATION_PUBLIC_KEY as string;

(async () => {
  const server = new Server(URL_SERVER);
  const questAccount = await server.loadAccount(questKeypair.publicKey());

  const transaction = new TransactionBuilder(
    questAccount,
    {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    },
  ).addOperation(
    Operation.payment({
      destination: ACCOUNT_DESTINATION_PUBLIC_KEY,
      asset: Asset.native(),
      amount: "100",
    }),
  ).setTimeout(30).build();
  
  transaction.sign(questKeypair);

  try {
    const res = await server.submitTransaction(transaction);
    console.log(`The transaction is successful! Hash: ${res.hash}`);
  } catch (error: any) {
    console.log(`${error}. More details:\n ${JSON.stringify(error.response.data.extras, null, 2)}`);
  }
})(); 
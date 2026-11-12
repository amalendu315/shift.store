import dotenv from 'dotenv';
dotenv.config({path:'.env.local',quiet:true});
import {randomUUID} from 'node:crypto';
import {createCashfreeProvider} from '../backend/cashfree.ts';
if(process.env.CASHFREE_ENV!=='sandbox')throw new Error('This diagnostic only runs in sandbox.');
if(!process.env.CASHFREE_APP_ID||!process.env.CASHFREE_SECRET_KEY)throw new Error('Missing test credentials.');
const provider=createCashfreeProvider({appId:process.env.CASHFREE_APP_ID,secret:process.env.CASHFREE_SECRET_KEY,mode:'sandbox'});
try{
 const id=randomUUID();
 const session=await provider.createPayment({orderId:id,amount:100,currency:'INR',idempotencyKey:randomUUID(),customer:{name:'ShiftStore Sandbox Test',phone:'9999999999',email:'sandbox@example.com'},returnUrl:'http://localhost:3000/payment-return?order_id='+id});
 const result=await provider.getPayment!(id);
 console.log(JSON.stringify({environment:'sandbox',created:!!session.sessionId,verifiedAmount:result.amount,status:result.status,referenceMatches:session.reference===id}));
}catch(error:any){console.error(error.message);process.exitCode=1;}

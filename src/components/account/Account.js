import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { getBalance } from '../services/service';
import { Button } from 'antd';
import { withdrawAmount } from '../services/service';
import { useSelector } from 'react-redux';

export const Account = (props) => {
    const [balance, setBalance] = useState(0);

    const contractAbi = useSelector(state => state.reducer.contract);
    const contractAddress = useSelector(state => state.reducer.contractAddress);
    const currentAddress = useSelector(state => state.reducer.currentAddress);

    useEffect(async () => {
        if(props.address)
          {
             await checkBalance()
          }
      },[props.address]);

      const checkBalance = async () => {
            const balanceResponse = await getBalance(props.address)
            setBalance(balanceResponse)
      }

      const withdrawFund = async () => {
          const withdrawResponse = await withdrawAmount(contractAbi,currentAddress)
          await withdrawEvent(contractAbi,contractAddress,props.account)
      }

      const withdrawEvent = async (contract,contractAdd,account) => {
        contract.events.Withdraw({},{
          fromBlock:0,
          toBlock:'latest',
          address:contractAdd
        },
          function(error, event)
            { 
              // console.log({event:event}); 
            }).on('data', async function(event){
                //console.log({onData:event}); // same results as the optional callback above
                if(event.returnValues._from == account){
                  //console.log({success:event.returnValues})
                  await checkBalance()
                } 
              })
              .on('changed', function(event){
                console.log({onChanged:event}); // remove event from local database
              })
              .on('error', console.error);
          }

    return (
        <div style={{paddingTop:'20px'}}>
            <Card className="text-center">
                <Card.Header>{props.type}</Card.Header>
                <Card.Body>
                    <Card.Title>{props.userName}</Card.Title>
                    <Card.Text>
                        Address {props.address}
                    </Card.Text>
                    {/* <Button variant="primary">Go somewhere</Button> */}
                </Card.Body>
                <Card.Footer className="text-muted">
                    <div>Balance {balance} ETH</div>
                    {props.isContract && balance>0 ? 
                            <Button onClick={withdrawFund} type="primary" >
                                Withdraw Amount
                            </Button> : null}
                
                </Card.Footer>
            </Card>
        </div>
    )
}

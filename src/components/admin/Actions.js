import { message, Result } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { approveSlot, fetchBookPlace, rejectApproval } from '../services/service'
import { SmileOutlined } from '@ant-design/icons';
import { CardInfo } from './CardInfo';


export const Actions = (props) => {

    const contractAbi = useSelector(state => state.reducer.contract);
    const ownerAddress = useSelector(state => state.reducer.ownerAddress);
    const currentAddress = useSelector(state => state.reducer.currentAddress);
    const contractAddress = useSelector(state => state.reducer.contractAddress);
  
    const [pending, setPending] = useState([]);

    useEffect( async () => {
        if(ownerAddress && contractAbi && currentAddress){
           await fetchDetails();
        }
    },[])

    const fetchDetails = async () => {
        if(props.totalBookings > 0){
            let response
            let pendingBookings = []
            for (var i = 1; i <= props.totalBookings; i++) {
                response = await getBooking(i)
                if(!response._isApproved && !response._isRejected)
                    pendingBookings.push({id:i,
                                    name:response._name,
                                    isApproved:response._isApproved,
                                    isRejected:response._isRejected,
                                    place:response._placeName,
                                    rating:parseInt(response._rating),
                                    remainingSlots:parseInt(response._remaining)})
              }
              setPending(pendingBookings)
        }
    }

    const getBooking = async (bookingId) => {
        const respBooking = await fetchBookPlace(contractAbi,bookingId)
        return respBooking
    }

    const approveBooking = async (bookingId) => {
        const result = pending.filter(booking => booking.id == bookingId);
        if(result[0].remainingSlots > 0)
        {
            const approveResponse = await approveSlot(contractAbi,bookingId,currentAddress)
            await eventApprove(contractAbi,contractAddress,currentAddress,bookingId)
        }
        else{
            message.error('Parking Full... No Slot available');
        }

    }

    const eventApprove = async (contract,contractAddress,account,bookingId) => {
        contract.events.Approved({},{
            fromBlock:0,
            toBlock:'latest',
            address:contractAddress
        },
            function(error, event)
            { 
                // console.log({event:event}); 
            }).on('data', function(event){
                //console.log({id:bookingId,onData:parseInt(event.returnValues._id),address:account,contract:event.returnValues._user}); // same results as the optional callback above
                if((event.returnValues._user == account) && (parseInt(event.returnValues._id) == bookingId)){
                        // console.log({success:event.returnValues})
                        fetchDetails();
                        props.getInfo();
                    } 
                })
                .on('changed', function(event){
                console.log({onChanged:event}); // remove event from local database
                })
                .on('error', console.error);
            }

    const rejectBooking = async (bookingId) => {
        const approveResponse = await rejectApproval(contractAbi,bookingId,currentAddress)
        await eventApprove(contractAbi,contractAddress,currentAddress,bookingId)
    }
    
    return (
        <div style={{ display:"flex","flex-direction": "row", "flex-wrap": "wrap"}}>
                
                {pending.length ? (pending.map(booking =>
                            <CardInfo current={booking} key={booking.id} approve={approveBooking} reject={rejectBooking} />
                        )) :  
                
                <Result
                    icon={<SmileOutlined />}
                    title="Great, you have done all the operations! No Pending Approvals"
                />
                        
                }
         
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchBookPlace, fetchUserInfo } from '../services/service'
import { SmileOutlined } from '@ant-design/icons';
import { message, Result } from 'antd'
import { BookingCard } from '../BookingCard'

export const Bookings = (props) => {

    const contractAbi = useSelector(state => state.reducer.contract);
    const ownerAddress = useSelector(state => state.reducer.ownerAddress);
    const currentAddress = useSelector(state => state.reducer.currentAddress);
    const contractAddress = useSelector(state => state.reducer.contractAddress);
  
    const [bookings, setBookings] = useState([]);

    useEffect( async () => {
        if(ownerAddress && contractAbi && currentAddress){
           await fetchDetails();
        }
    },[])

    const fetchDetails = async () => {
        const userInfo = await fetchUserInfo(contractAbi,currentAddress)

        if(userInfo.userBookings.length){
            let userBookings = userInfo.userBookings.map((i) => Number(i))
            
            if(userBookings.length > 0){
            let response
            let allBookings = []
            for (var i = 0; i < userBookings.length; i++) {
                response = await getBooking(userBookings[i])
                allBookings.push({id:userBookings[i],
                    name:response._name,
                    isApproved:getStatus(response),
                    place:response._placeName,
                    rating:parseInt(response._rating),
                    })
                // if(response._isApproved || response._isRejected){
                   
                // }
              }
              setBookings(allBookings)
            }
        }
    }

    const getStatus = (result) => {
        let status = 'Pending Approval'
        if(result._isApproved) status = 'Approved'
        if(result._isRejected) status = 'Rejected'
        return status
    }

    const getBooking = async (bookingId) => {
        const respBooking = await fetchBookPlace(contractAbi,bookingId)
        return respBooking
    }

    return (
        <div  style={{ display:"flex","flex-direction": "row", "flex-wrap": "wrap"}}>
                    
                    {bookings.length ? (bookings.map(booking =>
                        
                            <BookingCard current={booking} key={booking.id}/>
                        ))
                  :
            
                    <Result
                        icon={<SmileOutlined />}
                        title="Great, you have Done No Bookings Yet! "
                    />
        }
          
        </div>
    )
}

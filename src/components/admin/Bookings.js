import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { fetchBookPlace } from '../services/service'
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
        if(props.totalBookings > 0){
            let response
            let allBookings = []
            for (var i = 1; i <= props.totalBookings; i++) {
                response = await getBooking(i)

                if(response._isApproved || response._isRejected){
                    allBookings.push({id:i,
                        name:response._name,
                        isApproved:response._isApproved ? 'Approved' : 'Rejected',
                        place:response._placeName,
                        rating:parseInt(response._rating),
                        })
                }
                    
              }
              setBookings(allBookings)
        }
    }

    const getBooking = async (bookingId) => {
        const respBooking = await fetchBookPlace(contractAbi,bookingId)
        return respBooking
    }

    return (
        <div  style={{ display:"flex","flex-direction": "row", "flex-wrap": "wrap" }}>
                    
                    {bookings.length ? (bookings.map(booking =>
                        
                            <BookingCard current={booking} key={booking.id}/>
                        ))
                  :
            
              <Result
                  icon={<SmileOutlined />}
                  title="Sorry. Could not find any Previous Bookings"
              />
        }
          
        </div>
    )
}

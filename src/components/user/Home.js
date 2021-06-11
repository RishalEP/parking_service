import { Result,Button,Form,Select, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Account } from '../account/Account'
import { bookSlot, getTotalBookings, fetchUserInfo ,exitParking , fetchBooking ,getTotalPlaces, fetchPlaceInfo } from '../services/service';
import { SmileOutlined,FieldNumberOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import ReactStars from "react-rating-stars-component";

const layout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 10 },
};


export const Home = (props) => {
    const { Option } = Select;

    const contractAbi = useSelector(state => state.reducer.contract);
    const ownerAddress = useSelector(state => state.reducer.ownerAddress);
    const currentAddress = useSelector(state => state.reducer.currentAddress);
    const contractAddress = useSelector(state => state.reducer.contractAddress);

    const [totalBookings, setTotalBookings] = useState(0);

    const [totalPlaces, setTotalPlaces] = useState(0);
    const [remaining, setRemaining] = useState(5);
    const [bookingId, setBookingId] = useState(null)

    const [user, setUser] = useState({userName:'',isReserved:false,userBookings:[]});
    const [bookingInfo, setBookingInfo] = useState({isApproved:false,isPaid:false});
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRating, setCurrentRating] = useState(3);

    const [places, setPlaces] = useState([])



    const getPlaces = async() => {
      const placesCount = await getTotalPlaces(contractAbi);
      const toInt = parseInt(placesCount)
      setTotalPlaces(parseInt(toInt))

      if(toInt > 0){
        let response
        let placesInformation = []
        let tempResult = null
        for (var i = 1; i <= toInt; i++) {
            response = await fetchPlaceInfo(contractAbi,i)
            tempResult = {
              id:i,
              name:response._name,
              remaining:response._remaining,
              total:response._total,
              bookings:response._userBookings
            }
            if(tempResult && !(placesInformation.includes(tempResult)))
                placesInformation.push(tempResult)
          }
          setPlaces(placesInformation)
      }
   
    }

    const ratingChanged = (newRating) => {
      console.log({newRating:newRating})
    }


    useEffect(async () => {
        if(ownerAddress && contractAbi && currentAddress)
          {
            await fetchCurrentInfo()
          }
      },[currentAddress]);

      const fetchCurrentInfo = async () => {

            props.checkUser()
            await getPlaces();

            const userResponse = await fetchUserInfo(contractAbi,currentAddress)
            const userInfo = {
              userName:userResponse.name,
              isReserved:userResponse.isReserved,
              userBookings:userResponse.userBookings.map((i) => Number(i))  
            }
            setUser(userInfo)
            
            const totalBooking = await getTotalBookings(contractAbi)
            setTotalBookings(parseInt(totalBooking))
            
            if(userInfo.userBookings.length){
              setBookingId(Math.max(...userInfo.userBookings))
              const bookingResult = await fetchBooking(contractAbi,Math.max(...userInfo.userBookings))
              setBookingInfo({isApproved:bookingResult.isApproved,isPaid:bookingResult.isPaid})
            }
            
      }

      const bookParking = async (placeId) => {
        const bookResult = await bookSlot(contractAbi,currentAddress,placeId)
        await eventBook(contractAbi,contractAddress,currentAddress)

      }

      const leaveParking = async () => {
        const bookResult = await exitParking(contractAbi,bookingId,currentRating,currentAddress)
        setModalVisible(false)
        await eventLeave(contractAbi,contractAddress,currentAddress)

    }
    
      const eventBook = async (contract,contractAddress,account) => {
        contract.events.Book({},{
          fromBlock:0,
          toBlock:'latest',
          address:contractAddress
        },
          function(error, event)
            { 
              // console.log({event:event}); 
            }).on('data', function(event){
                console.log({onData:event}); // same results as the optional callback above
                if(event.returnValues._from == account){
                  console.log({success:event.returnValues})
                  fetchCurrentInfo();
                } 
              })
              .on('changed', function(event){
                console.log({onChanged:event}); // remove event from local database
              })
              .on('error', console.error);
          }

      const eventLeave = async (contract,contractAddress,account) => {
        contract.events.Leave({},{
            fromBlock:0,
            toBlock:'latest',
            address:contractAddress
        },
            function(error, event)
            { 
                // console.log({event:event}); 
            }).on('data', function(event){
                //console.log({onData:event}); // same results as the optional callback above
                if((event.returnValues._user == account) && event.returnValues._id == bookingId){
                    console.log({success:event.returnValues})
                    fetchCurrentInfo();
                } 
                })
                .on('changed', function(event){
                console.log({onChanged:event}); // remove event from local database
                })
                .on('error', console.error);
            }

     

      const onFinish = async (values) => {
        const result = places.filter(place => place.id == values.placeId);
        if(result[0].remaining > 0){
          await bookParking(result[0].id)
        }
        else{
          message.error('Parking Full At the selected Place');
        }
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
      

    return (
        <div>
            <Account 
                type={'User Account Information'}
                userName={user.userName}
                isReserved={user.isReserved}
                address={currentAddress}
                isContract={false}
            />
            {(!user.isReserved) ? 

                      <Form
                        style={{paddingTop:'35px'}}
                        {...layout}
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        >
                        <Form.Item
                          label="Place For Parking"
                          name="placeId"
                          rules={[{ required: true, message: 'Please Select a Place For Booking' }]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Place"
                                optionFilterProp="children"
                                // filterOption={(input, option) => {
                                //   return (
                                //     option?.children
                                //       .toLowerCase()
                                //       .indexOf(input.toLowerCase()) >= 0
                                //   );
                                // }}
                              >
                                {places &&
                                  places.map((item) => {
                                    return (
                                      <Option key={item.id} value={item.id}>
                                        {item.name}
                                      </Option>
                                    );
                                  })}
                              </Select> 
                      </Form.Item>
                      <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                          Book Now & Pay Later
                        </Button>
                      </Form.Item>
                    </Form>
              : 
                <div>
                    <Result
                                icon={<SmileOutlined />}
                                title= {"Your Current Booking ID : " + bookingId}
                                subTitle={bookingInfo.isApproved ? 'Approved by Owner':'Pending Approval From Owner'}
                                extra={<Button type="primary" disabled={!bookingInfo.isApproved} onClick={() => setModalVisible(true)}>Pay & Leave</Button>}
                      />

                              <Modal
                                        title="Thank You & Come Again"
                                        centered
                                        visible={modalVisible}
                                        okText='Confirm'
                                        onOk={() => leaveParking()}
                                        onCancel={() => setModalVisible(false)}
                                      >
                                        <p>Feel Free to Rate Us</p>
                                        <ReactStars
                                            count={5}
                                            isHalf={false}
                                            onChange={ratingChanged}
                                            size={24}
                                            value={currentRating}
                                            activeColor="#ffd700"
                                          />
                              </Modal>
                </div>
            }
        </div>
    )
}

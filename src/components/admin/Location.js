import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox, InputNumber } from 'antd';
import { addPlace, fetchPlaceInfo, getTotalPlaces } from '../services/service';
import { PlacesInfo } from './PlacesInfo';


const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 16,
      },
      sm: {
        span: 8,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

export const Location = (props) => {

    const [form] = Form.useForm();

    const currentAddress = useSelector(state => state.reducer.currentAddress);
    const contractAddress = useSelector(state => state.reducer.contractAddress);
    const contractAbi = useSelector(state => state.reducer.contract);
    const ownerAddress = useSelector(state => state.reducer.ownerAddress);

    const [places, setPlaces] = useState([])

    useEffect(async () => {
        if(ownerAddress && contractAbi && currentAddress)
          {
           await fetchDetails();
          }
      },[]);

      const fetchDetails = async () => {
        const placesCount = await getTotalPlaces(contractAbi)
        let noOfPlaces = parseInt(placesCount)

        if(noOfPlaces){
            
            let response
            let placesInformation = []
            let tempResult = null
            for (var i = 1; i <= noOfPlaces; i++) {
                response = await getPlace(i)
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

    const getPlace = async (placeId) => {
        const respBooking = await fetchPlaceInfo(contractAbi,placeId)
        return respBooking
    }

    const eventNewPlace = async (contract,contractAddress,account) => {
        contract.events.RegisterPlace({},{
            fromBlock:0,
            toBlock:'latest',
            address:contractAddress
        },
            function(error, event)
            { 
                // console.log({event:event}); 
            }).on('data', function(event){
                //console.log({id:bookingId,onData:parseInt(event.returnValues._id),address:account,contract:event.returnValues._user}); // same results as the optional callback above
                if((event.returnValues._from == account) && (parseInt(event.returnValues._id) > places.length)){
                        // console.log({success:event.returnValues})
                        fetchDetails();
                    } 
                })
                .on('changed', function(event){
                console.log({onChanged:event}); // remove event from local database
                })
                .on('error', console.error);
            }

    const slotCheck = (_, value) => {
        if (!value) {
            return Promise.resolve();
        }
        if (value && value.replace(/[^0-9]/gi)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Please input valid phone number! "));
        };

    const onFinish = async (values) => {
        const addPlaceResponse = await addPlace(contractAbi,values.locationName,values.totalSlots,currentAddress);
        console.log({addPlaceResponse:addPlaceResponse})
        await eventNewPlace(contractAbi,contractAddress,currentAddress)
    }

    return (
        <div>   
            <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                <h2 style={{display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingBottom:'20px'}}> Place Registration</h2>
                <Form.Item
                    name="locationName"
                    label="Location Name"
                    tooltip="How do you want Others to call this location"
                    rules={[
                    {
                        required: true,
                        message: 'Please input the Location Name!',
                        whitespace: true,
                    },
                    ]}
                >
                <Input />
            </Form.Item>

            <Form.Item
                        name="totalSlots"
                        tooltip="How many parkings available here ?"
                        label="No of slots"
                        rules={[
                          {
                            required: true,
                            message: "Please input the total available slots",
                          },
                        //   {
                        //     validator: slotCheck,
                        //     message: "Please input valid number of slots! ",
                        //   },
                        ]}
                      >
                        <InputNumber min={1} />
                      </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                        Register
                        </Button>
                    </Form.Item>
                </Form>  


                <h2>Current Locations</h2>
                <div style={{ paddingTop:'25px',display:"flex","flex-direction": "row", "flex-wrap": "wrap",justifyContent:'space-between'}}>
                {places.length ? (places.map(place =>
                            <PlacesInfo current={place} key={place.id} />
                        )) :  
                
                    null      
                }
            </div>
        </div>
    )
}

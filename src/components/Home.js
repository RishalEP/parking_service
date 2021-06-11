import React, { useContext, useEffect } from 'react'
import { Button, message } from 'antd';
import { history } from './helpers';
import { useSelector } from 'react-redux';

export const Home = (props) => {

    const ownerAddress = useSelector(state => state.reducer.ownerAddress);
    const currentAddress = useSelector(state => state.reducer.currentAddress);

    const onAdmin = async () => {
        if(currentAddress == ownerAddress)
            history.push("/admin");
        else
            message.error('OOPS... Only Admin is suppose to use the admin panel');
    }

    const onUser = async () => {
        if(currentAddress != ownerAddress)
            history.push("/user");
        else
            message.error('OOPS... Admin user not suppose to use the user panel');
    }

    return (
        <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop:'300px'
            }}
        >
        <Button onClick={onAdmin} style={{width:'180px',height:'60px',fontWeight:'bold'}} type="primary" >
              Admin Panel
        </Button>

        <Button onClick={onUser} style={{marginLeft:'10px', width:'180px',height:'60px',fontWeight:'bold'}} type="primary" >
              User Panel
        </Button>

      </div>
    )
}

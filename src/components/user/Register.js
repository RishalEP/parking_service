import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { registerUser } from '../services/service';

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

export const Register = (props) => {
  const [form] = Form.useForm();

  const contractAbi = useSelector(state => state.reducer.contract);
  const ownerAddress = useSelector(state => state.reducer.ownerAddress);
  const currentAddress = useSelector(state => state.reducer.currentAddress);
  const contractAddress = useSelector(state => state.reducer.contractAddress);


  const onFinish = async (values) => {
    if(ownerAddress && contractAbi && currentAddress)
          {
            const response = await registerUser(contractAbi,values.username,values.password,currentAddress)
            // props.checkUser()
          }
  };

  useEffect(async () => {
    if(ownerAddress && contractAbi && currentAddress)
      {
        await eventRegister(contractAbi,contractAddress,currentAddress)
      }
  },[]);

  const eventRegister = async (contract,contractAddress,account) => {
    contract.events.Register({},{
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
              props.checkUser();
            } 
          })
          .on('changed', function(event){
            console.log({onChanged:event}); // remove event from local database
          })
          .on('error', console.error);
      }

  return (
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
                    paddingBottom:'20px'}}> User Registration</h2>
        <Form.Item
        name="username"
        label="UserName"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your Name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
        </Form>    
  );
};
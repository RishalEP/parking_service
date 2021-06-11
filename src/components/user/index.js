import React, { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  HomeOutlined,
  BookOutlined
} from '@ant-design/icons';
import { Link, Router, Switch } from "react-router-dom";
import { Home } from "./Home";
import { Bookings } from "./Bookings";
import { BrowserRouter, Route } from 'react-router-dom';
import { history } from "../helpers";
import { useSelector } from "react-redux";
import { ifExists } from "../services/service";
import { Register } from "./Register";


const { Header, Sider, Content } = Layout;

export const User = () => {
    
  const [collapsed, setCollapsed] = useState(false);
  const [exists, setExists] = useState(true);

  const contractAbi = useSelector(state => state.reducer.contract);
  const ownerAddress = useSelector(state => state.reducer.ownerAddress);
  const currentAddress = useSelector(state => state.reducer.currentAddress);
  const contractAddress = useSelector(state => state.reducer.contractAddress);

  useEffect(async () => {
        if(ownerAddress && contractAbi && currentAddress)
          {
            await checkUser()
          }
    },[currentAddress]);

  const checkUser = async () => {
    const ifUser = await ifExists(contractAbi,currentAddress)
    setExists(ifUser)
  }

  const toggle = () => {
    setCollapsed(!collapsed)
  };

    return (
      <Layout hasSider={true} style={{paddingTop:'40px'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
                 <Link to="/user" /> 
                Home
            </Menu.Item>
            <Menu.Item key="2" disabled={!exists} icon={<UploadOutlined />}>
                <Link to="/user/bookings"  />
                My Bookings
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout hasSider={true} className="site-layout">
        <Content
                className="site-layout-background"
                style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 780,
                }}
                
            >
            <Router history={history}>
                <Switch>
                    <Route exact path="/user" component={() => exists ? <Home checkUser={checkUser}/> : <Register checkUser={checkUser}/>} />
                    <Route exact path="/user/bookings" component={() => <Bookings  /> }   />
                </Switch>
            </Router>
          </Content>
        </Layout>
      </Layout>
    );
  }

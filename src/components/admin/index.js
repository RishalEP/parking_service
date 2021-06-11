import React, { useState, useEffect } from "react";
import { Layout, Menu } from 'antd';
import {
  UploadOutlined,
  HomeOutlined,
  BookOutlined,
  RollbackOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Link, Router, Switch } from "react-router-dom";
import { BrowserRouter, Route } from 'react-router-dom';
import { history } from "../helpers";
import { useSelector } from "react-redux";
import { getTotalBookings } from "../services/service";
import { Home } from "./Home";
import { Actions } from "./Actions";
import { Bookings } from "./Bookings";
import { Location } from "./Location";

const { Header, Sider, Content } = Layout;

export const Admin = () => {
    
  const contractAbi = useSelector(state => state.reducer.contract);
  const ownerAddress = useSelector(state => state.reducer.ownerAddress);
  const currentAddress = useSelector(state => state.reducer.currentAddress);
  const contractAddress = useSelector(state => state.reducer.contractAddress);

  const [booking, setBooking] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(async () => {
      if(ownerAddress && contractAbi && currentAddress)
        {
         await fetchCurrentInfo();
        }
    },[]);

    const fetchCurrentInfo = async () => {
      const totalBooking = await getTotalBookings(contractAbi)
      setBooking(parseInt(totalBooking))
    }

    return (
      <Layout hasSider={true} style={{paddingTop:'40px'}}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
                 <Link to="/admin" /> 
                Home
            </Menu.Item>
            <Menu.Item key="2" icon={<BookOutlined />}>
                <Link to="/admin/pending"  />
                Pending Bookings
            </Menu.Item>
            <Menu.Item key="3" icon={<RollbackOutlined />}>
                <Link to="/admin/approved"  />
                History
            </Menu.Item>
            <Menu.Item key="4" icon={<SearchOutlined />}>
                <Link to="/admin/locations"  />
                Locations
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
                    <Route exact path="/admin" component={() =>  <Home totalBookings={booking}/> } />
                    <Route exact path="/admin/pending" component={() =>  <Actions totalBookings={booking} 
                                                                                  getInfo = {fetchCurrentInfo}/> }  />
                    <Route exact path="/admin/approved" component={() =>  <Bookings totalBookings={booking} 
                                                                                  getInfo = {fetchCurrentInfo}/> }  />

                    <Route exact path="/admin/locations" component={() =>  <Location /> }  />
                </Switch>
            </Router>
          </Content>
        </Layout>
      </Layout>
    );
  }

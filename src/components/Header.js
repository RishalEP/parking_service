import React, { Component } from 'react'
import farmer from '../farmer.png'
import { Navbar,Nav,Button } from 'react-bootstrap'

export const Header = (props) => {

    return (
        <Navbar bg="light" variant="light">
            <Navbar.Brand >Parking Service Application</Navbar.Brand>
            <Nav className="mr-auto">
                {/* <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#features">Features</Nav.Link>
                <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            </Nav>
            <Button onClick={props.logout} variant="outline-primary">Sign Out</Button>
        </Navbar>
    );
  
}

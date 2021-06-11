import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { Card,Button} from 'react-bootstrap'

export const PlacesInfo = (props) => {
    
  

    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Location : {props.current.name}</Card.Title>
                    {/* <Card.Text>
                        {props.current.name}
                    </Card.Text> */}
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>ID : {props.current.id}</ListGroupItem>
                    <ListGroupItem>Total Bookings : {props.current.bookings.length}</ListGroupItem>
                    <ListGroupItem>Available Slots : {props.current.remaining}</ListGroupItem>
                </ListGroup>
                </Card>
        
        </div>
    )
}

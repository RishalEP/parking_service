import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { Card,Button} from 'react-bootstrap'

export const CardInfo = (props) => {

    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>Booking Id {props.current.id}</Card.Title>
                    {/* <Card.Text>
                        {props.current.name}
                    </Card.Text> */}
                </Card.Body>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>Booked By : {props.current.name}</ListGroupItem>
                    <ListGroupItem>Place : {props.current.place}</ListGroupItem>
                    <ListGroupItem>Available Slots : {props.current.remainingSlots}</ListGroupItem>
                </ListGroup>
                <Card.Body>
                    <Button style={{marginLeft:'25px'}} variant="secondary" onClick={() => props.reject(props.current.id)} >Reject</Button>
                    <Button style={{marginLeft:'25px'}} variant="primary" onClick={() => props.approve(props.current.id)} >Approve</Button>
                </Card.Body>
                </Card>
        
        </div>
    )
}

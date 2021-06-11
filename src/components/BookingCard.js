import React, { useEffect } from 'react'
import { ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { Card,Button} from 'react-bootstrap'
import ReactStars from "react-rating-stars-component";

export const BookingCard = (props) => {
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
                        <ListGroupItem>Status : {props.current.isApproved}</ListGroupItem>
                        <ListGroupItem>Rating :  <ReactStars
                                                    count={5}
                                                    isHalf={false}
                                                    size={24}
                                                    edit={false}
                                                    value={props.current.rating}
                                                    activeColor="#ffd700"
                                                />  </ListGroupItem>
                       
                  </ListGroup>
                </Card> 

        </div>
    )
}

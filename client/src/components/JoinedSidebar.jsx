import React from 'react';
import Nav from 'react-bootstrap/Nav'


export default function Sidebar(props) {
  // console.log(props)
  function renderEvents(events) {
    return events.map((event) => {
      // console.log(event)
      return (
        <Nav.Link onClick={() => props.handleItemClick(event)} key={event.id} eventKey="link-2">{event.title}</Nav.Link>
      );
    })
  }
  return (
    <div className="col-2">
      <Nav position="right" className="flex-column">
        {renderEvents(props.events)}
      </Nav>
    </div>

  )
}
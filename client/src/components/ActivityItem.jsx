import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import {
  Card,
  ListGroup,
  ListGroupItem,
  Button,
  Popover,
  OverlayTrigger
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import GMap from "./GMap.jsx";

class ActivityItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity_id: props.activity.id,
      join: null,
      redirect: false,
      context: this.props.activity.description.substr(0,100),
      more:false,
      buttonName:'Read more',
      dot:'...'
    };
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.more=this.more.bind(this);
  }
  more(){
    if (this.state.more){
      this.setState({
        context: this.props.activity.description.substr(0, 100),
        more: false,
        buttonName: 'Read more',
        dot: '...'
      })
    }else{
      this.setState({
        context: this.props.activity.description,
        more: true,
        buttonName: 'Read less',
        dot: ''
      })
    }
  }
  handleJoinClick() {
    axios
      .post("http://localhost:5000/newMessage", {
        activity_id: this.state.activity_id,
        currentUser_id: this.props.currentUser.id,
        currentUser_name: this.props.currentUser.name,
        join_message: true
      })
      .then(response => {
        this.setState({ join: response.data});
      });
  }
  handleDeleteClick() {
    axios
      .post("http://localhost:5000/deleteEvent", {
        activity_id: this.state.activity_id
      })
      .then(response => {
        if (response) {
          this.props.reload();
        }
      });
  }
  componentDidMount() {
    axios
      .post("http://localhost:5000/joinCheck", {
        event_id: this.state.activity_id,
        user_id: this.props.currentUser.id
      })
      .then(response => {
        this.setState({ join: response.data, redirect: this.state.redirect });
      });
  }
  render() {
    const start_time = moment(this.props.activity.start_date).format("lll");
    const end_time = moment(this.props.activity.end_date).format("lll");
    let weather = <i className="far fa-question-circle" />;
    if (this.props.activity.weather === "rain") {
      weather = <i className="fas fa-cloud-rain" />;
    } else if (this.props.activity.weather === "sunny") {
      weather = <i className="fas fa-sun" />;
    } else if (this.props.activity.weather === "snow") {
      weather = <i className="far fa-snowflake" />;
    } else if (this.props.activity.weather === "cloudy") {
      weather = <i className="fas fa-cloud" />;
    }
    let checkJoin = <div>Reserved for members</div>;
    if (this.state.join) {
      checkJoin = <Button variant="secondary">Joined</Button>;
    } else if (this.props.currentUser.id) {
      checkJoin = <Button onClick={this.handleJoinClick}>Join</Button>;
    }
    let checkAdmin = <span />;
    if (this.props.currentUser.admin) {
      checkAdmin = (
        <Button
          variant="danger"
          onClick={this.handleDeleteClick}
          style={{ float: "right" }}
        >
          Delete
        </Button>
      );
    }

    const center = {
      lat: parseFloat(this.props.activity.lat),
      lng: parseFloat(this.props.activity.lng)
    };
    const popover = (
      <Popover
        id="popover-basic"
        title="location"
        style={{ width: "25rem", height: "18rem" }}
      >
        <GMap
          location={this.props.activity.location}
          center={center}
          lat={parseFloat(this.props.activity.lat)}
          lng={parseFloat(this.props.activity.lng)}

          zoom={11}
        />
      </Popover>
    );
    const Example = () => (
      <OverlayTrigger trigger="click" placement="top" overlay={popover}>
        <Button variant="outline-info" size="sm" styles={{ float: "left", height: '100%' }}>
          <i className="fas fa-map-marked-alt" />
        </Button>
      </OverlayTrigger>
    );
    let { from } = { from: { pathname: "/discussions" } };
    let redirectToReferrer = this.state.redirect;
    if (redirectToReferrer) return <Redirect to={from} />;
    return (
      <div className="activityClass">
        <Card width="100" m-1="true">
          <Card.Img variant="top" src={this.props.activity.url} height="250" />
          <Card.Body>
            <span>{weather}</span>
            <Card.Title>{this.props.activity.title}</Card.Title>
            <Card.Text>{this.state.context}{this.state.dot}<Button variant="secondary" size="sm" onClick={this.more}>{this.state.buttonName}</Button></Card.Text>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroupItem>{start_time} to {end_time}</ListGroupItem>

            <ListGroupItem style={{ maxHeight: "100px" }}>
            <div>
              <Example />
              <div styles={{marginLeft: '10px', float: 'left'}}>Location: {this.props.activity.location}</div>
            </div>
              </ListGroupItem>
          </ListGroup>

          <Card.Body>
            {checkJoin}
            {checkAdmin}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
export default ActivityItem;

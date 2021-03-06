import React, {Component} from 'react';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

class NewEventForm extends Component {
  constructor(props){
 	super(props);
 	this.state = {
 	  open: true,
 	  date : '',
 	  title : '',
 	  description : '',
 	  location : {},
 	  trails: this.props.trails
 	}

  this.handleDescription = this.handleDescription.bind(this);
  this.handleTitle = this.handleTitle.bind(this);
  this.handleOpen = this.handleOpen.bind(this);
  this.handleSelect = this.handleSelect.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.handlelocation = this.handleLocation.bind(this);
  this.saveEvent = this.saveEvent.bind(this);
 };

  saveEvent () {
  	axios.post('/event', {
      event: { 
      	title: this.state.title,
	    date: this.state.date,
	    title: this.state.title,
	    trailId: this.state.location.trailId 
	  }
  	})
  	.then(function(response){
  	  console.log('Saved')
  	})
  	.catch(function(error){
  	  console.log('Error', error)
  	})
  }

  handleDescription  (e) {
    this.setState({description: e.target.value });
  }

  handleTitle (e) {
    this.setState({title: e.target.value });
  }

  handleOpen () {
    this.setState({open: true});
  }

  handleSelect (value) {
    this.setState({location: value});
  }

  handleClose () {
    this.setState({open: false});
  }

  handleLocation (trail) {
  	this.setState({location: trail})
  }

  render() {
	const actions = [
	  <FlatButton
	    label="Done"
	    primary={true}
	    keyboardFocused={true}
	    onClick={this.handleClose}
	  />,
	  <FlatButton
	    label="Create Event"
	    primary={true}
	    keyboardFocused={true}
	    onClick={this.saveEvent}
	  />,
	];

      return (
        <div>
            <Dialog
	          title="Let us know the details"
	          actions={actions}
	          modal={false}
	          open={this.state.open}
	          onRequestClose={this.handleClose}
            >
           Plan your hike here.
          <TextField onChange={this.handleTitle} hintText="Name your event"/><br />
          <DropDownMenu trails={this.state.trails} value="Select a trail" onChange={this.handleLocation}>
            {this.props.trails.map((trail, i) =>{<MenuItem value={i} primaryText={trail.name}/>})}
          </DropDownMenu>
          <DatePicker hintText="Select a date"/>
          <TextField onChange={this.handleDescription} hintText="Tell us more about it!"/><br />
        </Dialog>
      </div>
    );
  }
}

export default NewEventForm
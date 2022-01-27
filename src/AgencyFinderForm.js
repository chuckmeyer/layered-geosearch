/* global google */
import React from 'react';

class AgencyFinderForm extends React.Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.autocompleteListener = null;
    this.state = this.initialState();
    // this is to set the initial state of the component
    // as you probably
    // know, if you're going to be passing functions around and invoke them as
    // callbacks, you'll need to hold onto 'this' because it's bound at runtime
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  initialState() {
    return {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      googleMapLink: '',
      geoCode: '',
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(this.state.geoCode);
  }

  handleClear() {
    this.setState(this.initialState);
    var input = document.getElementById('autocomplete');
    input.value = '';
    google.maps.event.removeListener(this.autocompleteListener);
    this.initAutocomplete();
  }

  handlePlaceSelect() {
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;
    address.forEach(element => console.log(element.long_name));
    this.setState({
      streetAddress: `${address[0].long_name} ${address[1].short_name}`,
      city: address[3].long_name,
      state: address[5].short_name,
      zipCode: address[7].short_name,
      geoCode: addressObject.geometry.location.lat() + ', ' + addressObject.geometry.location.lng(),
      googleMapLink: addressObject.url,
    });
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {}
    );
    this.autocompleteListener = this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  componentDidMount() {
    this.initAutocomplete();
  }

  render() {
    return (
      <div>
        <h1>Find an Agency</h1>
        <form onSubmit={this.handleSubmit}>
          <input
            id="autocomplete"
            className="input-field"
            ref="input"
            type="text"
          />
          <input
            name={'streetAddress'}
            value={this.state.streetAddress}
            placeholder={'Street Address'}
            onChange={this.handleChange}
          />
          <input
            name={'city'}
            value={this.state.city}
            placeholder={'City'}
            onChange={this.handleChange}
          />
          <input
            name={'state'}
            value={this.state.state}
            placeholder={'State'}
            onChange={this.handleChange}
          />
          <input
            name={'zipCode'}
            value={this.state.zipCode}
            placeholder={'Zipcode'}
            onChange={this.handleChange}
          />
          <input
            name={'geoCode'}
            value={this.state.geoCode}
            placeholder={'Latitude, Longitude'}
            onChange={this.handleChange}
          />
        </form>
        <button onClick={this.handleSubmit}>Submit</button>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }
}

export { AgencyFinderForm };

import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function EmailForm() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [devices, setDevices] = useState([]);
  const [email, setEmail] = useState([]);

  const [typeOptions] = useState([
    "Moving time",
    "Distance",
    "Average speed",
    "Average heartrate",
  ]);

  const [type, setType] = useState(typeOptions[0]);

  useEffect(() => {
    let data = require("../config/devices.json");
    data = JSON.parse(JSON.stringify(data));
    //setDevices(JSON.parse(JSON.stringify(data)));
    setDevices(data["devices"]);
    setEmail(data["devices"].email);
    //console.log("devices "+devices);
    //console.log("xxx "+JSON.stringify(data));
  }, []);

  //console.log('data= ' + data);
  //const name= data['devices'].client_id

  //  let devices=data['devices']
  //console.log('#1 xxxxxxxxxxxxxxx '+devices)

  const handleSendMessage = () => {
    console.log(email);
  };

  const handleSelectedDevice = (e) => {
    //console.log("eeeeeeeeeee= " + e.target.value);
    setEmail(e.target.value);
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Devices</Form.Label>
        <DropdownButton
          variant="outline-secondary"
          title="Dropdown"
          id="input-group-dropdown-1"
        >
          <Dropdown.Item href="#">Action</Dropdown.Item>
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
        <Form.Label>Devices</Form.Label>
        <Form.Control
          as="select"
          id="type"
          custom
          value={type}
          onChange={({ target }) => {
            setSelectedIndex(target.selectedIndex);
            setType(target.value);
          }}
        >
          {typeOptions.map((item, ind) => {
            return (
              <option key={ind} value={item}>
                {" "}
                {item}
              </option>
            );
          })}
        </Form.Control>

        <Form.Label>Devices</Form.Label>
        <Form.Select onChange={handleSelectedDevice}>
          {devices.map((item, ind) => {
            return (
              <option key={ind} value={item.email}>
                {item.name}
              </option>
            );
          })}
        </Form.Select>
        <Form.Label>Device email</Form.Label>
        <Form.Control type="email" disabled value={email}/>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" onClick={handleSendMessage}>
        Submit
      </Button>
    </Form>
  );
}

export default EmailForm;

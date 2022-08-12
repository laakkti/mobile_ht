import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function EmailForm({ socketId, handleSendMessage }) {
  const [devices, setDevices] = useState([]);
  const [email, setEmail] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  
  //const [index, setIndex] = useState(0);
  //const [mySocketId, setMySocketId] = useState("");

  useEffect(() => {
    let data = require("../config/devices.json");
    data = JSON.parse(JSON.stringify(data));
    setDevices(data["devices"]);
    setEmail(data["devices"][0].email);
    //setMySocketId(socketId);
  }, []);

  /*
  const handleSendMessage = () => {
    // oliskos app-tasolla varsinainen sendMessage-funktio eli tänne callback parametrina!!! jolle parametrin aemail ja mySocketId,
    // itseasiassa socketId on appilla ja välitetään tänne mutta voidaan völitäää selvyyden vuoksi em. tavalla
    console.log(email);
  };*/

  const handleSelectedDevice = (e) => {
    setEmail(e.target.value);
  };

  const handleChange=(e)=> {
    console.log(e.target.checked);
    setCheckboxChecked(e.target.checked);
  }

  return (
    <Form style={{ marginLeft: "10px" }}>
      <Form.Group className="mb-3">
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

        <Form.Label style={{ marginTop: "10px" }}>Device email</Form.Label>
        <Form.Control type="email" disabled value={email} />
        <Form.Label style={{ marginTop: "10px" }}>My socket.id</Form.Label>
        <Form.Control type="text" disabled value={socketId} />
      </Form.Group>

      <Form.Check className="mb-1"
                checked={checkboxChecked}
                onChange={handleChange}
        type="switch"
        id="custom-switch"
        label="Continues data"
      />
      <Form.Label>{checkboxChecked}</Form.Label>
      <Button
        className="mb-2"
        variant="primary"
        onClick={() => handleSendMessage(email)}
      >
        Call device
      </Button>
      
    </Form>
  );
}

export default EmailForm;

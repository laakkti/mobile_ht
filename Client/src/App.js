// baseAddr on asetettava development-käytössä ko. koneen ip-osoiteeseen localhost ei aina toimi
// baseAddr välitetään emaililla RN-mobiillisovellukselle
// baseAddr = "192.168.43.249:8080";

import React, { useState, useEffect } from "react";
import SendMessage from "./components/SendMessage";
import EmailForm from "./components/EmailForm";
import MapView from "./components/MapView";
//import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import Form from "react-bootstrap/Form";
import { Compass, Memory, BatteryHalf } from "react-bootstrap-icons";

const App = () => {
  const [wss, setWss] = useState(0);
  const [socketId, setSocketId] = useState("43210");
  const [mode, setMode] = useState("init");
  const [message, setMessage] = useState("");
  const [data, setData] = useState("");
  const [zoom, setZoom] = useState(11);
  const [text, setText] = useState("Iot");
  const [center, setCenter] = useState([65, 26]);
  const [levelColor, setLevelColor] = useState({});
  const [zoomLevel, setZoomLevel] = useState(11);

  
  let ws;

  let baseAddr = "/";
  if (process.env.NODE_ENV === "development") baseAddr = "192.168.43.249:8080";

  useEffect(() => {
    ws = new WebSocket("ws://" + baseAddr);

    ws.onopen = (event) => {
  
    };

    ws.onmessage = function(event) {
      let msgObj = JSON.parse(event.data);

      //console.log(event.data);

      if (msgObj.id !== null) {
        if (msgObj.sender === "server") {
          setSocketId(msgObj.id);
        } else if (msgObj.sender === "mob") {
          setData(msgObj);
        }
      }
    };
    setWss(ws); // buttonClick tarvitsee tilamuuttujan tilan, MUTTA tässä ei sitä tarvita

    return () => ws.close();
  }, []);

  /*
     const setLocation = (position) =>{
      console.log('Longitude ' + position.coords.longitude);
      console.log('Latitude ' + position.coords.latitude);
      handleSetLoc(position.coords.latitude, position.coords.longitude);
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    }
   */

  const handleSendMessage = (email) => {
    const data = {
      email: email,
      ip: baseAddr,
      socketId: socketId,
    };

    setMessage(data);

    setMode("send");
  };

  //for demo purposes without incoming data
  /*
  useEffect(() => {
    let _data = {
      location: {
        lat: 62.897968,
        lon: 27.678171,
      },
      batteryLevel: 0.45,
      usedMemory: 65,
      totalMemory: 100,
      time: Date.now(),
    };
    setData(_data);
  }, []);
*/

  useEffect(() => {
    let val = Math.round((data.usedMemory / data.totalMemory) * 100);

    let lc = {};

    if (val > 49) {
      lc.memory = "danger";
    } else if (val <= 49 && val > 29) {
      lc.memory = "warning";
    } else {
      lc.memory = "success";
    }

    val = data.batteryLevel * 100;

    if (val > 49) {
      lc.battery = "success";
    } else if (val <= 49 && val > 29) {
      lc.battery = "warning";
    } else {
      lc.battery = "danger";
    }
    setLevelColor(lc);
  }, [data]);

  function getDateTime(epocTime) {
    let date = new Date(epocTime);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let year = date.getFullYear();
    return (
      day + "-" + month + "-" + year + " " + hour + ":" + minute + ":" + second
    );
  }

  // for test purposes
  function handleSetLoc(lan, lon) {
    let loc = {
      lat: lan,
      lon: lon,
    };
    setData({ ...data, location: loc });
    setZoomLevel(11);
  }

  return (
    <Container fluid>
      <SendMessage mode={mode} setMode={setMode} message={message} />
      <Row>
        {/*<Button
        className="mb-2"
        variant="primary"
        onClick={() => handleSetLoc(61.50,23.76)}
      >
        Set location
      </Button>*/}
        <EmailForm socketId={socketId} handleSendMessage={handleSendMessage} />
      </Row>
      <Row>
        <Col>
          <MapView
            location={data.location}
            zoom={zoomLevel}
            text={"1"}
          ></MapView>
        </Col>
        <Col md="auto">
          {data.location !== undefined && (
            <Card style={{ width: "18rem", backgroundColor: "#b2d8d8" }}>
              <Card.Body>
                <Card.Title>Device info</Card.Title>
                <Card.Text></Card.Text>
                <Form.Label className="mb-0" style={{ color: "#1A3E4C" }}>
                  Timestamp
                </Form.Label>
                <div>
                  <Form.Label>{getDateTime(data.time)}</Form.Label>
                </div>
                <Form.Label
                  size="sm"
                  className="mb-0"
                  style={{ color: "#1A3E4C" }}
                >
                  Location
                </Form.Label>
                <Row className="mb-1">
                  <Col>
                    <Form.Control
                      size="sm"
                      type="text"
                      disabled
                      value={data.location.lat}
                    />
                  </Col>
                  <Col md="auto">
                    <Compass color="teal" size={20} />
                  </Col>
                  <Col>
                    <Form.Control
                      size="sm"
                      type="text"
                      disabled
                      value={data.location.lon}
                    />
                  </Col>
                </Row>
                <BatteryHalf className="me-1" color="teal" size={20} />
                <Form.Label
                  size="sm"
                  className="mb-0"
                  style={{ color: "#1A3E4C" }}
                >
                  Battery level
                </Form.Label>
                <ProgressBar
                  className="mb-1"
                  variant={levelColor.battery}
                  animated
                  now={data.batteryLevel * 100}
                  label={`${Math.round(data.batteryLevel * 100)}%`}
                />
                <Memory className="me-1" color="teal" size={20} />
                <Form.Label
                  size="sm"
                  className="mt-1 mb-0"
                  style={{ color: "#1A3E4C" }}
                >
                  Free memory
                </Form.Label>
                <ProgressBar
                  className="mb-1"
                  variant={levelColor.memory}
                  animated
                  now={100 - (data.usedMemory * 100) / data.totalMemory}
                  label={`${Math.round(
                    100 - (data.usedMemory * 100) / data.totalMemory
                  )}%`}
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};
export default App;

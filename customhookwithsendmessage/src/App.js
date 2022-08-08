// https://developers.google.com/gmail/api/quickstart/js
// baseAddr on asetettava development-käytössä ko. koneen ip-osoiteeseen localhost ei aina toimi
// baseAddr välitetään emaililla RN-mobiillisovellukselle
import React, { useState, useEffect } from "react";
import SendMessage from "./components/SendMessage";
import EmailForm from "./components/EmailForm";
import MapView from "./components/MapView";
import axios from "axios";

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

  //  let message="";
  //let socketId = "";
  let ws;

  let baseAddr = "/";
  if (process.env.NODE_ENV === "development") baseAddr = "192.168.43.249:8080";

  console.log("baseAddr: " + baseAddr);
  const onClick = (p) => {
    //    setDate(Date.now());
    //alert(wss);
    wss.send(Date.now());
  };

  useEffect(() => {
    //setWs(new WebSocket('ws://192.168.43.249:8080'));
    // OSOITE SAADAA SERVERILTÄ kysymällä query
    // tsekkaa savonia_ht
    //ws = new WebSocket("ws://c");
    ws = new WebSocket("ws://" + baseAddr);
    //const ws = new WebSocket('wss://ws.bitstamp.net');

    ws.onopen = (event) => {
      console.log("WS onopen");
      //ws.send(JSON.stringify(apiCall));
      //ws.send(Date.now());

      // simuloidaanko tässä mobiilia joka lähettää
      // en ymmärrä on toinenkin socket_test jossa id:2
      // ilmeisesti "kaiutetaan" data takaisin serveriltä tänne

      // TÄTÄ EI tarvita jatkossa oli vain testiä
      //ws.send(JSON.stringify({ id: 1, time: Date.now() }));
    };

    ws.onmessage = function(event) {
      // tässä pitää ensin saada id backendiltä
      // pitää erottaa kuka lähettää joko backend tai mobiili
      // backillä erotetaan siten että "message" tapahtumakäsittelijässä lähetetåån eteenpäin id parametein mukaiseen
      // jotenn täällä tutkitaan sender-paramteria se siis lisätään

      /*
      for (let item in event) {
        console.log(item);
      }*/

      //let msgObj = JSON.parse(event.data);

      //console.log("event.currentTarget="+event.currentTarget);

      //console.log("event.data====> "+event.data);

      // pitäis kai olla try catch joka varmistaa että kyseessä on JSON-data

      //console.log("event.data=" + event.data);

      let msgObj = JSON.parse(event.data);

      console.log(event.data);

      if (msgObj.id !== null) {
        if (msgObj.sender === "server") {
          setSocketId(msgObj.id);
        } else if (msgObj.sender === "mob") {
          setData(msgObj);
        }

        //socketId=msgObj.id;
      }

      /*
      console.log("msg.sender= " + msgObj.sender);
      console.log("msg.id= " + msgObj.id);
      console.log("msg.time= " + msgObj.time);
*/

      //socketId = msgObj.id;

      // EHDOSKSI SENDER jos on server niin em. koodi mutta jos mob niin datan-käsittely ja visualisointi map yms.

      //      alert(event.date);
      //setDate(Date.now());
      /*const json = JSON.parse(event.data);
          console.log("xxxxxx "+json);
          try {
              if ((json.event === 'data')) {
                  setBids(json.data.bids.slice(0, 5));
              }
          } catch (err) {
              console.log(err);
          }*/
    };
    setWss(ws); // buttonClick tarvitsee tilamuuttujan tilan, MUTTA tässä ei sitä tarvita
    //clean up function
    return () => ws.close();
  }, []);

  const handleSendMessage = (email) => {
    //console.log("send=" + mode);
    // riittöäisikö jos olisi const muuttuja eikä static?????
    //setMessage(msg);

    //***********************
    console.log("location=" + window.location);

    const data = {
      email: email,
      ip: baseAddr,
      socketId: socketId,
    };

    //console.log(publicIpv4());

    // Print os.networkInterfaces() value
    //const nwi = os.networkInterfaces();
    //const ip = nwi['eth0'][0]['address']
    //console.log(nwi);

    //console.log("ip="+getIP());
    //console.log(getClientIp());
    //console.log("msg=" + msg);
    setMessage(data);
    setMode("send");
    //***********************
  };

  // välttämättä ei lähetetä socket.id:tä koska se palautuu mutta voihan sen nöäöinkin tehdä niin saadaan samaan pakettiin json
  //
  //<button onClick={handleSendMessage}>SendMessage</button>
  /*
      ipAddress: ipAddress,
      batteryLevel: batteryLevel,
      usedMemory: usedMemory,
      totalMemory: totalMemory,
*/

  /*<div>
      <SendMessage mode={mode} setMode={setMode} message={message} />
      <EmailForm socketId={socketId} handleSendMessage={handleSendMessage} />
      <MapView location={data.location} zoom={11} text={"1"}></MapView>
      <div>
        <h3>{data.location}</h3>
        <h3>{data.ipAddress}</h3>
        <h3>{data.batteryLevel}</h3>
        <h3>{data.usedMemory}/{data.totalMemory}</h3>
        <h3>{data.time}</h3>
  </div>

  </div>*/

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
      console.log("levelColor.memory= " + val);
      lc.memory = "success";
    }
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(JSON.stringify(data));

    val = data.batteryLevel * 100;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log("BATTERY");
    console.log(val);
    if (val > 49) {
      lc.battery = "success";
    } else if (val <= 49 && val > 29) {
      lc.battery = "warning";
    } else {
      lc.battery = "danger";
    }
    setLevelColor(lc);
  }, [data]);

  //console.log('data.location=' + data.location);
  //let coords=JSON.parse(data.location);
  //console.log('location.lon=' + coords.lon);

  function getDateTime(epocTime) {
    //  const date= new Date(data.time);
    //console.log(date.getFullYear());

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
        onClick={() => handleSetLoc(62,25)}
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
                <Form.Label className="mb-0" style={{color:'#1A3E4C'}}>Timestamp</Form.Label>
                <div>
                  <Form.Label>
                    {getDateTime(data.time)}
                  </Form.Label>
                </div>
                {/*<Form.Control plaintext readOnly value={getDateTime(data.time)} />*/}
                <Form.Label size="sm" className="mb-0" style={{color:'#1A3E4C'}}>
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
                <Form.Label size="sm" className="mb-0" style={{color:'#1A3E4C'}}>
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
                <Form.Label size="sm" className="mt-1 mb-0" style={{color:'#1A3E4C'}}>
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

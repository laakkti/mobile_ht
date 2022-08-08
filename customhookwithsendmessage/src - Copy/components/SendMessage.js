// https://developers.google.com/gmail/api/quickstart/js

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
//import importScript from './useImportScript';

// lisätään vielä formin kenttien arvot
const SendMessage = ({ mode, setMode }) => {
  //const SendMessage=()=> {
  const [tokenClient, setTokenClient] = useState("");
  const [thisMode, setThisMode] = useState("");
  // nämä json-tiedostoon ja requirella JSON.parsella käuttöömn
  // data = JSON.parse(JSON.stringify(data))
  const userID = "gtwmobmaster@gmail.com";
  const API_KEY = "AIzaSyCMI0gPPQ5cgOk4eWthA842gR4vxRBEDZY";
  const CLIENT_ID =
    "905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com";

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

  const SCOPES = "https://mail.google.com/";

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //********************************************************
  // vaihtoehtoinen tapa Helmetille
  /*  useEffect((scr) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);*/
//********************************************************
  async function gapiLoaded() {
    console.log("gapiLoaded");
    await window.gapi.load("client", intializeGapiClient);
  }

  async function gisLoaded() {
    // tsekkaa netistä initTokenClient ja mikä on callbackin merkitys
    console.log("gisLoaded()");
    // TÄRKEÄ!!! muuten herjaa googlesta
    /* global google */

    let tc = await google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });

    // ehkei tarvita jatkossa
    setTokenClient(tc);
    console.log("tokenClient.m= " + tc.m);
    return tc;
  }

  const loadModules = async () => {
    console.log("loadModules");
    await gapiLoaded();
    return await gisLoaded();
  };

  const handleGapi = async (tokenClient) => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }

      handleSendMessage();
    };

    if (window.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  const handleSendMessage = async () => {
    const from = "gtwmobmaster@gmail.com";
    //const to = "laakkti@gmail.com";
    const to = "timo.laakkonen@hotmail.com";
    const subject = "query";
    const content = "heipä hei this a test message";
    await sendMessage(from, to, subject, content);
  };

  useEffect(() => {
    setMode("");
  }, [mode]);

  // voisiko state-muutujaa lisättän yhdellä -> uusi renderöinti ja ehdot määrittää mitä tehdään kussakin stepissä

  useEffect(() => {
    if (mode === "send") {
      async function act() {
        if (tokenClient === "") {
          const tc = await loadModules();
          await delay(1000);
          await handleGapi(tc);
        } else {
          handleSendMessage();
        }
      }
      act();
    } else if (mode === "auth") {
      handleGapi();
    } else if (mode === "init") {
      loadModules();
    }
  }, [mode]);
  /*
    const userID = process.env.userID;
    const API_KEY = process.env.API_KEY;
    const CLIENT_ID =process.env.CLIENT_ID;
    */

  async function intializeGapiClient() {
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  }

  // laita palauttamaan true/false
  async function sendMessage(from, to, subject, content) {
    console.log("INside sendMessage");
    const encodedEmail = new Buffer(
      "From: " +
        from +
        "\r\n" +
        "To: " +
        to +
        "\r\n" +
        "Subject: " +
        subject +
        "\r\n\r\n" +
        content
    )
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    let response;
    try {
      response = await window.gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: encodedEmail,
        },
      });
    } catch (err) {
      return;
    }
  }

  return (
    <div>
      <Helmet>
        <script async defer src="https://apis.google.com/js/api.js"></script>
        <script
          async
          defer
          src="https://accounts.google.com/gsi/client"
        ></script>
      </Helmet>
      <div>{Date.now()}</div>
    </div>
  );
};
export default SendMessage;

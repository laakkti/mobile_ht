// https://developers.google.com/gmail/api/quickstart/js

import React, { useState, useEffect } from "react";
//import { Helmet } from "react-helmet";
import useImportScript from "./useImportScript";
const Buffer = require("buffer/").Buffer;

//import importScript from './useImportScript';

// lisätään vielä formin kenttien arvot
const SendMessage = ({ mode, setMode,message }) => {
  //const SendMessage=()=> {
  const [tokenClient, setTokenClient] = useState("");
    
  // nämä json-tiedostoon ja requirella JSON.parsella käyttöön
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

  //if (mode === "init") {
    useImportScript("https://apis.google.com/js/api.js");
    useImportScript("https://accounts.google.com/gsi/client");
  //}

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
    console.log("message = " + message);

    // selvitä voisiko tähän laittaa jonkin muun email-osoitteen
    const from = "gtwmobmaster@gmail.com";
    //const to = "laakkti@gmail.com";
    const to = message.email;
    const subject = "query";
    
    delete message.email; // 
    const content = JSON.stringify(message);
    console.log("to = " + to);
    console.log("content = " + content);
    await sendMessage(from, to, subject, content);
  };

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

  useEffect(() => {
    setMode("");
  }, [mode]);

  
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
    }
  }, [mode]);

  return null;
};
export default SendMessage;
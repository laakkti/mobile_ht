For demo purpose there is couple of changing falues/suure englanniksi
And for demo purpose there is some delay for demostration.
MUUTA usedmemory freememoriksi
LISÄÄ DATAAN yhteytyyppi ja signaalin voimakkuus!!!
Voidaan ajatella että luetaan sensoreita ja niiden suureita mm. lämpätila, tuulennopeus windspeed, valo lux, ilmanpaine, paine, kosteus etc. suureita.
Demossa avaa useampi client joka send email
Jos conitinues niin silloin pitäis huomioida palvella myös muitakin, joten... kerrko tästä ongelmasta että ohjelma ei ole suunniteltu tähän mutta on majhdollista
This is just a demo how to mobile device behaves like service.
Not handled every type of error situations. siis ei ole ennakoitu (mitä englanniksi)
Contonues datan kun muuttaa niin sillä ohjataan viesti device-laitteen socketiin ja asetataanparametri joka lähettää data jatkuvasti tai pysäyttää viestivirran messageflow
Puuttu tarkistukset esim. jos asiakas ei ole available when to send data
Pitäisi olla send sequensessa tarkistus/tarkistukset

You can stop device to sending data
Vois antaa parametrin jos halutaan että device låhettää dataa tietyllä taajuudella, 
For presentation on purpose React not Rnative. There two has lot of common.
Klikkamalla markearia voitais tehdä socket-kutsu laitteelle, mutta mitä siinä olisi
Lähetä nyt ainakin viesti ja todenna ett äyhteys löytyy jos tarvetta.
REACT google-map deafault strictmode index.js poistettava!!!
Kun device lähettää dataa niin backend vois lähettää jonkinlaisen viestin takaisin jos onnistui
Intenet of thing iot ajatus

Idea react-app ottaa yhteyden socketilla backendiin ja backki lähettää ideen joka lähetetään emaililla 
mobdevice lukee jatkuvasti maileja ja lähettää viestin perusteella dataa backedille sisältäwn myös Reactin ideen,
backend oaa ohjata (send) viestin eteenpäin ideen omaavalla taholle eli tässä reactille

The topic shoosen was pretty large including many techiques backing sytem backend etc.
Unexpected much extra work was needed.

Readmessages
luetaan viesteistä aina vanhin lukematon query otsikolla olevista
lähetetään laitetiedot/sijainti tiedot kysyjälle socketio:n kautta ja kun siletä saadaan palaute
niin merkitään viesti luetuksi
ja haetaan seuraava viesti (vanhin lukemattomista tietyin ehdoin)

---------------------------
Seuraavaksi
tehdään loop joka suorittaa tehtävää toistuvasti 
---------------------------



TESTAA riittääkö että laite on kirjautuneena vai pitääkö signinbuttonia ja onko testiversiosta -> tuotato metkitystä ettei siis tarivtse testikäyttäjiä merkitä.

Jotkut seikat voisi laitaa ositionn selvitettävää/kehitettävää jatkossa 

This RA presents the idea of communication socket etc. mobile device works like service, can be connected with sensors and send
There is lot of topic/item/things which are out of scope for needs backend and presenation...  

Jotta tämä RA toimmii ja voidaan esitellä vaatii se mobiilin ulkopuolisia duunia

https://console.cloud.google.com/

Devices
taitaa olla gtwmob1@gmail.com
gtw.mob1@gmail.com
gtwmob2022

gtw.mob2@gmail.com
gtwmob2022

gtw.mob3@gmail.com
gtwmob2022


TESTAA julkaisua!!!!
WEB
pitää lisätä testikäyttäjä, jotta toimii sillä 

## OAuth consent screen
----------------------------------------------------------------
In Production:

Once you set your app status as "In production," your app will be available to anyone with a Google Account. Depending on how you configure your OAuth screen, you may have to submit your app for verification .

Testing:

If your app is still being tested and built, you can set your status to "testing". In this state, you can test your app with a limited number of users.

Learn more about publishing status
----------------------------------------------------------------



Long story short:
The basic idea is to use reused components, the desinging main idea is to ... resusablitiy, mainteained redevelop as easy as possible
new things: location deviceinfo googlesignin reading email swnding email websocket webview 
Deviceinfo, there is many info item which can be found, in this ra we are interested in batlevel, meoryuse etc.

Mobile devides are like has role of servers/gateways (acts like services...), sensors connected and data is asked by email.

Mites jos danfo.js työhön tekee serviceworkerin!!!!yls se että kun onnkirjauduttu ja authoroitu niin voidaan ottaa jokin muu skope valkkaa jokin 
ja näytä esiemerkki SIIS tämä on yksi harjoitustyöpn teema eli google signin/authorization to get to use google services as an authorized user

simulation for location batterylevel -> extended controls -> kuvakaappauksia

Ok ui/ux design is an importat part of software development but in this example the focus is more at technical point of view.

####  backend http-server and websocket-server
####  React-sovellus em. backendillä (herokussa)
#####  yhteys muodostuu websocketiin, backend generoi id:een joka palautetaan React-sovellukselle
näin sovellus tunnistetaan backendillä kun socketin kautta liikennöidään, tässä tapauksessa
tämä tieto lähetetään emaililla mobilelle ja kun mobile lukee postia niin ja lähettää dataa socketin kautta niin se menee oikeaan osoitteeseen.
Mobile voi tarvittaessa myöäs lähettää emaililla halututu tiedot ko. tapuksessa se ei saa id:tä
TESTI:
Backend käyntiin
React frontti myös
tällöin frontin id:ee on 1
Mobile käyntiin ja socket yhteys backin websocket palvelimeen parameterina id=1 eli React sovelluksen tunnus
Backend lähettä ide:een parusteella Reactille sovket-viestin ja jotakin näkyvää pitäisi tapahtua (aseta tilamuttuja vaikka kellonaika)

2
3
4 WEbview Reactsovellukseen ja Ionic sekä PWA

Time tulee myös olemaan gtw:n lähettämä yksi tieto


************************************
Turn of device location eli siellä yläpalkissa missä taskulamppukin laitetaan päälle
https://guidebooks.google.com/android/changesettingspermissions/turnondevicelocation

Testaa googlemaps sovelluksella ja emulaattorista extended control vaihda sijaintia

Location simulator in emulator its IMPORTANT to be signed in Google account
myös AndroidManifest tiedostoon 
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
****************************************

Viimeiseen kappaleeseen
Gmail React has extraordinary solutions, because on .. js-files to be loaded 
Helmet-package 1000 code row vs. alternative useEffect document...
M

There is a purpose to convert React-app to mobile  PWA, Ionic, Cordova...
ds
Gateway devicd can have many kind of sensors connected for example weather bases pressure, temp, wind speed etc. 
Possible we want to know something about the device, battery level, signal strengt, location...

Top technologies Google sign in for use/using google "services"

The basic idea (not make sense) but there are mobile devices around the word many places, they measure something and we can ask from the device data via email.
Every device has own email-address.
The answer/reponse for the query is send via/by email or socket, require email should have ip of the device for a socket
In RN websocket in inside so it not nedd to import...
How do we know or mark the socket, we will add e.g. id for socket, this id woill be send to gtw via email json-type of content

To get socketio-connection possible available we need server for that 

In the same address (HEroku) we have a webpage to ask mobiledevice invo via email and see the answers on the page

React:
"MapView"
https://www.npmjs.com/package/google-m



https://www.npmjs.com/package/semantic-ui-react

npm install semantic-ui-react semantic-ui-css 


index.html (em. npm install semantic-ui-css on turhaa ei toimi mutta seuraava kyllä)
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css"></link>


Email-form:
There is list of mobile-devices (gateways) (should be in database but npw in the json -file)
File contains name of the device and the email-address which posts it reads. 
In form these data is filled in the fields, not modified just in test case. 


#### Send Email:
gtwmobmaster@gmail.com
Rytky#2022

https://console.cloud.google.com/welcome?project=jamkmob-356222







Weather data from location (tästä  oli esimerkki jokin palvelu muuttaa lovationin paikannimeksi jne..)

Ionicin valinta tähän ei ollut se, että lähdettäisiin tekemään uutta vaan 
olemassa olevan react osvelluksen muuttaminen mobiiliksi.
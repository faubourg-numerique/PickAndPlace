const { HttpServer } = require('@node-wot/binding-http');
const { Servient } = require('@node-wot/core');
const makeWoTinteraction = require('./classclient');
const fs = require('fs');
const servient = new Servient();
servient.addServer(new HttpServer({ port: 9093}));
const TDRobot = "http://localhost:9090/robot"; 
const clientRobot = new makeWoTinteraction(TDRobot);
const TDGripper = "http://localhost:9092/gripper"; 
const clientGripper = new makeWoTinteraction(TDGripper);
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let TD;
try {
  TD = JSON.parse(fs.readFileSync('./ControlTD.json', 'utf8'));
} catch (error) {
  console.error('Erreur de lecture du fichier Thing Description :', error);
  process.exit(1);
}

servient.start().then(async (WoT) => {
  WoT.produce(TD).then(async (thing) => {
      thing.setActionHandler('PickAndPlace', async () => {
      await clientGripper.invokeAction('open');
      await delay(5000);
      await clientRobot.invokeAction('move', { x: 75.56, y: 172.12, z: 99.18, r: -19.08 });
      await delay(5000);
      await clientRobot.invokeAction('move', { x: 150.00, y: -94.56, z: 100.02, r: -19.08 });
      await delay(5000);
      await clientRobot.invokeAction('move', { x: 157.56, y: -93.24, z: -25.49, r: -19.08 });
      await delay(5000);
      await clientGripper.invokeAction('close');
      await delay(5000);
      await clientRobot.invokeAction('move', { x: 150.00, y: -94.56, z: 100.02, r: -19.08 });
      await delay(5000);
      await clientRobot.invokeAction('move', { x: 75.56, y: 172.12, z: 99.18, r: -19.08 });
      await delay(5000);
      await clientRobot.invokeAction('move', { x: -18.47, y: 170.36, z: 40.02, r: -19.08});
      await delay(5000);
      await clientRobot.invokeAction('move', { x: -18.47, y: 170.36, z: -12.17, r: -19.08});
      await delay(5000);
      await clientGripper.invokeAction('open');
      await delay(5000);
      await clientRobot.invokeAction('move', { x: -18.47, y: 170.36, z: 40.02, r: -19.08});
      await delay(5000);
      
      });
      console.log("Thing exposée :", JSON.stringify(thing.getThingDescription(), null, 2));
      await thing.expose();
  }).catch(err => {
    console.error('Erreur lors de la production de la Thing :', err);
  });
}).catch(err => {
  console.error('Erreur lors du démarrage du Servient :', err);
});

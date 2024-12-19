const { HttpServer } = require('@node-wot/binding-http');
const { Servient } = require('@node-wot/core');
const ROSLIB = require('roslib');
const fs = require('fs');


const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9091'  
});

ros.on('connection', () => {
  console.log('Connecté à ROS.');
});

ros.on('error', (error) => {
  console.error('Erreur de connexion à ROS :', error);
});

ros.on('close', () => {
  console.log('Connexion à ROS fermée.');
});


const gripper = new ROSLIB.Topic({
  ros: ros,
  name: '/gripper',
  messageType: 'std_msgs/msg/String'
});


const servient = new Servient();
servient.addServer(new HttpServer({ port: 9092 }));

let TD;
try {
  TD = JSON.parse(fs.readFileSync('./gripper.json', 'utf8'));
} catch (error) {
  console.error('Erreur de lecture du fichier Thing Description :', error);
  process.exit(1);
}

servient.start().then(async (WoT) => {
  WoT.produce(TD).then(async (thing) => {
      thing.setActionHandler('close', async () => {
        const close = new ROSLIB.Message({ data: "close" });
        gripper.publish(close);
      });
      thing.setActionHandler('open', async () => {
        const open = new ROSLIB.Message({ data: "open" });
        gripper.publish(open);
      });
      
      
      console.log("Thing exposée :", JSON.stringify(thing.getThingDescription(), null, 2));
      await thing.expose();
  }).catch(err => {
    console.error('Erreur lors de la production de la Thing :', err);
  });
}).catch(err => {
  console.error('Erreur lors du démarrage du Servient :', err);
});

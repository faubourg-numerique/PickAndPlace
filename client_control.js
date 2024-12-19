const makeWoTinteraction = require('./classclient');
const TDfile = "http://localhost:9093/control"; 
const client = new makeWoTinteraction(TDfile);
(async () => {
   await client.invokeAction('PickAndPlace');
})();


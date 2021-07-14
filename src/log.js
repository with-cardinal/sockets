export default function log(msgObj) {
  console.log(JSON.stringify({ at: new Date(), ...msgObj }));
}

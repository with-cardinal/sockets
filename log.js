export default function log(msg) {
  console.log(JSON.stringify({ at: new Date(), ...msg }));
}

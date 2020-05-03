function encode(msg) {
  return JSON.stringify(msg);
}

function decode(msg) {
  return JSON.parse(msg);
}

module.exports = { decode, encode };

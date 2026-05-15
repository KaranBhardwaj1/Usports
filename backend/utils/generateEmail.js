function generateEmail(name, rollNo, batch) {

  const last4 = rollNo.slice(-4);

  return `${name.toLowerCase()}${last4}.be${batch}@chitkarauniversity.edu.in`;

}

module.exports = generateEmail;

const http = require('http');

function post(path, data, cb) {
  const body = JSON.stringify(data);
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } };
  const req = http.request('http://localhost:5000/api' + path, options, (res) => { let b=''; res.on('data', c=> b+=c); res.on('end', ()=> cb(null, res.statusCode, b)); });
  req.on('error', e=> cb(e)); req.write(body); req.end();
}

post('/auth/login', { email: 'admin@hospital.com', password: 'password123' }, (err, status, body) => {
  if (err) return console.error('login error', err);
  try {
    const token = JSON.parse(body).token;
    const patient = { name: 'Test Patient', age: 30, phone: '+91 90000 00000', email: 'test.patient@example.com', category: 'General', history: 'N/A' };
    const patientBody = JSON.stringify(patient);
    const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(patientBody), 'Authorization': 'Bearer ' + token } };
    const req = http.request('http://localhost:5000/api/patients', options, (res) => {
      let b = '';
      res.on('data', c=> b+=c);
      res.on('end', ()=> {
        console.log('status', res.statusCode);
        console.log('body', b);
        process.exit(0);
      });
    });
    req.on('error', e=> { console.error('patient req error', e); process.exit(1); });
    req.write(patientBody);
    req.end();
  } catch(e) { console.error('login parse error', e); process.exit(1); }
});

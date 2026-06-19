const http = require('http');
function post(path, data, cb){
  const body = JSON.stringify(data);
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } };
  const req = http.request('https://hospital-managementbackend.onrender.com/api' + path, options, (res) => { let b=''; res.on('data', c=> b+=c); res.on('end', ()=> cb(null, res.statusCode, b)); });
  req.on('error', e=> cb(e)); req.write(body); req.end();
}

post('/auth/login', { email: 'admin@hospital.com', password: 'password123' }, (err, status, body) => {
  if (err) return console.error('login error', err);
  console.log('login status', status, body);
  try {
    const token = JSON.parse(body).token;
    const options = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token } };
    const req = http.request('https://hospital-managementbackend.onrender.com/api/users', options, (res) => {
      let b=''; res.on('data', c=> b+=c); res.on('end', ()=>{
        console.log('users status', res.statusCode);
        try { const users = JSON.parse(b); const doctors = users.filter(u=>u.role==='doctor'); console.log('doctors:', doctors); } catch(e){ console.error('parse users error', e, b); }
      });
    }); req.on('error', e=> console.error('users req error', e)); req.end();
  } catch(e) { console.error('login parse error', e); }
});

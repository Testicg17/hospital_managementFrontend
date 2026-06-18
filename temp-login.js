const http = require('http');
const postData = JSON.stringify({ email: 'admin@hospital.com', password: 'password123' });
const options = { method: 'POST', headers: { 'Content-Type':'application/json', 'Content-Length': Buffer.byteLength(postData) } };
const req = http.request('http://localhost:5000/api/auth/login', options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', body);
  });
});
req.on('error', err => console.error('err', err.message));
req.write(postData);
req.end();

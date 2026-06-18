const http = require('http');
const url = 'http://localhost:5000/api/users';
const data = JSON.stringify({username:'testuser', email:'test@example.com', password:'password123', role:'admin'});
const options = {method:'POST', headers:{'Content-Type':'application/json','Content-Length':Buffer.byteLength(data)}};
const req = http.request(url, options, res => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('body', body));
});
req.on('error', err => console.error('err', err.message));
req.write(data);
req.end();

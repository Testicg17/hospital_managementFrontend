const http = require('http');

function post(path, data, cb) {
  const body = JSON.stringify(data);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };
  const req = http.request('http://localhost:5000/api' + path, options, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => cb(null, res.statusCode, b));
  });
  req.on('error', e => cb(e));
  req.write(body);
  req.end();
}

// First login as admin
post('/auth/login', { email: 'admin@hospital.com', password: 'password123' }, (err, status, body) => {
  if (err) return console.error('❌ Login error:', err);
  
  console.log('✅ Login status:', status);
  
  try {
    const loginData = JSON.parse(body);
    const token = loginData.token;
    console.log('✅ Got token:', token.substring(0, 20) + '...');

    // Now create a bill (assuming patient_id = 1 exists)
    const billData = {
      patientId: 1,
      amount: 5000,
      services: 'Blood Test, ECG, Consultation',
      status: 'Pending',
      paymentMethod: 'Cash'
    };

    const billBody = JSON.stringify(billData);
    const billOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(billBody),
        'Authorization': 'Bearer ' + token
      }
    };

    const billReq = http.request('http://localhost:5000/api/bills', billOptions, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        console.log('\n✅ Bill creation status:', res.statusCode);
        try {
          const billResult = JSON.parse(b);
          console.log('✅ Bill created:', billResult);
        } catch (e) {
          console.error('❌ Parse error:', e.message, 'Response:', b);
        }
        process.exit(0);
      });
    });

    billReq.on('error', e => {
      console.error('❌ Bill request error:', e);
      process.exit(1);
    });

    billReq.write(billBody);
    billReq.end();

  } catch (e) {
    console.error('❌ Parse error:', e.message);
    process.exit(1);
  }
});

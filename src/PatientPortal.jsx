import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Activity, Calendar, FileText, DollarSign, User,
  Clock, Phone, Mail, Eye, LogOut, AlertCircle,
  RefreshCw
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('patientToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function PatientPortal() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const storedPatient = localStorage.getItem('patientData');
    if (token && storedPatient) {
      setPatient(JSON.parse(storedPatient));
      setStep('dashboard');
      fetchDashboardData();
    }
  }, []);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/patient-portal/request-otp', { phone });
      setStep('otp');
      alert(`Your OTP is: ${data.otp}\n(This will be sent via SMS in production)`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/patient-portal/verify-otp', { phone, otp });
      localStorage.setItem('patientToken', data.token);
      localStorage.setItem('patientData', JSON.stringify(data.patient));
      setPatient(data.patient);
      setStep('dashboard');
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientData');
    setPatient(null);
    setStep('phone');
    setPhone('');
    setOtp('');
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/patient-portal/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/patient-portal/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const { data } = await api.get('/patient-portal/bills');
      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };

  const handleRescheduleRequest = async (appointmentId, requestedDate, requestedTime, reason) => {
    try {
      await api.post(`/patient-portal/appointments/${appointmentId}/reschedule-request`, {
        requestedDate,
        requestedTime,
        reason
      });
      alert('Reschedule request submitted! Hospital will contact you soon.');
      setShowReschedule(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Failed to submit request'));
    }
  };

  useEffect(() => {
    if (step === 'dashboard' && patient) {
      if (activeTab === 'appointments') fetchAppointments();
      else if (activeTab === 'bills') fetchBills();
    }
  }, [activeTab, step, patient]);

  // Phone input and OTP screens (same as your code)
  if (step === 'phone' || step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Activity className="mx-auto text-green-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">
              {step === 'phone' ? 'Patient Portal' : 'Enter OTP'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 'phone'
                ? 'Access your medical records'
                : <>We’ve sent a 6-digit code to <b>{phone}</b></>}
            </p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

          {step === 'phone' ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="+91 98765 43210"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength="6"
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <div className="mt-4 text-center">
              <button onClick={() => setStep('phone')} className="text-sm text-green-600 hover:text-green-700">
                ← Change phone number
              </button>
              <br />
              <button onClick={handleRequestOTP} className="text-sm text-gray-600 hover:text-gray-700 mt-2">
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Reschedule modal
  const RescheduleModal = () => {
    const [requestedDate, setRequestedDate] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [reason, setReason] = useState('');
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Request Reschedule</h3>
          <input type="date" value={requestedDate} onChange={(e) => setRequestedDate(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
          <input type="time" value={requestedTime} onChange={(e) => setRequestedTime(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <div className="flex gap-3">
            <button
              onClick={() =>
                handleRescheduleRequest(selectedAppointment.id, requestedDate, requestedTime, reason)
              }
              disabled={!requestedDate || !requestedTime}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              Submit
            </button>
            <button
              onClick={() => setShowReschedule(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Invoice modal
  const InvoiceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Invoice #{selectedBill?.id}</h3>
        <p className="text-sm text-gray-500 mb-2">Date: {new Date(selectedBill?.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-4">Services: {selectedBill?.services}</p>
        <p className="text-lg font-bold text-gray-800 mb-2">
          Amount: ₹{parseFloat(selectedBill?.amount).toLocaleString()}
        </p>
        <p className="text-sm">
          Status:{' '}
          <span className={`font-semibold ${selectedBill?.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
            {selectedBill?.status}
          </span>
        </p>
        <div className="mt-6 text-right">
          <button
            onClick={() => setShowInvoice(false)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Main UI
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <div className="flex items-center">
            <Activity className="text-green-600" size={28} />
            <span className="ml-2 text-xl font-bold">Patient Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {patient?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            ['dashboard', 'Dashboard', Activity],
            ['appointments', 'Appointments', Calendar],
            ['bills', 'Bills & Payments', DollarSign],
            ['profile', 'Profile', User],
          ].map(([tab, label, Icon]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
                activeTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
            <p className="text-gray-600">Welcome to your patient portal dashboard.</p>
          </div>
        )}
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No appointments found.</p>
            ) : (
              <table className="w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id} className="border-t">
                      <td className="px-4 py-2">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{a.type}</td>
                      <td className="px-4 py-2">{a.status}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedAppointment(a);
                            setShowReschedule(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <RefreshCw size={14} /> Reschedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'bills' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Bills & Payments</h2>
            {bills.length === 0 ? (
              <p className="text-gray-500">No bills available.</p>
            ) : (
              <table className="w-full bg-white shadow rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bill ID</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id} className="border-t">
                      <td className="px-4 py-2">#{b.id}</td>
                      <td className="px-4 py-2">{new Date(b.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">₹{parseFloat(b.amount).toLocaleString()}</td>
                      <td className="px-4 py-2">{b.status}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedBill(b);
                            setShowInvoice(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <p><b>Name:</b> {patient?.name}</p>
              <p><b>Phone:</b> {patient?.phone}</p>
              <p><b>Email:</b> {patient?.email || 'Not provided'}</p>
            </div>
          </div>
        )}
      </div>

      {showReschedule && <RescheduleModal />}
      {showInvoice && <InvoiceModal />}
    </div>
  );
}

export default PatientPortal;

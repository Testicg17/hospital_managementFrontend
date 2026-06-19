import React, { useState, useEffect } from 'react';
import { User, Calendar, CreditCard, Phone, Mail, LogOut, Activity, Clock, AlertCircle, Eye, RefreshCw, FileText, X, History } from 'lucide-react';

const API_BASE_URL = 'https://hospital-managementbackend.onrender.com/api/patient-portal';

// Store token in memory instead of localStorage
let authToken = null;

const api = {
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

function PatientPortal() {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showRescheduleChoices, setShowRescheduleChoices] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedRescheduleIndex, setSelectedRescheduleIndex] = useState(0);

  useEffect(() => {
    try {
      const token = localStorage.getItem('patient_portal_token');
      const storedPatient = localStorage.getItem('patient_portal_user');
      if (token && storedPatient) {
        authToken = token;
        setPatient(JSON.parse(storedPatient));
        setStep('portal');
      }
    } catch (err) {
      console.error('Error restoring patient session:', err);
    }
  }, []);

  useEffect(() => {
    if (step === 'portal' && patient) {
      if (activeTab === 'profile') {
        fetchProfile();
        fetchHistory();
      } else if (activeTab === 'appointments') {
        fetchAppointments();
      } else if (activeTab === 'bills') {
        fetchBills();
      }
    }
  }, [activeTab, step, patient]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.request('/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setStep('otp');
      alert(`Your OTP is: ${data.otp}\n(This will be emailed in production)`);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.request('/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      authToken = data.token;
      localStorage.setItem('patient_portal_token', data.token);
      localStorage.setItem('patient_portal_user', JSON.stringify(data.patient));
      setPatient(data.patient);
      setStep('portal');
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authToken = null;
    localStorage.removeItem('patient_portal_token');
    localStorage.removeItem('patient_portal_user');
    setPatient(null);
    setStep('email');
    setEmail('');
    setOtp('');
    setActiveTab('profile');
    setProfile(null);
    setHistory(null);
    setAppointments([]);
    setBills([]);
  };

  const fetchProfile = async () => {
    try {
      const data = await api.request('/profile');
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(`Failed to load profile: ${err.message}`);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.request('/history');
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await api.request('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(`Failed to load appointments: ${err.message}`);
    }
  };

  const fetchBills = async () => {
    try {
      const data = await api.request('/bills');
      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
      setError(`Failed to load bills: ${err.message}`);
    }
  };

  const handleRescheduleRequest = async (appointmentId, requestedDate, requestedTime, reason) => {
    try {
      await api.request(`/appointments/${appointmentId}/reschedule-request`, {
        method: 'POST',
        body: JSON.stringify({ requestedDate, requestedTime, reason })
      });
      alert('Reschedule request submitted! Hospital will contact you soon.');
      setShowReschedule(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleAcceptRescheduleOption = async (appointmentId, option) => {
    try {
      setLoading(true);
      const response = await api.request(`/appointments/${appointmentId}/reschedule-accept`, {
        method: 'PUT',
        body: JSON.stringify({ 
          acceptedDateTime: option.requestedDate,
          reason: option.reason
        })
      });
      if (response.success || response.message) {
        alert('Reschedule accepted. Your appointment has been updated.');
        setShowRescheduleChoices(false);
        setSelectedAppointment(null);
        setSelectedRescheduleIndex(0);
        fetchAppointments();
      } else {
        alert(response.error || 'Failed to accept reschedule request');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Parse medical history to separate visits
  const parseHistory = (historyText) => {
    if (!historyText) return { mainHistory: '', visits: [] };
    
    const visitRegex = /\[(\d{1,2}\/\d{1,2}\/\d{4})\] Visit Summary:\s*Diagnosis: (.*?)\s*Prescription: (.*?)\s*Tests Ordered: (.*?)\s*Notes: (.*?)(?=\[|$)/gs;
    const visits = [];
    let match;
    
    while ((match = visitRegex.exec(historyText)) !== null) {
      visits.push({
        date: match[1],
        diagnosis: match[2].trim(),
        prescription: match[3].trim(),
        tests: match[4].trim(),
        notes: match[5].trim()
      });
    }
    
    // Get main history (text before first visit)
    const firstVisitIndex = historyText.indexOf('[');
    const mainHistory = firstVisitIndex > 0 ? historyText.substring(0, firstVisitIndex).trim() : historyText;
    
    return { mainHistory, visits };
  };

  const extractRescheduleInfo = (notes) => {
    if (!notes) return null;

    const suggestions = [];
    const blockRegex = /\[DOCTOR RESCHEDULE REQUEST\]\s*(.+?)\s*(?:\n\s*Reason:\s*(.+?))?(?=\n\[|$)/gi;
    let match;

    while ((match = blockRegex.exec(notes)) !== null) {
      const dateTimeStr = match[1].trim();
      const reason = match[2] ? match[2].trim() : '';
      
      suggestions.push({
        requestedDate: dateTimeStr,
        requestedTime: '',
        reason
      });
    }

    if (suggestions.length > 0) {
      return { suggestions, reason: '' };
    }

    return null;
  };

  // Login Screen
  if (step === 'email' || step === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Activity className="mx-auto text-green-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">
              {step === 'email' ? 'Patient Portal' : 'Enter OTP'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 'email' ? 'Choose your login method' : `OTP sent to ${email}`}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}

          {step === 'email' && (
            <>
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your registered email"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 transition"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP to Email'}
                </button>
                <p className="text-xs text-gray-500 text-center">
                  We'll send a 6-digit code to your email
                </p>
              </form>
            </>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength="6"
                  autoFocus
                />
                <p className="text-xs text-gray-500 text-center mt-2">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 transition"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <div className="flex justify-between text-sm mt-4">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleRequestOTP}
                  className="text-gray-600 hover:text-gray-700 font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Reschedule Modal
  const RescheduleModal = () => {
    const [requestedDate, setRequestedDate] = useState('');
    const [requestedTime, setRequestedTime] = useState('');
    const [reason, setReason] = useState('');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Request Reschedule</h3>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Current Appointment:</strong>
            </p>
            <p className="text-sm text-gray-600">
              {new Date(selectedAppointment?.date).toLocaleDateString()} at {selectedAppointment?.time}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
              <input
                type="time"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why do you need to reschedule?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows="3"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => handleRescheduleRequest(selectedAppointment.id, requestedDate, requestedTime, reason)}
              disabled={!requestedDate || !requestedTime}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
            >
              Submit Request
            </button>
            <button
              onClick={() => { setShowReschedule(false); setSelectedAppointment(null); }}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const RescheduleSelectionModal = () => {
    const rescheduleInfo = extractRescheduleInfo(selectedAppointment?.notes);
    const options = rescheduleInfo?.suggestions || [];
    const selectedOption = options[selectedRescheduleIndex] || null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 w-full max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Choose Reschedule Slot</h3>
              {rescheduleInfo?.reason && (
                <p className="text-sm text-gray-600 mt-1">Doctor reason: {rescheduleInfo.reason}</p>
              )}
            </div>
            <button
              onClick={() => { setShowRescheduleChoices(false); setSelectedAppointment(null); }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {options.map((option, index) => (
              <button
                key={`${option.requestedDate}-${index}`}
                onClick={() => setSelectedRescheduleIndex(index)}
                className={`w-full text-left p-4 rounded-xl border ${selectedRescheduleIndex === index ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'} transition`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{option.requestedDate}</span>
                </div>
                {option.reason && (
                  <p className="text-sm text-gray-600 mt-2">Doctor reason: <span className="font-medium">{option.reason}</span></p>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => selectedOption && handleAcceptRescheduleOption(selectedAppointment.id, selectedOption)}
              disabled={!selectedOption}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm selected slot
            </button>
            <button
              onClick={() => { setShowRescheduleChoices(false); setSelectedAppointment(null); }}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Invoice Modal
  const InvoiceModal = () => {
    const handlePrint = () => {
      window.print();
    };

    const handleDownload = () => {
      alert('PDF download feature - Connect to PDF generation library in production');
    };

    const numberToWords = (num) => {
      if (!num) return 'Zero';
      const amount = parseFloat(num);
      if (isNaN(amount)) return 'Zero';
      
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      
      const convertLessThanThousand = (n) => {
        if (n === 0) return '';
        if (n < 10) return ones[n];
        if (n < 20) return teens[n - 10];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
      };
      
      if (amount === 0) return 'Zero';
      
      const crores = Math.floor(amount / 10000000);
      const lakhs = Math.floor((amount % 10000000) / 100000);
      const thousands = Math.floor((amount % 100000) / 1000);
      const remainder = Math.floor(amount % 1000);
      
      let result = '';
      if (crores > 0) result += convertLessThanThousand(crores) + ' Crore ';
      if (lakhs > 0) result += convertLessThanThousand(lakhs) + ' Lakh ';
      if (thousands > 0) result += convertLessThanThousand(thousands) + ' Thousand ';
      if (remainder > 0) result += convertLessThanThousand(remainder);
      
      return result.trim();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Invoice #{selectedBill?.id}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Eye size={18} />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CreditCard size={18} />
                Download
              </button>
              <button
                onClick={() => { setShowInvoice(false); setSelectedBill(null); }}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Activity className="text-green-600" size={40} />
                <h1 className="text-3xl font-bold text-gray-800">Hospital Management System</h1>
              </div>
              <p className="text-gray-600">123 Medical Center Drive, Healthcare City</p>
              <p className="text-gray-600">Phone: +91 98765 00000 | Email: info@hospital.com</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-lg text-gray-800 mb-2">{patient?.name}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <Phone size={14} />
                    {patient?.phone || 'N/A'}
                  </p>
                  {patient?.email && (
                    <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                      <Mail size={14} />
                      {patient?.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Invoice Details:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Number:</span>
                    <span className="font-semibold">#{selectedBill?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{new Date(selectedBill?.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedBill?.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedBill?.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Services Provided:</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedBill?.services.split(',').map((service, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{service.trim()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 text-right">
                          {index === selectedBill?.services.split(',').length - 1 
                            ? `₹${parseFloat(selectedBill?.amount).toLocaleString()}` 
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">₹{parseFloat(selectedBill?.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (0%):</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">₹{parseFloat(selectedBill?.amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Amount in Words: </span>
                <span className="italic">Rupees {numberToWords(selectedBill?.amount)} Only</span>
              </p>
            </div>

            <div className="border-t-2 border-gray-300 pt-6 mt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Terms & Conditions:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Payment is due within 30 days</li>
                    <li>• Please include invoice number with payment</li>
                    <li>• Late payments may incur additional charges</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-4">Authorized Signature</p>
                  <div className="border-t border-gray-400 w-48 ml-auto pt-2">
                    <p className="text-xs text-gray-500">Hospital Administrator</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">Thank you for choosing our healthcare services!</p>
              <p className="text-xs text-gray-500 mt-1">For queries, contact us at billing@hospital.com</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Portal
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="text-green-600" size={32} />
              <span className="ml-2 text-xl font-bold text-gray-800">Patient Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{patient?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6">
          {[
            { id: 'profile', label: 'Profile & History', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'bills', label: 'Bills & Payments', icon: CreditCard }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={28} className="text-green-600" />
                My Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 font-medium">Name</label>
                  <p className="text-lg text-gray-800 mt-1">{profile?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Age</label>
                  <p className="text-lg text-gray-800 mt-1">{profile?.age} years</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Phone</label>
                  <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                    <Phone size={16} />
                    {profile?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Email</label>
                  <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                    <Mail size={16} />
                    {profile?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Category</label>
                  <p className="text-lg text-gray-800 mt-1">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {profile?.category}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Last Visit</label>
                  <p className="text-lg text-gray-800 mt-1">
                    {profile?.last_visit ? new Date(profile.last_visit).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Next Checkup</label>
                  <p className="text-lg text-gray-800 mt-1 flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    {profile?.next_checkup ? new Date(profile.next_checkup).toLocaleDateString() : 'Not scheduled'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History size={24} className="text-green-600" />
                Medical History
              </h3>
              {history?.history ? (
                <div className="space-y-4">
                  {(() => {
                    const { mainHistory, visits } = parseHistory(history.history);
                    return (
                      <>
                        {mainHistory && (
                          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border-l-4 border-green-500">
                            <div className="flex items-start gap-3">
                              <FileText size={20} className="text-green-600 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-2">Primary Medical Condition</h4>
                                <p className="text-gray-800 leading-relaxed">{mainHistory}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {visits.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Clock size={18} className="text-blue-600" />
                              Visit History ({visits.length} {visits.length === 1 ? 'visit' : 'visits'})
                            </h4>
                            <div className="space-y-3">
                              {visits.map((visit, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <Calendar size={16} className="text-blue-600" />
                                      <span className="font-semibold text-gray-800">{visit.date}</span>
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                      Visit #{visits.length - index}
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Diagnosis</p>
                                      <p className="text-sm text-gray-800">{visit.diagnosis || 'Not specified'}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Prescription</p>
                                      <p className="text-sm text-gray-800">{visit.prescription || 'None'}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tests Ordered</p>
                                      <p className="text-sm text-gray-800">{visit.tests || 'None'}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Notes</p>
                                      <p className="text-sm text-gray-800">{visit.notes || 'No additional notes'}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900">Last Visit</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {history.last_visit ? new Date(history.last_visit).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-orange-600" />
                        <span className="text-sm font-semibold text-orange-900">Next Checkup</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {history.next_checkup ? new Date(history.next_checkup).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Not scheduled'}
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-purple-600" />
                        <span className="text-sm font-semibold text-purple-900">Category</span>
                      </div>
                      <p className="text-gray-800 font-medium">
                        {history.category || 'General'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500 text-lg">No medical history recorded</p>
                  <p className="text-gray-400 text-sm mt-1">Your medical records will appear here once available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar size={28} className="text-green-600" />
              My Appointments
            </h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => {
                  const rescheduleInfo = extractRescheduleInfo(apt.notes);
                  const isPastAppointment = new Date(apt.date) < new Date();
                  
                  return (
                    <div key={apt.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">{apt.type}</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-blue-600 flex-shrink-0" />
                              <div>
                                <span className="text-sm font-medium text-gray-700">Original Schedule:</span>
                                <span className="ml-2 text-gray-900 font-semibold">
                                  {new Date(apt.date).toLocaleDateString('en-IN', { 
                                    weekday: 'short', 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} at {apt.time}
                                </span>
                              </div>
                            </div>
                            
                            {rescheduleInfo?.suggestions?.length > 0 && (
                              <div className="flex flex-col gap-2 bg-orange-50 -mx-2 px-2 py-2 rounded">
                                <div className="flex items-center gap-2">
                                  <RefreshCw size={16} className="text-orange-600 flex-shrink-0" />
                                  <div>
                                    <span className="text-sm font-medium text-orange-700">Reschedule Requested</span>
                                    <span className="ml-2 text-orange-900 font-semibold">
                                      {rescheduleInfo.suggestions.length > 1 ? `${rescheduleInfo.suggestions.length} suggested slots` : '1 suggested slot'}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm text-orange-800 ml-8">
                                  {rescheduleInfo.suggestions.map((option, idx) => (
                                    <div key={`${option.requestedDate}-${option.requestedTime}-${idx}`}>• {option.requestedDate} at {option.requestedTime}</div>
                                  ))}
                                </div>
                                {rescheduleInfo.reason && (
                                  <div className="text-xs text-orange-700 ml-8">Reason: {rescheduleInfo.reason}</div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4 ${
                          apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      
                      {apt.notes && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-gray-300">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{apt.notes}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          {isPastAppointment ? (
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              Past appointment
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600">
                              <Clock size={14} />
                              Upcoming
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {(rescheduleInfo?.suggestions?.length > 0 && !apt.notes?.includes('[PATIENT ACCEPTED]')) && (
                            <button
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setSelectedRescheduleIndex(0);
                                setShowRescheduleChoices(true);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition font-medium"
                            >
                              <RefreshCw size={18} />
                              Choose requested slot
                            </button>
                          )}
                          
                          {(apt.status === 'Scheduled' || apt.status === 'Rescheduled') && (
                            <button
                              onClick={() => { setSelectedAppointment(apt); setShowReschedule(true); }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-medium"
                            >
                              <RefreshCw size={18} />
                              {apt.status === 'Rescheduled' ? 'Update Request' : 'Request Reschedule'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bills' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <CreditCard size={28} className="text-green-600" />
              Bills & Payments
            </h2>
            {bills.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">No bills found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bills.map((bill) => (
                  <div key={bill.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Bill #{bill.id}</h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {new Date(bill.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold text-gray-800">₹{parseFloat(bill.amount).toLocaleString()}</p>
                        {bill.services && (
                          <p className="text-sm text-gray-600 mt-1">{bill.services}</p>
                        )}
                      </div>
                      <button
                        onClick={() => { setSelectedBill(bill); setShowInvoice(true); }}
                        className="flex items-center gap-2 text-green-600 hover:text-green-800 font-medium"
                      >
                        <Eye size={18} />
                        View Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showReschedule && <RescheduleModal />}
      {showRescheduleChoices && <RescheduleSelectionModal />}
      {showInvoice && <InvoiceModal />}
    </div>
  );
}

export default PatientPortal;
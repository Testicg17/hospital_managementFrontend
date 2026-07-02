// frontend/src/portals/AdminPortal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, Users, Activity, AlertCircle, TrendingUp, UserPlus, Search, X, Edit2, Trash2, Bell, Phone, Mail, LogOut, LogIn, Eye, Printer, Download, Shield, UserCog, MapPin, Building2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'https://hospital-managementbackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function AdminPortal() {
  const [activeTab, setActiveTab]               = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn]             = useState(false);
  const [token, setToken]                       = useState(null);
  const [user, setUser]                         = useState(null);
  const [patients, setPatients]                 = useState([]);
  const [appointments, setAppointments]         = useState([]);
  const [bills, setBills]                       = useState([]);
  const [users, setUsers]                       = useState([]);
  const [doctors, setDoctors]                   = useState([]);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [stats, setStats]                       = useState({ totalPatients: 0, todayAppointments: 0, pendingBills: 0, totalRevenue: 0 });
  const [showAddPatient, setShowAddPatient]     = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showAddBill, setShowAddBill]           = useState(false);
  const [showAddUser, setShowAddUser]           = useState(false);
  const [showAddHospitalLocation, setShowAddHospitalLocation] = useState(false);
  const [searchTerm, setSearchTerm]             = useState('');
  const [selectedPatient, setSelectedPatient]   = useState(null);
  const [selectedBill, setSelectedBill]         = useState(null);
  const [selectedUser, setSelectedUser]         = useState(null);
  const [selectedHospitalLocation, setSelectedHospitalLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showInvoice, setShowInvoice]           = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [actionLoading, setActionLoading]       = useState(false);
  const [error, setError]                       = useState(null);
  const [alert, setAlert]                       = useState({ message: '', type: '' });

  const categories = ['All', 'Diabetes', 'Hypertension', 'Cardiac', 'General', 'Orthopedic', 'Other'];

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 4000);
  };

  // ─── useCallback prevents re-creation on every render ───────────────────────

  const fetchPatients = useCallback(async () => {
    try {
      const { data } = await api.get('/patients', {
        params: { category: selectedCategory, search: searchTerm }
      });
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  }, [selectedCategory, searchTerm]);   // ← only real deps

  const fetchAppointments = useCallback(async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }, []);

  const fetchBills = useCallback(async () => {
    try {
      const { data } = await api.get('/bills');
      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  const fetchDoctors = useCallback(async () => {
    try {
      const { data } = await api.get('/hospital-locations/doctors');
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    }
  }, []);

  const fetchHospitalLocations = useCallback(async () => {
    try {
      const { data } = await api.get('/hospital-locations');
      setHospitalLocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching hospital locations:', err);
      setHospitalLocations([]);
    }
  }, []);

  // ─── Check stored token on mount ────────────────────────────────────────────
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser  = localStorage.getItem('admin_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // ─── Fetch all data when logged in or search/category changes ───────────────
  useEffect(() => {
    if (!isLoggedIn || !token) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          fetchPatients(),
          fetchAppointments(),
          fetchBills(),
          fetchStats(),
          fetchUsers(),
          fetchDoctors(),
          fetchHospitalLocations()
        ]);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [isLoggedIn, token, fetchPatients, fetchAppointments, fetchBills, fetchStats, fetchUsers, fetchDoctors, fetchHospitalLocations]);
  // ↑ All functions are stable (useCallback) so this runs only when truly needed

  // ─── Auth ────────────────────────────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      setIsLoggedIn(true);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  // ─── Patient CRUD ────────────────────────────────────────────────────────────
  const createPatient = async (patientData) => {
    setActionLoading(true);
    try {
      await api.post('/patients', patientData);
      await fetchPatients();
      await fetchStats();
      showAlert('Patient created successfully');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to create patient', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updatePatient = async (id, patientData) => {
    try {
      await api.put(`/patients/${id}`, patientData);
      await fetchPatients();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to update patient', 'error');
      throw err;
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm('Delete this patient? This will also delete their appointments and bills.')) return;
    try {
      await api.delete(`/patients/${id}`);
      await fetchPatients();
      await fetchStats();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to delete patient', 'error');
    }
  };

  // ─── Appointment CRUD ────────────────────────────────────────────────────────
  const createAppointment = async (appointmentData) => {
    setActionLoading(true);
    try {
      await api.post('/appointments', appointmentData);
      await fetchAppointments();
      await fetchStats();
      showAlert('Appointment scheduled');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to create appointment', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      await fetchAppointments();
      await fetchStats();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to delete appointment', 'error');
    }
  };

  const sendAlert = async (appointmentId) => {
    try {
      const { data } = await api.post(`/appointments/${appointmentId}/alert`);
      showAlert(`Alert sent to ${data.patient}`);
      await fetchAppointments();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to send alert', 'error');
    }
  };

  // ─── Bill CRUD ───────────────────────────────────────────────────────────────
  const normalizeHospitalLocationPayload = (locationData) => ({
    hospitalName: locationData.hospitalName?.trim(),
    location: locationData.location?.trim(),
    address: locationData.address?.trim() || null,
    doctorId: locationData.doctorId || null,
    status: locationData.status || 'Active'
  });

  const createHospitalLocation = async (locationData) => {
    setActionLoading(true);
    try {
      await api.post('/hospital-locations', normalizeHospitalLocationPayload(locationData));
      await fetchHospitalLocations();
      showAlert('Hospital location created');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to create hospital location', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateHospitalLocation = async (id, locationData) => {
    setActionLoading(true);
    try {
      await api.put(`/hospital-locations/${id}`, normalizeHospitalLocationPayload(locationData));
      await fetchHospitalLocations();
      await fetchAppointments();
      showAlert('Hospital location updated');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to update hospital location', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteHospitalLocation = async (id) => {
    if (!window.confirm('Delete this hospital location? Used locations will be marked inactive.')) return;
    try {
      const { data } = await api.delete(`/hospital-locations/${id}`);
      await fetchHospitalLocations();
      await fetchAppointments();
      showAlert(data?.message || 'Hospital location deleted');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to delete hospital location', 'error');
    }
  };

  const createBill = async (billData) => {
    setActionLoading(true);
    try {
      await api.post('/bills', billData);
      await fetchBills();
      await fetchStats();
      showAlert('Bill created successfully');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to create bill', 'error');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateBill = async (id, billData) => {
    try {
      await api.put(`/bills/${id}`, billData);
      await fetchBills();
      await fetchStats();
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to update bill', 'error');
    }
  };

  // ─── User CRUD ───────────────────────────────────────────────────────────────
  const normalizeUserPayload = (userData) => {
    const payload = {
      username: userData.username?.trim(),
      email:    userData.email?.trim().toLowerCase(),
      role:     userData.role?.toLowerCase()
    };
    if (userData.password) payload.password = userData.password;
    return payload;
  };

  const createUser = async (userData) => {
    try {
      await api.post('/users', normalizeUserPayload(userData));
      await fetchUsers();
      showAlert('User created successfully');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to create user';
      showAlert(msg, 'error');
      throw err;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      await api.put(`/users/${id}`, normalizeUserPayload(userData));
      await fetchUsers();
      showAlert('User updated successfully');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update user';
      showAlert(msg, 'error');
      throw err;
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
      showAlert('User deleted');
    } catch (err) {
      showAlert(err.response?.data?.error || 'Failed to delete user', 'error');
    }
  };

  // ─── numberToWords ───────────────────────────────────────────────────────────
  const numberToWords = (num) => {
    const amount = parseFloat(num);
    if (isNaN(amount) || amount === 0) return 'Zero';
    const ones  = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens  = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const conv  = (n) => {
      if (!n) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + conv(n % 100) : '');
    };
    let r = '';
    if (Math.floor(amount / 10000000)) r += conv(Math.floor(amount / 10000000)) + ' Crore ';
    if (Math.floor((amount % 10000000) / 100000)) r += conv(Math.floor((amount % 10000000) / 100000)) + ' Lakh ';
    if (Math.floor((amount % 100000) / 1000)) r += conv(Math.floor((amount % 100000) / 1000)) + ' Thousand ';
    if (Math.floor(amount % 1000)) r += conv(Math.floor(amount % 1000));
    return r.trim();
  };

  // ════════════════════════════════════════════════════════════════════════════
  //  COMPONENTS
  // ════════════════════════════════════════════════════════════════════════════

  const LoginForm = () => {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); handleLogin(email, password); };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Activity className="mx-auto text-blue-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">Hospital Management</h1>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin@hospital.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-gray-500">admin@hospital.com / password123</p>
          </div>
        </div>
      </div>
    );
  };

  const PatientForm = ({ onClose, editPatient = null }) => {
    const [formData, setFormData] = useState(editPatient || { name: '', age: '', phone: '', email: '', category: 'General', status: 'Active', history: '' });
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        editPatient ? await updatePatient(editPatient.id, formData) : await createPatient(formData);
        setSelectedPatient(null);
        onClose();
      } catch (_) {}
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{editPatient ? 'Edit Patient' : 'Register New Patient'}</h3>
            <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
              <textarea value={formData.history} onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                {actionLoading ? 'Saving...' : editPatient ? 'Update' : 'Register'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AppointmentForm = ({ onClose }) => {
    const activeHospitalLocations = hospitalLocations.filter(loc => loc.status !== 'Inactive');
    const [formData, setFormData] = useState({
      patientId: '',
      doctorId: '',
      hospitalLocationId: '',
      date: '',
      time: '',
      type: 'Regular Checkup',
      notes: ''
    });
    const handleLocationChange = (locationId) => {
      const selectedLocation = activeHospitalLocations.find(loc => String(loc.id) === String(locationId));
      setFormData({
        ...formData,
        hospitalLocationId: locationId,
        doctorId: selectedLocation?.doctor_id || formData.doctorId
      });
    };
    const handleSubmit = async (e) => { e.preventDefault(); try { await createAppointment(formData); onClose(); } catch (_) {} };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Schedule Appointment</h3>
            <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} - {p.category}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Location</label>
              <select value={formData.hospitalLocationId} onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select hospital/location...</option>
                {activeHospitalLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.hospital_name} - {loc.location}{loc.doctor_name ? ` (${loc.doctor_name})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Present</label>
              <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Hospital staff / not assigned</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}{doc.specialty ? ` - ${doc.specialty}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Regular Checkup</option><option>Follow-up</option><option>Consultation</option><option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" />
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Schedule'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const HospitalLocationForm = ({ onClose, editLocation = null }) => {
    const [formData, setFormData] = useState(editLocation ? {
      hospitalName: editLocation.hospital_name || '',
      location: editLocation.location || '',
      address: editLocation.address || '',
      doctorId: editLocation.doctor_id || '',
      status: editLocation.status || 'Active'
    } : {
      hospitalName: '',
      location: '',
      address: '',
      doctorId: '',
      status: 'Active'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        editLocation
          ? await updateHospitalLocation(editLocation.id, formData)
          : await createHospitalLocation(formData);
        setSelectedHospitalLocation(null);
        onClose();
      } catch (_) {}
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{editLocation ? 'Edit Hospital Location' : 'Add Hospital Location'}</h3>
            <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name *</label>
              <input type="text" required value={formData.hospitalName} onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="City Hospital" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Main Branch / Room 204" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Present</label>
              <select value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">No doctor assigned</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}{doc.specialty ? ` - ${doc.specialty}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                {actionLoading ? 'Saving...' : editLocation ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BillForm = ({ onClose }) => {
    const [formData, setFormData] = useState({ patientId: '', amount: '', services: '', status: 'Pending', paymentMethod: '' });
    const handleSubmit = async (e) => { e.preventDefault(); try { await createBill(formData); onClose(); } catch (_) {} };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Create Bill</h3>
            <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select patient...</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services *</label>
              <textarea required value={formData.services} onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3" placeholder="e.g., Blood Test, ECG, Consultation" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Pending</option><option>Paid</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
                {actionLoading ? 'Saving...' : 'Create Bill'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UserForm = ({ onClose, editUser = null }) => {
    const [formData, setFormData] = useState(editUser ? { ...editUser, password: '' } : { username: '', email: '', password: '', role: 'receptionist' });
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!editUser && (!formData.password || formData.password.length < 6)) {
        showAlert('Password must be at least 6 characters', 'error'); return;
      }
      const dup = users.find(u => {
        const sameUser  = u.username?.toLowerCase() === formData.username?.trim().toLowerCase();
        const sameEmail = u.email?.toLowerCase() === formData.email?.trim().toLowerCase();
        return editUser ? u.id !== editUser.id && (sameUser || sameEmail) : sameUser || sameEmail;
      });
      if (dup) { showAlert('Username or email already exists', 'error'); return; }
      try {
        editUser ? await updateUser(editUser.id, formData) : await createUser(formData);
        setSelectedUser(null);
        onClose();
      } catch (_) {}
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{editUser ? 'Edit User' : 'Create New User'}</h3>
            <button onClick={onClose}><X size={24} className="text-gray-500" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="johndoe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="john@hospital.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {editUser && <span className="text-gray-400 font-normal">(leave blank to keep current)</span>}
              </label>
              <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={editUser ? '••••••••' : 'Min 6 characters'}
                {...(!editUser && { required: true, minLength: 6 })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {formData.role === 'admin' && '• Full access including user management'}
                {formData.role === 'doctor' && '• Access to patients, appointments, records'}
                {formData.role === 'receptionist' && '• Access to patients, appointments, billing'}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                {editUser ? 'Update User' : 'Create User'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const InvoiceModal = ({ bill, onClose }) => {
    if (!bill) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Invoice #{bill.id}</h2>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Printer size={18} /> Print
              </button>
              <button onClick={() => showAlert('Connect PDF library for download')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download size={18} /> Download
              </button>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2"><X size={24} /></button>
            </div>
          </div>
          <div className="p-8">
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Activity className="text-blue-600" size={40} />
                <h1 className="text-3xl font-bold text-gray-800">Hospital Management System</h1>
              </div>
              <p className="text-gray-600">123 Medical Center Drive, Healthcare City</p>
              <p className="text-gray-600">Phone: +91 98765 00000 | Email: info@hospital.com</p>
            </div>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-lg text-gray-800 mb-2">{bill.patient_name}</p>
                  {bill.phone && <p className="text-gray-600 text-sm flex items-center gap-2"><Phone size={14} />{bill.phone}</p>}
                  {bill.email && <p className="text-gray-600 text-sm flex items-center gap-2 mt-1"><Mail size={14} />{bill.email}</p>}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Invoice Details:</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between"><span className="text-gray-600">Invoice #:</span><span className="font-semibold">#{bill.id}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Date:</span><span className="font-semibold">{bill.date?.split('T')[0]}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{bill.status}</span>
                  </div>
                  {bill.payment_method && <div className="flex justify-between"><span className="text-gray-600">Method:</span><span className="font-semibold">{bill.payment_method}</span></div>}
                </div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Services:</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bill.services.split(',').map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">{s.trim()}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 text-right">
                          {i === bill.services.split(',').length - 1 ? `₹${parseFloat(bill.amount).toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end mb-8">
              <div className="w-80 bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-semibold">₹{parseFloat(bill.amount).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Tax (0%):</span><span className="font-semibold">₹0.00</span></div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{parseFloat(bill.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600"><span className="font-semibold">Amount in Words: </span><span className="italic">Rupees {numberToWords(bill.amount)} Only</span></p>
            </div>
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">Thank you for choosing our healthcare services!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const today      = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date?.startsWith(today));
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients',        value: stats.totalPatients,                         icon: Users,       color: 'blue' },
            { label: "Today's Appointments",  value: stats.todayAppointments,                     icon: Calendar,    color: 'green' },
            { label: 'Pending Bills',         value: stats.pendingBills,                          icon: AlertCircle, color: 'orange' },
            { label: 'Total Revenue',         value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: TrendingUp,  color: 'purple' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div><p className={`text-${color}-100 text-sm font-medium`}>{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div>
                <Icon size={40} className="opacity-80" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {todayAppts.length > 0 ? todayAppts.map(apt => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{apt.patient_name}</p>
                  <p className="text-sm text-gray-600">{apt.time} - {apt.type}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{apt.status}</span>
              </div>
            )) : <p className="text-gray-500 text-center py-4">No appointments today</p>}
          </div>
        </div>
      </div>
    );
  };

  const Patients = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="text" placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2">
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={() => { setSelectedPatient(null); setShowAddPatient(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <UserPlus size={20} /> Register Patient
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Patient', 'Category', 'Contact', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.age} years</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{p.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Phone size={14} />{p.phone}</div>
                  {p.email && <div className="flex items-center gap-1 mt-1"><Mail size={14} />{p.email}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedPatient(p); setShowAddPatient(true); }} className="text-blue-600 hover:text-blue-900"><Edit2 size={18} /></button>
                    <button onClick={() => deletePatient(p.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && <div className="text-center py-8 text-gray-500">No patients found</div>}
      </div>
    </div>
  );

  const Appointments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <button onClick={() => setShowAddAppointment(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <Calendar size={20} /> New Appointment
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Patient', 'Date & Time', 'Type', 'Doctor / Location', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map(apt => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{apt.patient_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{apt.date?.split('T')[0]}</div>
                  <div className="text-xs text-gray-400">{apt.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.type}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="font-medium text-gray-900">{apt.doctor_name || 'Hospital Staff'}</div>
                  <div className="text-xs text-gray-500">
                    {apt.hospital_name ? `${apt.hospital_name} - ${apt.hospital_location}` : 'Location not assigned'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    apt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    apt.status === 'Rescheduled' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>{apt.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => sendAlert(apt.id)} className="text-green-600 hover:text-green-900" title="Send Alert"><Bell size={18} /></button>
                    <button onClick={() => deleteAppointment(apt.id)} className="text-red-600 hover:text-red-900" title="Cancel"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && <div className="text-center py-8 text-gray-500">No appointments found</div>}
      </div>
    </div>
  );

  const Billing = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Billing</h2>
        <button onClick={() => setShowAddBill(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <TrendingUp size={20} /> Create Bill
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Bill ID', 'Patient', 'Services', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bills.map(bill => (
              <tr key={bill.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{bill.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.patient_name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{bill.services}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{parseFloat(bill.amount).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{bill.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedBill(bill); setShowInvoice(true); }} className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye size={18} /> Invoice
                    </button>
                    <button onClick={() => updateBill(bill.id, { ...bill, status: bill.status === 'Paid' ? 'Pending' : 'Paid' })} className="text-green-600 hover:text-green-900">
                      {bill.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bills.length === 0 && <div className="text-center py-8 text-gray-500">No bills found</div>}
      </div>
      {showInvoice && selectedBill && (
        <InvoiceModal bill={selectedBill} onClose={() => { setShowInvoice(false); setSelectedBill(null); }} />
      )}
    </div>
  );

  const HospitalLocations = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Hospital Locations</h2>
          <p className="text-sm text-gray-600 mt-1">Manage hospital names, visit locations, and doctor presence</p>
        </div>
        <button onClick={() => { setSelectedHospitalLocation(null); setShowAddHospitalLocation(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
          <MapPin size={20} /> Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Locations', value: hospitalLocations.length, icon: Building2, color: 'blue' },
          { label: 'Active', value: hospitalLocations.filter(loc => loc.status === 'Active').length, icon: Activity, color: 'green' },
          { label: 'Doctors Mapped', value: hospitalLocations.filter(loc => loc.doctor_id).length, icon: UserCog, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-${color}-50 border border-${color}-100 rounded-xl p-5`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-${color}-700 text-sm font-medium`}>{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
              </div>
              <Icon size={34} className={`text-${color}-600`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Hospital', 'Location', 'Doctor Present', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hospitalLocations.map(loc => (
              <tr key={loc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{loc.hospital_name}</div>
                  {loc.address && <div className="text-xs text-gray-500 max-w-xs truncate">{loc.address}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{loc.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{loc.doctor_name || 'Not assigned'}</div>
                  {loc.doctor_specialty && <div className="text-xs text-gray-500">{loc.doctor_specialty}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${loc.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                    {loc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedHospitalLocation(loc); setShowAddHospitalLocation(true); }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Edit2 size={18} /> Edit
                    </button>
                    <button onClick={() => deleteHospitalLocation(loc.id)}
                      className="text-red-600 hover:text-red-900 flex items-center gap-1">
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hospitalLocations.length === 0 && <div className="text-center py-8 text-gray-500">No hospital locations found</div>}
      </div>
    </div>
  );

  const UsersManagement = () => {
    if (user?.role !== 'admin') {
      return (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <Shield className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only administrators can access user management.</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-600 mt-1">Manage system users and their permissions</p>
          </div>
          <button onClick={() => { setSelectedUser(null); setShowAddUser(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
            <UserCog size={20} /> Add User
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Users', value: users.length,                              icon: Users,   color: 'purple' },
            { label: 'Admins',      value: users.filter(u => u.role === 'admin').length, icon: Shield,  color: 'blue' },
            { label: 'Active',      value: users.length,                              icon: Activity, color: 'green' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div><p className={`text-${color}-100 text-sm font-medium`}>{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div>
                <Icon size={40} className="opacity-80" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['User', 'Email', 'Role', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{u.username.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{u.username}</div>
                        {u.id === user?.id && <span className="text-xs text-green-600 font-semibold">(You)</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedUser(u); setShowAddUser(true); }} className="text-blue-600 hover:text-blue-900 flex items-center gap-1"><Edit2 size={18} /> Edit</button>
                      {u.id !== user?.id && <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-900 flex items-center gap-1"><Trash2 size={18} /> Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="text-center py-8 text-gray-500">No users found</div>}
        </div>
      </div>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  if (!isLoggedIn) return <LoginForm />;

  const tabs = [
    { id: 'dashboard',    label: 'Dashboard',    icon: Activity },
    { id: 'users',        label: 'Users',        icon: Shield },
    { id: 'patients',     label: 'Patients',     icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'billing',      label: 'Billing',      icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="text-blue-600" size={32} />
              <span className="ml-2 text-xl font-bold text-gray-800">Hospital Management System</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, <span className="font-semibold">{user?.username}</span></span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Toast */}
      {alert.message && (
        <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 text-white ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {alert.message}
        </div>
      )}

      {/* Global loader */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-lg shadow flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent" />
            Processing...
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${activeTab === id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              <Icon size={20} /> {label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard'    && <Dashboard />}
        {activeTab === 'users'        && <UsersManagement />}
        {activeTab === 'patients'     && <Patients />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'billing'      && <Billing />}
      </div>

      {showAddUser      && <UserForm        onClose={() => { setShowAddUser(false);      setSelectedUser(null);    }} editUser={selectedUser} />}
      {showAddPatient   && <PatientForm     onClose={() => { setShowAddPatient(false);   setSelectedPatient(null); }} editPatient={selectedPatient} />}
      {showAddAppointment && <AppointmentForm onClose={() => setShowAddAppointment(false)} />}
      {showAddBill      && <BillForm        onClose={() => setShowAddBill(false)} />}
    </div>
  );
}

export default AdminPortal;

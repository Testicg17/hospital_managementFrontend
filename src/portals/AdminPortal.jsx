// frontend/src/App.jsx - Complete Hospital Management Frontend
// Install dependencies first: npm install axios lucide-react

import React, { useState, useEffect ,useCallback} from 'react';
import axios from 'axios';
import { Calendar, Users, Activity, AlertCircle, TrendingUp, UserPlus, Search, X, Edit2, Trash2, Bell, Phone, Mail, LogOut, LogIn, Eye, Printer, Download, Shield, UserCog } from 'lucide-react';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'https://hospital-managementbackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

function AdminPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingBills: 0,
    totalRevenue: 0
  });

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // UI state: global action loader and toast alerts
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 4000);
  };
  const categories = ['All', 'Diabetes', 'Hypertension', 'Cardiac', 'General', 'Orthopedic', 'Other'];
const [selectedBill, setSelectedBill] = useState(null);
const [showInvoice, setShowInvoice] = useState(false);
const [users, setUsers] = useState([]);
const [showAddUser, setShowAddUser] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
  // Check for stored token
  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch data when logged in
  // eslint-disable-next-line react-hooks/exhaustive-deps
 useEffect(() => {
  if (isLoggedIn && token) {
    fetchData();
  }
}, [isLoggedIn, token, fetchData]);
const fetchUsers = async () => {
  try {
    const { data } = await api.get('/users');
    setUsers(data);
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}; 

 const fetchData = useCallback(async () => {
  try {
    await Promise.all([
      fetchPatients(),
      fetchAppointments(),
      fetchBills(),
      fetchStats(),
      fetchUsers()
    ]);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}, [selectedCategory, searchTerm]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('auth/login', { email, password });
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

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients', {
        params: { category: selectedCategory, search: searchTerm }
      });
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const { data } = await api.get('/bills');
      setBills(data);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const createPatient = async (patientData) => {
    setActionLoading(true);
    try {
      await api.post('/patients', patientData);
      await fetchPatients();
      await fetchStats();
      showAlert('Patient created successfully', 'success');
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
      alert('Error: ' + (err.response?.data?.error || 'Failed to update patient'));
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
      alert('Error: ' + (err.response?.data?.error || 'Failed to delete patient'));
    }
  };

  const createAppointment = async (appointmentData) => {
    setActionLoading(true);
    try {
      await api.post('/appointments', appointmentData);
      await fetchAppointments();
      await fetchStats();
      showAlert('Appointment created', 'success');
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
      alert('Error: ' + (err.response?.data?.error || 'Failed to delete appointment'));
    }
  };

  const sendAlert = async (appointmentId) => {
    try {
      const { data } = await api.post(`/appointments/${appointmentId}/alert`);
      alert(`Alert sent to ${data.patient}\nPhone: ${data.phone}`);
      await fetchAppointments();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || 'Failed to send alert'));
    }
  };

  const createBill = async (billData) => {
    setActionLoading(true);
    try {
      await api.post('/bills', billData);
      await fetchBills();
      await fetchStats();
      showAlert('Bill created successfully', 'success');
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
      alert('Error: ' + (err.response?.data?.error || 'Failed to update bill'));
    }
  };

  // Login Component
  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Activity className="mx-auto text-blue-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">Hospital Management</h1>
            <p className="text-gray-600 mt-2">Sign in to continue</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@hospital.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-500">Email: admin@hospital.com</p>
            <p className="text-xs text-gray-500">Password: password123</p>
          </div>
        </div>
      </div>
    );
  };

  // Patient Form Component
  const PatientForm = ({ onClose, editPatient = null }) => {
    const [formData, setFormData] = useState(editPatient || {
      name: '', age: '', phone: '', email: '', category: 'General', status: 'Active', history: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (editPatient) {
          await updatePatient(editPatient.id, formData);
        } else {
          await createPatient(formData);
        }
        setSelectedPatient(null);
        onClose();
      } catch (err) {
        // Error already handled in create/update functions
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{editPatient ? 'Edit Patient' : 'Register New Patient'}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
              <textarea
                value={formData.history}
                onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading ? 'Saving...' : (editPatient ? 'Update' : 'Register')}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Appointment Form Component
  const AppointmentForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      patientId: '', date: '', time: '', type: 'Regular Checkup', notes: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createAppointment(formData);
        onClose();
      } catch (err) {
        // Error already handled
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Schedule Appointment</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {p.category}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Regular Checkup</option>
                <option>Follow-up</option>
                <option>Consultation</option>
                <option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Schedule'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Bill Form Component
  const BillForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
      patientId: '', amount: '', services: '', status: 'Pending', paymentMethod: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await createBill(formData);
        onClose();
      } catch (err) {
        // Error already handled
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Create Bill</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select
                required
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select patient...</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services *</label>
              <textarea
                required
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="e.g., Blood Test, ECG, Consultation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Pending</option>
                <option>Paid</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {actionLoading ? 'Saving...' : 'Create Bill'}
              </button>
              <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date && a.date.startsWith(today));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Patients</p>
                <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
              </div>
              <Users size={40} className="opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold mt-2">{stats.todayAppointments}</p>
              </div>
              <Calendar size={40} className="opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Pending Bills</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingBills}</p>
              </div>
              <AlertCircle size={40} className="opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <TrendingUp size={40} className="opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Today's Appointments</h3>
          <div className="space-y-3">
            {todayAppts.length > 0 ? (
              todayAppts.map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{apt.patient_name}</p>
                    <p className="text-sm text-gray-600">{apt.time} - {apt.type}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {apt.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments today</p>
            )}
          </div>
        </div>
      </div>
    );
  };
//user component
// 3. Add fetch users function (with other fetch functions)
// const fetchUsers = async () => {
//   try {
//     const { data } = await api.get('/users');
//     setUsers(data);
//   } catch (err) {
//     console.error('Error fetching users:', err);
//   }
// };

// 4. Update the fetchData function to include users
// Add this line inside fetchData():
// await fetchUsers();

const normalizeUserPayload = (userData) => {
  const payload = {
    username: userData.username?.trim(),
    name: userData.username?.trim(),
    email: userData.email?.trim().toLowerCase(),
    role: userData.role?.toLowerCase()
  };

  if (userData.password) {
    payload.password = userData.password;
  }

  return payload;
};

const createUser = async (userData) => {
  try {
    await api.post('/users', normalizeUserPayload(userData));
    await fetchUsers();
    setActiveTab('users');
    showAlert('User created successfully', 'success');
  } catch (err) {
    const message = err.response?.data?.error || err.response?.data?.message || 'Failed to create user';
    console.error('Create user error:', err.response?.data || err);
    showAlert(message, 'error');
    throw err;
  }
};

const updateUser = async (id, userData) => {
  try {
    await api.put(`/users/${id}`, normalizeUserPayload(userData));
    await fetchUsers();
    showAlert('User updated successfully', 'success');
  } catch (err) {
    const message = err.response?.data?.error || err.response?.data?.message || 'Failed to update user';
    console.error('Update user error:', err.response?.data || err);
    showAlert(message, 'error');
    throw err;
  }
};

const deleteUser = async (id) => {
  if (!window.confirm('Delete this user? This action cannot be undone.')) return;
  try {
    await api.delete(`/users/${id}`);
    await fetchUsers();
    alert('User deleted successfully!');
  } catch (err) {
    alert('Error: ' + (err.response?.data?.error || 'Failed to delete user'));
  }
};

// 6. User Form Component - Add this with other form components
const UserForm = ({ onClose, editUser = null }) => {
  const [formData, setFormData] = useState(editUser || {
    username: '',
    email: '',
    password: '',
    role: 'receptionist'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editUser && (!formData.password || formData.password.length < 6)) {
      showAlert('Password must be at least 6 characters long', 'error');
      return;
    }

    const normalizedUsername = formData.username?.trim().toLowerCase();
    const normalizedEmail = formData.email?.trim().toLowerCase();
    const duplicateUser = users.find((u) => {
      const sameUsername = u.username?.toLowerCase() === normalizedUsername;
      const sameEmail = u.email?.toLowerCase() === normalizedEmail;
      return editUser ? u.id !== editUser.id && (sameUsername || sameEmail) : sameUsername || sameEmail;
    });

    if (duplicateUser) {
      showAlert('A user with this username or email already exists.', 'error');
      return;
    }

    try {
      if (editUser) {
        const updateData = { ...formData };
        if (!formData.password) {
          delete updateData.password;
        }
        await updateUser(editUser.id, updateData);
      } else {
        await createUser(formData);
      }
      setSelectedUser(null);
      onClose();
    } catch (err) {
      // Error already handled
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            {editUser ? 'Edit User' : 'Create New User'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="john@hospital.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {editUser && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={editUser ? '••••••••' : 'Min 6 characters'}
              {...(!editUser && { required: true, minLength: 6 })}
            />
            {!editUser && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="receptionist">Receptionist</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.role === 'admin' && '• Full access to all features including user management'}
              {formData.role === 'doctor' && '• Access to patients, appointments, and medical records'}
              {formData.role === 'receptionist' && '• Access to patients, appointments, and billing'}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              {editUser ? 'Update User' : 'Create User'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 7. Users Management Component - Add this with other page components
const UsersManagement = () => {
  // Check if current user is admin
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
        <button
          onClick={() => { setSelectedUser(null); setShowAddUser(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <UserCog size={20} />
          Add User
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <Users size={40} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Admins</p>
              <p className="text-3xl font-bold mt-2">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <Shield size={40} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <Activity size={40} className="opacity-80" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(userItem => (
              <tr key={userItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {userItem.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{userItem.username}</div>
                      {userItem.id === user?.id && (
                        <span className="text-xs text-green-600 font-semibold">(You)</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{userItem.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    userItem.role === 'doctor' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedUser(userItem); setShowAddUser(true); }}
                      className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    {userItem.id !== user?.id && (
                      <button
                        onClick={() => deleteUser(userItem.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                        Delete
                      </button>
                    )}
                    {userItem.id === user?.id && (
                      <span className="text-gray-400 text-xs">(Current User)</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};
  // Patients Component
  const Patients = () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            onClick={() => { setSelectedPatient(null); setShowAddPatient(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <UserPlus size={20} />
            Register Patient
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map(patient => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.age} years</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {patient.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    {patient.phone}
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-1 mt-1">
                      <Mail size={14} />
                      {patient.email}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedPatient(patient); setShowAddPatient(true); }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deletePatient(patient.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No patients found
          </div>
        )}
      </div>
    </div>
  );

  // Appointments Component
  const Appointments = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        <button
          onClick={() => setShowAddAppointment(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <Calendar size={20} />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map(apt => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {apt.patient_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{apt.date?.split('T')[0]}</div>
                  <div className="text-xs text-gray-400">{apt.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{apt.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {apt.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => sendAlert(apt.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Send Alert"
                    >
                      <Bell size={18} />
                    </button>
                    <button
                      onClick={() => deleteAppointment(apt.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Cancel"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
const InvoiceModal = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('Invoice download feature - Connect to PDF generation library');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Invoice Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Invoice #{bill.id}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8" id="invoice-content">
          {/* Hospital Header */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Activity className="text-blue-600" size={40} />
              <h1 className="text-3xl font-bold text-gray-800">Hospital Management System</h1>
            </div>
            <p className="text-gray-600">123 Medical Center Drive, Healthcare City</p>
            <p className="text-gray-600">Phone: +91 98765 00000 | Email: info@hospital.com</p>
          </div>

          {/* Invoice Info Row */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Bill To */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-bold text-lg text-gray-800 mb-2">{bill.patient_name}</p>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                  <Phone size={14} />
                  {bill.phone}
                </p>
                {bill.email && (
                  <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                    <Mail size={14} />
                    {bill.email}
                  </p>
                )}
              </div>
            </div>

            {/* Invoice Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Invoice Details:</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-semibold">#{bill.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{bill.date?.split('T')[0] || new Date().toISOString().split('T')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {bill.status}
                  </span>
                </div>
                {bill.payment_method && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold">{bill.payment_method}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services Table */}
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
                  {bill.services.split(',').map((service, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{service.trim()}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 text-right">
                        {index === bill.services.split(',').length - 1 ? `₹${parseFloat(bill.amount).toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total Section */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{parseFloat(bill.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (0%):</span>
                  <span className="font-semibold">₹0.00</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{parseFloat(bill.amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Amount in Words: </span>
              <span className="italic">Rupees {numberToWords(bill.amount)} Only</span>
            </p>
          </div>

          {/* Footer */}
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

          {/* Thank You Note */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">Thank you for choosing our healthcare services!</p>
            <p className="text-xs text-gray-500 mt-1">For queries, contact us at billing@hospital.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to words (basic implementation)
const numberToWords = (num) => {
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


  // Billing Component
  // Updated Billing Component - Replace your existing Billing component with this
const Billing = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-800">Billing</h2>
      <button
        onClick={() => setShowAddBill(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
      >
        <TrendingUp size={20} />
        Create Bill
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bill ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bills.map(bill => (
            <tr key={bill.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{bill.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.patient_name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{bill.services}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                ₹{parseFloat(bill.amount).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  bill.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bill.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBill(bill);
                      setShowInvoice(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                    title="View Invoice"
                  >
                    <Eye size={18} />
                    Invoice
                  </button>
                  <button
                    onClick={() => {
                      const newStatus = bill.status === 'Paid' ? 'Pending' : 'Paid';
                      updateBill(bill.id, { ...bill, status: newStatus });
                    }}
                    className="text-green-600 hover:text-green-900"
                  >
                    {bill.status === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {bills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bills found
        </div>
      )}
    </div>

    {/* Invoice Modal */}
    {showInvoice && selectedBill && (
      <InvoiceModal 
        bill={selectedBill} 
        onClose={() => {
          setShowInvoice(false);
          setSelectedBill(null);
        }} 
      />
    )}
  </div>
);

  // Main App Render
  if (!isLoggedIn) {
    return <LoginForm />;
  }

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
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span>
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

      {/* Toast alert */}
      {alert.message && (
        <div className={`fixed top-6 right-6 px-4 py-2 rounded shadow z-50 ${alert.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {alert.message}
        </div>
      )}

      {/* Global action loader */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded shadow flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
            <div>Processing...</div>
          </div>
        </div>
      )}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Activity size={20} />
            Dashboard
          </button>
          <button
  onClick={() => setActiveTab('users')}
  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
    activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
  }`}
>
  <Shield size={20} />
  Users
</button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'patients' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={20} />
            Patients
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar size={20} />
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'billing' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <TrendingUp size={20} />
            Billing
          </button>
        
        </div>

        <div>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'users' && <UsersManagement />}
          {activeTab === 'patients' && <Patients />}
          {activeTab === 'appointments' && <Appointments />}
          {activeTab === 'billing' && <Billing />}
        </div>
      </div>
{showAddUser && (
  <UserForm 
    onClose={() => { setShowAddUser(false); setSelectedUser(null); }} 
    editUser={selectedUser}
  />
)}
      {showAddPatient && (
        <PatientForm 
          onClose={() => { setShowAddPatient(false); setSelectedPatient(null); }} 
          editPatient={selectedPatient}
        />
      )}
      {showAddAppointment && (
        <AppointmentForm onClose={() => setShowAddAppointment(false)} />
      )}
      {showAddBill && (
        <BillForm onClose={() => setShowAddBill(false)} />
      )}
      
    </div>
  );
}

export default AdminPortal;
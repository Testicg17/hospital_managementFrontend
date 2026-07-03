import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, LogOut, LogIn, AlertCircle, Check, X, Eye, Stethoscope, Pill, FlaskConical, History, ClipboardList, Mail, Send, MapPin, Plus } from 'lucide-react';

const API_BASE_URL = 'https://hospital-managementbackend.onrender.com/api';

// Store auth in memory instead of localStorage
let authToken = null;
let authUser = null;

const api = {
  setAuth(token, user) {
    authToken = token;
    authUser = user;
    try {
      localStorage.setItem('doctor_token', token);
      localStorage.setItem('doctor_user', JSON.stringify(user));
    } catch (e) {
      // ignore storage errors
    }
  },
  clearAuth() {
    authToken = null;
    authUser = null;
    try {
      localStorage.removeItem('doctor_token');
      localStorage.removeItem('doctor_user');
    } catch (e) {
      // ignore
    }
  },
  getAuth() {
    // prefer in-memory, fall back to localStorage
    if (authToken && authUser) return { token: authToken, user: authUser };
    try {
      const token = localStorage.getItem('doctor_token');
      const user = localStorage.getItem('doctor_user');
      if (token && user) return { token, user: JSON.parse(user) };
    } catch (e) {
      // ignore
    }
    return { token: authToken, user: authUser };
  },
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` })
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    if (response.status === 401) {
      api.clearAuth();
      window.location.reload();
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    return data;
  }
};

function DoctorPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showRescheduleApproval, setShowRescheduleApproval] = useState(false);
  const [showRescheduleInitiate, setShowRescheduleInitiate] = useState(false);
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // restore auth from localStorage if present
    const storedToken = localStorage.getItem('doctor_token');
    const storedUser = localStorage.getItem('doctor_user');
    if (storedToken && storedUser) {
      try {
        api.setAuth(storedToken, JSON.parse(storedUser));
        setDoctor(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (e) {
        // ignore parse errors
      }
    } else {
      const auth = api.getAuth();
      if (auth.token && auth.user) {
        setDoctor(auth.user);
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchHospitalLocations();
      if (activeTab === 'appointments') {
        fetchAppointments();
        fetchPatients();
      }
      else if (activeTab === 'patients') fetchPatients();
    }
  }, [isLoggedIn, activeTab]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.request('/doctor/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.error) {
        setError(data.error);
      } else {
        // Doctor login successful
        api.setAuth(data.token, data.doctor);
        setDoctor(data.doctor);
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.clearAuth();
    setDoctor(null);
    setIsLoggedIn(false);
    setActiveTab('appointments');
  };

  const fetchAppointments = async () => {
    try {
      // use doctor-scoped appointments endpoint so doctor sees own schedule
      const data = await api.request('/doctor/appointments');
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await api.request('/patients');
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatients([]);
    }
  };

  const fetchHospitalLocations = async () => {
    try {
      const data = await api.request('/hospital-locations');
      setHospitalLocations(Array.isArray(data) ? data.filter(loc => loc.status !== 'Inactive') : []);
    } catch (err) {
      console.error('Error fetching hospital locations:', err);
      setHospitalLocations([]);
    }
  };

  const getLocationStartTime = (location) => (
    location?.appointment_start_time || location?.appointmentStartTime || location?.appointment_from_time || location?.appointmentFromTime || location?.start_time || location?.from_time || location?.fromTime || ''
  );

  const getLocationEndTime = (location) => (
    location?.appointment_end_time || location?.appointmentEndTime || location?.appointment_to_time || location?.appointmentToTime || location?.end_time || location?.to_time || location?.toTime || ''
  );

  const formatLocationWindow = (location) => {
    const start = getLocationStartTime(location);
    const end = getLocationEndTime(location);
    return start && end ? `${start} - ${end}` : 'Time not set';
  };

  const getLocationTimeOptions = (location, date, currentAppointmentId = null) => {
    const start = getLocationStartTime(location);
    const end = getLocationEndTime(location);
    if (!start || !end) return [];

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const startTotal = (startHour * 60) + (startMinute || 0);
    const endTotal = (endHour * 60) + (endMinute || 0);
    if (Number.isNaN(startTotal) || Number.isNaN(endTotal) || endTotal < startTotal) return [];

    const bookedTimes = new Set(
      appointments
        .filter((apt) => String(apt.hospital_location_id || apt.hospitalLocationId || '') === String(location.id))
        .filter((apt) => !date || apt.date?.split('T')[0] === date)
        .filter((apt) => !currentAppointmentId || String(apt.id) !== String(currentAppointmentId))
        .filter((apt) => apt.status !== 'Cancelled')
        .map((apt) => apt.time)
    );

    const slots = [];
    for (let total = startTotal; total <= endTotal; total += 30) {
      const hour = String(Math.floor(total / 60)).padStart(2, '0');
      const minute = String(total % 60).padStart(2, '0');
      const time = `${hour}:${minute}`;
      slots.push({ time, booked: bookedTimes.has(time) });
    }
    return slots;
  };

  const getAppointmentLocationText = (apt) => {
    const hospitalName = apt.hospital_name || apt.hospitalName;
    const location = apt.hospital_location || apt.hospitalLocation || apt.location;
    return hospitalName && location ? `${hospitalName} - ${location}` : 'Location not assigned';
  };

  const getAppointmentHospitalLocationId = (apt) => (
    apt?.hospitalLocationId || apt?.hospital_location_id || apt?.hospitalLocation || apt?.hospital_location || ''
  );

  const getAppointmentDoctorId = (apt) => (
    apt?.doctorId || apt?.doctor_id || ''
  );

  const createAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      await api.request('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...appointmentData,
          doctorId: appointmentData.doctorId || appointmentData.doctor_id || doctor?.id || doctor?.doctor_id || null,
          hospitalLocationId: appointmentData.hospitalLocationId || appointmentData.hospital_location_id || null,
          status: 'Scheduled'
        })
      });
      setSuccessMessage('Appointment scheduled');
      setShowCreateAppointment(false);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const extractRescheduleInfo = (notes) => {
    if (!notes) return null;
    const match = notes.match(/\[RESCHEDULE REQUEST\] Requested: (.+?) at (.+?)(?:\n| - |$)/);
    if (match) {
      const locationMatch = notes.match(/Requested location ID: (\d+)/);
      return { requestedDate: match[1], requestedTime: match[2], requestedHospitalLocationId: locationMatch?.[1] || '' };
    }
    return null;
  };

  // Login Screen
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Stethoscope className="mx-auto text-blue-600 mb-4" size={48} />
            <h1 className="text-3xl font-bold text-gray-800">Doctor Portal</h1>
            <p className="text-gray-600 mt-2">Sign in to access patient records</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
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
                placeholder="doctor@hospital.com"
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
        </div>
      </div>
    );
  };

  const DoctorAppointmentModal = () => {
    const [formData, setFormData] = useState({
      patientId: '',
      hospitalLocationId: '',
      date: '',
      time: '',
      type: 'Consultation',
      notes: ''
    });
    const selectedLocation = hospitalLocations.find(loc => String(loc.id) === String(formData.hospitalLocationId));
    const timeOptions = selectedLocation ? getLocationTimeOptions(selectedLocation, formData.date) : [];

    const handleSubmit = async (e) => {
      e.preventDefault();
      await createAppointment(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={24} />
              New Appointment
            </h3>
            <button onClick={() => setShowCreateAppointment(false)} className="text-gray-500 hover:text-gray-700">
              <X size={22} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient *</label>
              <select required value={formData.patientId} onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select patient...</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.name} - {patient.phone}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <select required value={formData.hospitalLocationId} onChange={(e) => setFormData({ ...formData, hospitalLocationId: e.target.value, time: '' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select location...</option>
                {hospitalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.hospital_name} - {location.location} ({formatLocationWindow(location)})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" required value={formData.date} min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                {timeOptions.length > 0 ? (
                  <select required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select available time...</option>
                    {timeOptions.map(({ time, booked }) => (
                      <option key={time} value={time} disabled={booked}>{time}{booked ? ' - booked' : ''}</option>
                    ))}
                  </select>
                ) : (
                  <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Consultation</option>
                <option>Regular Checkup</option>
                <option>Follow-up</option>
                <option>Emergency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Saving...' : 'Schedule Appointment'}
              </button>
              <button type="button" onClick={() => setShowCreateAppointment(false)}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Doctor Initiate Reschedule Modal
  const RescheduleInitiateModal = () => {
    const [reason, setReason] = useState('');
    const [hospitalLocationId, setHospitalLocationId] = useState(getAppointmentHospitalLocationId(selectedAppointment));
    const [suggestedDates, setSuggestedDates] = useState([
      { date: '', time: '' },
      { date: '', time: '' }
    ]);
    const selectedLocation = hospitalLocations.find(loc => String(loc.id) === String(hospitalLocationId));

    const handleAddSlot = () => {
      setSuggestedDates([...suggestedDates, { date: '', time: '' }]);
    };

    const handleRemoveSlot = (index) => {
      setSuggestedDates(suggestedDates.filter((_, i) => i !== index));
    };

    const handleSlotChange = (index, field, value) => {
      const newSlots = [...suggestedDates];
      newSlots[index][field] = value;
      setSuggestedDates(newSlots);
    };

    const handleSubmit = async () => {
      if (!reason.trim()) {
        alert('Please provide a reason for rescheduling');
        return;
      }

      const validSlots = suggestedDates.filter(slot => slot.date && slot.time);
      if (validSlots.length === 0) {
        alert('Please provide at least one suggested date and time');
        return;
      }

      setLoading(true);
      try {
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/reschedule/suggest`, {
          method: 'POST',
          body: JSON.stringify({
            reason,
            hospitalLocationId: hospitalLocationId || null,
            doctorId: getAppointmentDoctorId(selectedAppointment) || doctor?.id || null,
            suggestedDates: validSlots
          })
        });

        if (response.success) {
          setSuccessMessage('✉️ Reschedule request sent to patient via email');
          setShowRescheduleInitiate(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to send reschedule request');
        }
      } catch (err) {
        alert('Error sending reschedule request');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Send size={24} />
            Request Appointment Reschedule
          </h3>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold mb-1">Patient: {selectedAppointment?.patient_name}</p>
            <p className="text-sm text-gray-700">
              Current: {new Date(selectedAppointment?.date).toLocaleDateString()} at {selectedAppointment?.time}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Location: {getAppointmentLocationText(selectedAppointment)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <select
                value={hospitalLocationId}
                onChange={(e) => {
                  setHospitalLocationId(e.target.value);
                  setSuggestedDates(suggestedDates.map(slot => ({ ...slot, time: '' })));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select location...</option>
                {hospitalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.hospital_name} - {location.location} ({formatLocationWindow(location)})
                  </option>
                ))}
                {!selectedLocation && hospitalLocationId && (
                  <option key="current-location" value={hospitalLocationId}>
                    {(selectedAppointment?.hospital_name || selectedAppointment?.hospitalName || 'Current location')} - {(selectedAppointment?.hospital_location || selectedAppointment?.hospitalLocation || selectedAppointment?.location || 'Location')}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Reschedule</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="e.g., Emergency surgery scheduled, Personal unavailability, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Alternative Times</label>
              <div className="space-y-3">
                {suggestedDates.map((slot, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSuggestedDates(suggestedDates.map((item, itemIndex) => (
                          itemIndex === index ? { ...item, date: value, time: '' } : item
                        )));
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {selectedLocation && getLocationTimeOptions(selectedLocation, slot.date, selectedAppointment?.id).length > 0 ? (
                      <select
                        value={slot.time}
                        onChange={(e) => handleSlotChange(index, 'time', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select time...</option>
                        {getLocationTimeOptions(selectedLocation, slot.date, selectedAppointment?.id).map(({ time, booked }) => (
                          <option key={time} value={time} disabled={booked}>{time}{booked ? ' - booked' : ''}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e) => handleSlotChange(index, 'time', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      />
                    )}
                    {suggestedDates.length > 1 && (
                      <button
                        onClick={() => handleRemoveSlot(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddSlot}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                + Add another time slot
              </button>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-start">
                <Mail size={20} className="text-yellow-600 mr-2 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Patient will receive an email notification with your reschedule request and suggested times.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {loading ? 'Sending...' : 'Send Reschedule Request'}
            </button>
            <button
              onClick={() => { setShowRescheduleInitiate(false); setSelectedAppointment(null); }}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Reschedule Approval Modal
  const RescheduleApprovalModal = () => {
    const rescheduleInfo = extractRescheduleInfo(selectedAppointment?.notes);
    const [decision, setDecision] = useState('approve');
    const [hospitalLocationId, setHospitalLocationId] = useState(rescheduleInfo?.requestedHospitalLocationId || getAppointmentHospitalLocationId(selectedAppointment));
    const [alternateDate, setAlternateDate] = useState('');
    const [alternateTime, setAlternateTime] = useState('');
    const selectedLocation = hospitalLocations.find(loc => String(loc.id) === String(hospitalLocationId));
    const alternateTimeOptions = selectedLocation ? getLocationTimeOptions(selectedLocation, alternateDate, selectedAppointment?.id) : [];

    const handleApprove = async () => {
      setLoading(true);
      try {
        const newDate = decision === 'approve' ? rescheduleInfo.requestedDate : alternateDate;
        const newTime = decision === 'approve' ? rescheduleInfo.requestedTime : alternateTime;
        
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/reschedule/approve`, {
          method: 'PUT',
          body: JSON.stringify({
            newDate: decision === 'approve' ? newDate : null,
            newTime: decision === 'approve' ? newTime : null,
            alternateDate: decision === 'alternate' ? alternateDate : null,
            alternateTime: decision === 'alternate' ? alternateTime : null,
            hospitalLocationId: hospitalLocationId || null,
            doctorId: getAppointmentDoctorId(selectedAppointment) || doctor?.id || null
          })
        });
        
        if (response.success) {
          setSuccessMessage('✉️ Reschedule approved! Patient notified via email');
          setShowRescheduleApproval(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to approve reschedule');
        }
      } catch (err) {
        alert('Error approving reschedule');
      } finally {
        setLoading(false);
      }
    };

    const handleReject = async () => {
      setLoading(true);
      try {
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/reschedule/reject`, {
          method: 'PUT',
          body: JSON.stringify({
            reason: 'Unable to accommodate requested time'
          })
        });
        
        if (response.success) {
          setSuccessMessage('Reschedule request rejected and patient notified');
          setShowRescheduleApproval(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to reject reschedule');
        }
      } catch (err) {
        alert('Error rejecting reschedule');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Reschedule Request Approval</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm font-semibold mb-2">Patient: {selectedAppointment?.patient_name}</p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Current:</strong> {new Date(selectedAppointment?.date).toLocaleDateString()} at {selectedAppointment?.time}
            </p>
            <p className="text-sm text-orange-700">
              <strong>Requested:</strong> {rescheduleInfo?.requestedDate} at {rescheduleInfo?.requestedTime}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>Location:</strong> {selectedLocation ? `${selectedLocation.hospital_name} - ${selectedLocation.location}` : getAppointmentLocationText(selectedAppointment)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <select
                value={hospitalLocationId}
                onChange={(e) => {
                  setHospitalLocationId(e.target.value);
                  setAlternateTime('');
                }}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select location...</option>
                {hospitalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.hospital_name} - {location.location} ({formatLocationWindow(location)})
                  </option>
                ))}
                {!selectedLocation && hospitalLocationId && (
                  <option key="current-location" value={hospitalLocationId}>
                    {(selectedAppointment?.hospital_name || selectedAppointment?.hospitalName || 'Current location')} - {(selectedAppointment?.hospital_location || selectedAppointment?.hospitalLocation || selectedAppointment?.location || 'Location')}
                  </option>
                )}
              </select>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={decision === 'approve'}
                  onChange={() => setDecision('approve')}
                  className="w-4 h-4"
                />
                <span>Approve requested time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={decision === 'alternate'}
                  onChange={() => setDecision('alternate')}
                  className="w-4 h-4"
                />
                <span>Suggest alternate time</span>
              </label>
            </div>

            {decision === 'alternate' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={alternateDate}
                    onChange={(e) => {
                      setAlternateDate(e.target.value);
                      setAlternateTime('');
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  {alternateTimeOptions.length > 0 ? (
                    <select
                      value={alternateTime}
                      onChange={(e) => setAlternateTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Select time...</option>
                      {alternateTimeOptions.map(({ time, booked }) => (
                        <option key={time} value={time} disabled={booked}>{time}{booked ? ' - booked' : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="time"
                      value={alternateTime}
                      onChange={(e) => setAlternateTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <div className="flex items-start">
                <Mail size={18} className="text-blue-600 mr-2 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Patient will receive an email confirmation with the new appointment details.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApprove}
              disabled={loading || !hospitalLocationId || (decision === 'alternate' && (!alternateDate || !alternateTime))}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Check size={18} className="inline mr-2" />
              {loading ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <X size={18} className="inline mr-2" />
              Reject
            </button>
            <button
              onClick={() => { setShowRescheduleApproval(false); setSelectedAppointment(null); }}
              className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Consultation Modal
  const ConsultationModal = () => {
    const [prescription, setPrescription] = useState('');
    const [tests, setTests] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    const handleCompleteVisit = async () => {
      if (!diagnosis.trim()) {
        alert('Please enter a diagnosis');
        return;
      }

      setLoading(true);
      try {
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/complete`, {
          method: 'PUT',
          body: JSON.stringify({
            diagnosis,
            prescription,
            tests,
            notes,
            patient_id: selectedAppointment.patient_id
          })
        });

        if (response.success) {
          setSuccessMessage('✉️ Visit completed! Summary sent to patient via email');
          setShowConsultation(false);
          setSelectedAppointment(null);
          setSelectedPatient(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to complete visit');
        }
      } catch (err) {
        alert('Error completing visit');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl p-6 w-full max-w-4xl my-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Patient Consultation</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Patient Information</h4>
              <p><strong>Name:</strong> {selectedPatient?.name}</p>
              <p><strong>Age:</strong> {selectedPatient?.age} years</p>
              <p><strong>Category:</strong> {selectedPatient?.category}</p>
              <p><strong>Phone:</strong> {selectedPatient?.phone}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Appointment</h4>
              <p><strong>Type:</strong> {selectedAppointment?.type}</p>
              <p><strong>Date:</strong> {new Date(selectedAppointment?.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedAppointment?.time}</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ClipboardList size={18} />
                Diagnosis *
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter diagnosis"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Pill size={18} />
                Prescription / Medications
              </label>
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter medications, dosage, and duration..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FlaskConical size={18} />
                Tests / Lab Work Ordered
              </label>
              <textarea
                value={tests}
                onChange={(e) => setTests(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Enter tests to be conducted..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText size={18} />
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Any additional observations or instructions..."
              />
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex items-start">
                <Mail size={20} className="text-green-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">Email Summary</p>
                  <p className="text-sm text-green-800">
                    Patient will receive a detailed email with diagnosis, prescription, and care instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCompleteVisit}
              disabled={loading || !diagnosis.trim()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : <><Check size={20} /> Complete Visit & Send Email</>}
            </button>
            <button
              onClick={() => { setShowConsultation(false); setSelectedAppointment(null); setSelectedPatient(null); }}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Patient Details Modal
  const PatientDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Patient Details</h3>
          <button
            onClick={() => { setShowPatientDetails(false); setSelectedPatient(null); }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Personal Information</h4>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedPatient?.name}</p>
              <p><strong>Age:</strong> {selectedPatient?.age} years</p>
              <p><strong>Category:</strong> {selectedPatient?.category}</p>
              <p><strong>Phone:</strong> {selectedPatient?.phone}</p>
              <p><strong>Email:</strong> {selectedPatient?.email || 'Not provided'}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Medical Information</h4>
            <div className="space-y-2">
              <p><strong>Last Visit:</strong> {selectedPatient?.last_visit ? new Date(selectedPatient.last_visit).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Next Checkup:</strong> {selectedPatient?.next_checkup ? new Date(selectedPatient.next_checkup).toLocaleDateString() : 'Not scheduled'}</p>
              <p><strong>Status:</strong> <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{selectedPatient?.status || 'Active'}</span></p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <History size={20} />
            Medical History
          </h4>
          {selectedPatient?.history ? (
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <p className="text-gray-800 whitespace-pre-wrap">{selectedPatient.history}</p>
            </div>
          ) : (
            <p className="text-gray-500">No medical history recorded</p>
          )}
        </div>
      </div>
    </div>
  );

  // Appointments View
  const AppointmentsView = () => {
    const todayAppointments = appointments.filter(a => {
      const aptDate = new Date(a.date).toDateString();
      const today = new Date().toDateString();
      return aptDate === today;
    });

    const upcomingAppointments = appointments.filter(a => {
      const aptDate = new Date(a.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return aptDate > today;
    });

    const rescheduleRequests = appointments.filter(a => 
      a.status === 'Rescheduled' && extractRescheduleInfo(a.notes)
    );

    const handleStartConsultation = async (appointment) => {
      try {
        const patientData = await api.request(`/patients/${appointment.patient_id}`);
        setSelectedPatient(patientData);
        setSelectedAppointment(appointment);
        setShowConsultation(true);
      } catch (err) {
        alert('Error loading patient data');
      }
    };

    return (
      <div className="space-y-6">
        {/* Success Message Banner */}
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <Check size={20} className="text-green-600 mr-2" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {rescheduleRequests.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
              <AlertCircle size={20} />
              Pending Reschedule Requests ({rescheduleRequests.length})
            </h3>
            <div className="space-y-2">
              {rescheduleRequests.map(apt => {
                const rescheduleInfo = extractRescheduleInfo(apt.notes);
                return (
                  <div key={apt.id} className="bg-white p-3 rounded flex justify-between items-center">
                    <div>
                      <p className="font-medium">{apt.patient_name} - {apt.type}</p>
                      <p className="text-sm text-gray-600">
                        Requested: {rescheduleInfo?.requestedDate} at {rescheduleInfo?.requestedTime}
                      </p>
                    </div>
                    <button
                      onClick={() => { setSelectedAppointment(apt); setShowRescheduleApproval(true); }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Review & Notify
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Today's Appointments ({todayAppointments.length})</h3>
            <button
              onClick={() => setShowCreateAppointment(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} />
              New Appointment
            </button>
          </div>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500">No appointments today</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map(apt => (
                <div key={apt.id} className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800">{apt.patient_name}</h4>
                    <p className="text-sm text-gray-600">{apt.time} - {apt.type}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={13} />
                      {getAppointmentLocationText(apt)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      apt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {apt.status !== 'Completed' && (
                      <>
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Stethoscope size={18} />
                          Start Consultation
                        </button>
                        <button
                          onClick={() => { setSelectedAppointment(apt); setShowRescheduleInitiate(true); }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                          title="Request reschedule"
                        >
                          <Send size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map(apt => (
                <div key={apt.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-800">{apt.patient_name}</h4>
                      <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                      <p className="text-sm text-gray-700">{apt.type}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={13} />
                        {getAppointmentLocationText(apt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                      <button
                        onClick={() => { setSelectedAppointment(apt); setShowRescheduleInitiate(true); }}
                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        title="Request reschedule"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Patients View
  const PatientsView = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );

    const handleViewPatient = async (patientId) => {
      try {
        const patientData = await api.request(`/patients/${patientId}`);
        setSelectedPatient(patientData);
        setShowPatientDetails(true);
      } catch (err) {
        alert('Error loading patient details');
      }
    };

    return (
      <div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search patients by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="bg-white rounded-xl shadow-md p-4">
              <h4 className="font-semibold text-gray-800 mb-2">{patient.name}</h4>
              <p className="text-sm text-gray-600 mb-1">Age: {patient.age} years</p>
              <p className="text-sm text-gray-600 mb-1">Category: {patient.category}</p>
              <p className="text-sm text-gray-600 mb-3">Phone: {patient.phone}</p>
              <button
                onClick={() => handleViewPatient(patient.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Stethoscope className="text-blue-600" size={32} />
              <span className="ml-2 text-xl font-bold text-gray-800">Doctor Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Dr. <span className="font-semibold">{doctor?.username}</span>
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
        <div className="flex gap-4 mb-6">
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
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'patients' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User size={20} />
            Patients
          </button>
        </div>

        {activeTab === 'appointments' && <AppointmentsView />}
        {activeTab === 'patients' && <PatientsView />}
      </div>

      {showRescheduleApproval && <RescheduleApprovalModal />}
      {showRescheduleInitiate && <RescheduleInitiateModal />}
      {showCreateAppointment && <DoctorAppointmentModal />}
      {showConsultation && <ConsultationModal />}
      {showPatientDetails && <PatientDetailsModal />}
    </div>
  );
}

export default DoctorPortal;

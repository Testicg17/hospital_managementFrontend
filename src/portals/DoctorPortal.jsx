import React, { useState, useEffect } from 'react';
import { User, Calendar, FileText, LogOut, LogIn, AlertCircle, Check, X, Eye, Stethoscope, Pill, FlaskConical, History, ClipboardList, Mail, Send, MapPin, Plus, Printer } from 'lucide-react';
import LogoLoader from '../components/LogoLoader';
import BrandMark from '../components/BrandMark';
import SEO from '../components/SEO';
import { clinic as clinicInfo } from './public_Website/siteData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hospital-managementbackend.onrender.com/api';
const clinicLetterName = `${clinicInfo.name}${clinicInfo.localName ? ` ${clinicInfo.localName}` : ''}`;
const clinicAddressLine = clinicInfo.address
  .replace(clinicInfo.name, '')
  .replace(clinicInfo.localName || '', '')
  .replace(/^[\s,]+/, '')
  .replace(/\s{2,}/g, ' ')
  .trim();

// Store auth in memory instead of localStorage
let authToken = null;
let authUser = null;

const api = {
  setAuth(token, user) {
    authToken = token;
    authUser = user;
    try {
      sessionStorage.setItem('doctor_token', token);
      sessionStorage.setItem('doctor_user', JSON.stringify(user));
      localStorage.removeItem('doctor_token');
      localStorage.removeItem('doctor_user');
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
      sessionStorage.removeItem('doctor_token');
      sessionStorage.removeItem('doctor_user');
    } catch (e) {
      // ignore
    }
  },
  getAuth() {
    // prefer in-memory, fall back to localStorage
    if (authToken && authUser) return { token: authToken, user: authUser };
    try {
      const token = sessionStorage.getItem('doctor_token') || localStorage.getItem('doctor_token');
      const user = sessionStorage.getItem('doctor_user') || localStorage.getItem('doctor_user');
      if (token && user) {
        authToken = token;
        authUser = JSON.parse(user);
        return { token: authToken, user: authUser };
      }
    } catch (e) {
      // ignore
    }
    return { token: authToken, user: authUser };
  },
  async request(endpoint, options = {}) {
    const auth = api.getAuth();
    const headers = {
      'Content-Type': 'application/json',
      ...(auth.token && { Authorization: `Bearer ${auth.token}` })
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    const data = await response.json();
    const authFailed = [401, 403].includes(response.status)
      && ['Access token required', 'Token expired', 'Invalid token', 'Access denied'].includes(data?.error);

    if (authFailed) {
      api.clearAuth();
      window.location.reload();
    }
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return data;
  }
};

const isSuccessfulResponse = (response) => (
  response?.success === true || response?.message || response?.appointment || response?.data || response?.id
);

const createMedicationRow = () => ({
  medicationName: '',
  dosingSchedule: '',
  durationDays: ''
});

const padDatePart = (value) => String(value).padStart(2, '0');

const toDateInputValue = (date) => (
  `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
);

const getAppointmentScheduleLimits = () => {
  const now = new Date();
  const minDateTime = new Date(now.getTime() + (2 * 60 * 60 * 1000));
  const maxDate = new Date(now);
  maxDate.setMonth(maxDate.getMonth() + 1);

  return {
    minDate: toDateInputValue(now),
    maxDate: toDateInputValue(maxDate),
    minDateTime
  };
};

const parseAppointmentDateTime = (dateValue, timeValue = '00:00') => {
  if (!dateValue) return null;
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hour = 0, minute = 0] = String(timeValue || '00:00').split(':').map(Number);
  if ([year, month, day, hour, minute].some(Number.isNaN)) return null;
  return new Date(year, month - 1, day, hour, minute, 0, 0);
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
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // restore auth from localStorage if present
    const storedToken = sessionStorage.getItem('doctor_token') || localStorage.getItem('doctor_token');
    const storedUser = sessionStorage.getItem('doctor_user') || localStorage.getItem('doctor_user');
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
      const fetchPortalData = async () => {
        setDataLoading(true);
        try {
          await fetchHospitalLocations();
          if (activeTab === 'appointments') {
            await Promise.all([fetchAppointments(), fetchPatients()]);
          }
          else if (activeTab === 'patients') await fetchPatients();
        } finally {
          setDataLoading(false);
        }
      };

      fetchPortalData();
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

  const getScheduleValidationMessage = (date, time) => {
    const { minDate, maxDate, minDateTime } = getAppointmentScheduleLimits();
    if (!date) return 'Please select appointment date';
    if (date < minDate) return 'Appointment date cannot be in the past';
    if (date > maxDate) return 'Appointment date must be within 1 month from today';
    if (!time) return 'Please select appointment time';
    const selectedDateTime = parseAppointmentDateTime(date, time);
    if (!selectedDateTime || selectedDateTime < minDateTime) return 'Appointment time must be at least 2 hours from now';
    return '';
  };

  const isScheduleSlotAllowed = (date, time) => !getScheduleValidationMessage(date, time);

  const getAppointmentLocationText = (apt) => {
    const hospitalName = apt.hospital_name || apt.hospitalName;
    const location = apt.hospital_location || apt.hospitalLocation || apt.location;
    return hospitalName && location ? `${hospitalName} - ${location}` : 'Location not assigned';
  };

  const getAppointmentHospitalLocationId = (apt) => (
    apt?.hospitalLocationId || apt?.hospital_location_id || ''
  );

  const getAppointmentDoctorId = (apt) => (
    apt?.doctorId || apt?.doctor_id || ''
  );

  const createAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      const payload = {
        ...appointmentData,
        doctorId: appointmentData.doctorId || appointmentData.doctor_id || null,
        hospitalLocationId: appointmentData.hospitalLocationId || appointmentData.hospital_location_id || null,
        status: 'Scheduled'
      };
      await api.request('/appointments', { method: 'POST', body: JSON.stringify(payload) });
      setSuccessMessage('Appointment scheduled');
      setShowCreateAppointment(false);
      fetchAppointments();
    } catch (err) {
      console.error('[DoctorPortal] createAppointment error', err);
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

  const getNoteValue = (notes, label) => {
    const labels = ['Diagnosis', 'Prescription', 'Tests Ordered', 'Next Checkup', 'Advice', 'Notes'];
    const nextLabelPattern = labels
      .filter((item) => item !== label)
      .join('|');
    const match = String(notes || '').match(new RegExp(`(?:^|\\n)${label}:\\s*([\\s\\S]*?)(?=\\n(?:${nextLabelPattern}):|\\n\\[|$)`, 'i'));
    return match?.[1]?.trim() || '';
  };

  const escapeHtml = (value) => String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');

  const parseMedicationPrescription = (prescription) => {
    const rows = String(prescription || '')
      .split('\n')
      .map((line) => {
        const match = line.match(/^\d+\.\s*Medication Name:\s*(.*?);\s*Dosing Schedule:\s*(.*?);\s*Treatment Duration:\s*(.*?)\s*day\(s\)$/i);
        if (!match) return null;
        return {
          medicationName: match[1].trim(),
          dosingSchedule: match[2].trim(),
          durationDays: match[3].trim()
        };
      })
      .filter(Boolean);

    return rows.length ? rows : null;
  };

  const renderPrescriptionForPrint = (prescription) => {
    const medicationRows = parseMedicationPrescription(prescription);
    if (!medicationRows) return `<div class="box">${escapeHtml(prescription || 'None')}</div>`;

    return `
      <table class="med-table">
        <thead>
          <tr>
            <th>Medication Name</th>
            <th>Dosing Schedule</th>
            <th>Treatment Duration</th>
          </tr>
        </thead>
        <tbody>
          ${medicationRows.map((row) => `
            <tr>
              <td>${escapeHtml(row.medicationName)}</td>
              <td>${escapeHtml(row.dosingSchedule)}</td>
              <td>${escapeHtml(row.durationDays)} day(s)</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  };

  const parsePatientHistory = (historyText) => {
    if (!historyText) return { mainHistory: '', visits: [] };

    const visitRegex = /\[(\d{1,2}\/\d{1,2}\/\d{4})\] Visit Summary:\s*Diagnosis:\s*([\s\S]*?)\nPrescription:\s*([\s\S]*?)\nTests Ordered:\s*([\s\S]*?)(?:\nNext Checkup:\s*([\s\S]*?))?\nNotes:\s*([\s\S]*?)(?=\n\[\d{1,2}\/\d{1,2}\/\d{4}\] Visit Summary:|$)/g;
    const visits = [];
    let match;

    while ((match = visitRegex.exec(historyText)) !== null) {
      visits.push({
        date: match[1],
        diagnosis: match[2].trim(),
        prescription: match[3].trim(),
        tests: match[4].trim(),
        nextCheckup: (match[5] || '').trim(),
        notes: match[6].trim()
      });
    }

    const firstVisitIndex = historyText.search(/\[\d{1,2}\/\d{1,2}\/\d{4}\] Visit Summary:/);
    const mainHistory = firstVisitIndex > 0 ? historyText.substring(0, firstVisitIndex).trim() : '';

    return { mainHistory, visits };
  };

  const MedicationPrescriptionTable = ({ prescription }) => {
    const medicationRows = parseMedicationPrescription(prescription);
    if (!medicationRows) {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800 whitespace-pre-wrap">
          {prescription || 'None'}
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border border-blue-100">
        <div className="hidden grid-cols-[1.3fr_1.2fr_0.7fr] gap-3 bg-blue-50 px-4 py-3 text-xs font-semibold uppercase text-blue-700 md:grid">
          <span>Medication Name</span>
          <span>Dosing Schedule</span>
          <span>Treatment Duration</span>
        </div>
        <div className="divide-y divide-blue-100 bg-white">
          {medicationRows.map((row, index) => (
            <div key={`${row.medicationName}-${index}`} className="grid grid-cols-1 gap-3 p-4 text-sm md:grid-cols-[1.3fr_1.2fr_0.7fr]">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500 md:hidden">Medication Name</p>
                <p className="font-medium text-gray-900">{row.medicationName}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500 md:hidden">Dosing Schedule</p>
                <p className="text-gray-800">{row.dosingSchedule}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500 md:hidden">Treatment Duration</p>
                <p className="text-gray-800">{row.durationDays} day(s)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PatientHistoryView = ({ historyText }) => {
    const { mainHistory, visits } = parsePatientHistory(historyText);

    if (!mainHistory && !visits.length) {
      return (
        <div className="rounded-lg bg-gray-50 p-4 text-gray-800 whitespace-pre-wrap">
          {historyText}
        </div>
      );
    }

    return (
      <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
        {mainHistory && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText size={17} className="text-blue-700" />
              <h5 className="font-semibold text-blue-950">Background Notes</h5>
            </div>
            <p className="text-sm leading-relaxed text-blue-950 whitespace-pre-wrap">{mainHistory}</p>
          </div>
        )}

        {visits.map((visit, index) => (
          <div key={`${visit.date}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 border-b border-gray-100 pb-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={17} className="text-blue-600" />
                <h5 className="font-semibold text-gray-900">Visit Summary</h5>
              </div>
              <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {formatDate(visit.date)}
              </span>
            </div>

            <div className="grid gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Diagnosis</p>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900">{visit.diagnosis || 'Not specified'}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Prescription / Medications</p>
                <MedicationPrescriptionTable prescription={visit.prescription} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Tests / Lab Work Ordered</p>
                  <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 whitespace-pre-wrap">{visit.tests || 'None'}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Next Checkup</p>
                  <p className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-sm font-medium text-orange-900">
                    {visit.nextCheckup ? formatDate(visit.nextCheckup) : 'Not scheduled'}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-gray-500">Clinical Notes</p>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 whitespace-pre-wrap">{visit.notes || 'No additional notes'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (value) => {
    if (!value || value === 'Not scheduled') return value || 'Not scheduled';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const buildConsultationLetterData = (appointment, patientData = null, overrides = {}) => ({
    appointmentId: appointment?.id || '',
    patientName: patientData?.name || appointment?.patient_name || 'Patient',
    patientAge: patientData?.age || appointment?.patient_age || '',
    patientPhone: patientData?.phone || appointment?.patient_phone || '',
    doctorName: appointment?.doctor_name || doctor?.name || doctor?.username || 'Doctor',
    appointmentType: appointment?.type || 'Consultation',
    appointmentDate: appointment?.date,
    appointmentTime: appointment?.time,
    location: getAppointmentLocationText(appointment || {}),
    diagnosis: overrides.diagnosis || getNoteValue(appointment?.notes, 'Diagnosis') || 'Not specified',
    prescription: overrides.prescription || getNoteValue(appointment?.notes, 'Prescription') || 'None',
    tests: overrides.tests || getNoteValue(appointment?.notes, 'Tests Ordered') || 'None',
    nextCheckup: overrides.nextCheckupDate || getNoteValue(appointment?.notes, 'Next Checkup') || 'Not scheduled',
    advice: overrides.notes || getNoteValue(appointment?.notes, 'Advice') || getNoteValue(appointment?.notes, 'Notes') || 'Follow prescribed treatment plan'
  });

  const printConsultationLetter = (letterData) => {
    const html = `
      <!doctype html>
      <html>
        <head>
          <title>Consultation Letter - ${escapeHtml(letterData.patientName)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 0; padding: 32px; }
            .letter { max-width: 820px; margin: 0 auto; border: 1px solid #d1d5db; padding: 32px; }
            .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; align-items: flex-start; gap: 16px; }
            .logo { width: 72px; height: 72px; object-fit: contain; border: 1px solid #dbeafe; border-radius: 14px; padding: 4px; }
            h1 { margin: 0; color: #1d4ed8; font-size: 26px; }
            .muted { color: #6b7280; font-size: 13px; }
            .letter-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 3px; }
            .letter-meta .muted + .muted::before { content: "& "; }
            .clinic-address { margin-top: 6px; color: #374151; font-size: 13px; line-height: 1.45; }
            .clinic-contact { margin-top: 4px; color: #1f2937; font-size: 13px; font-weight: 600; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 24px; }
            .field { border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
            .label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 700; }
            .value { margin-top: 4px; font-size: 15px; }
            .section { margin-top: 18px; }
            .section h2 { font-size: 15px; color: #111827; margin: 0 0 8px; }
            .box { background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; min-height: 34px; }
            .med-table { width: 100%; border-collapse: collapse; font-size: 14px; }
            .med-table th { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; }
            .med-table td { border: 1px solid #e5e7eb; padding: 10px; vertical-align: top; }
            .footer { margin-top: 42px; display: flex; justify-content: space-between; align-items: end; }
            .sign { text-align: right; min-width: 220px; border-top: 1px solid #111827; padding-top: 8px; }
            @media print { body { padding: 0; } .letter { border: none; } }
          </style>
        </head>
        <body>
          <div class="letter">
            <div class="header">
              <img class="logo" src="/images/logo-optimized.jpg" alt="Hospital Logo" />
              <div>
                <h1>${escapeHtml(clinicLetterName)}</h1>
                <div class="clinic-address">${escapeHtml(clinicAddressLine)}</div>
                <div class="clinic-contact">Phone: ${escapeHtml(clinicInfo.phone)} | Email: ${escapeHtml(clinicInfo.email)}</div>
                <div class="letter-meta">
                  <span class="muted">Consultation Letter</span>
                  <span class="muted">Generated on ${new Date().toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            <div class="grid">
              <div class="field"><div class="label">Patient</div><div class="value">${escapeHtml(letterData.patientName)}</div></div>
              <div class="field"><div class="label">Age / Phone</div><div class="value">${escapeHtml(letterData.patientAge || 'N/A')} ${letterData.patientPhone ? ` / ${escapeHtml(letterData.patientPhone)}` : ''}</div></div>
              <div class="field"><div class="label">Doctor</div><div class="value">Dr. ${escapeHtml(letterData.doctorName)}</div></div>
              <div class="field"><div class="label">Appointment</div><div class="value">#${escapeHtml(letterData.appointmentId)} - ${escapeHtml(letterData.appointmentType)}</div></div>
              <div class="field"><div class="label">Date & Time</div><div class="value">${escapeHtml(formatDate(letterData.appointmentDate))} at ${escapeHtml(letterData.appointmentTime || '')}</div></div>
              <div class="field"><div class="label">Location</div><div class="value">${escapeHtml(letterData.location)}</div></div>
            </div>
            <div class="section"><h2>Diagnosis</h2><div class="box">${escapeHtml(letterData.diagnosis)}</div></div>
            <div class="section"><h2>Prescription / Medications</h2>${renderPrescriptionForPrint(letterData.prescription)}</div>
            <div class="section"><h2>Tests / Lab Work Ordered</h2><div class="box">${escapeHtml(letterData.tests)}</div></div>
            <div class="section"><h2>Advice / Notes</h2><div class="box">${escapeHtml(letterData.advice)}</div></div>
            <div class="section"><h2>Next Checkup</h2><div class="box">${escapeHtml(formatDate(letterData.nextCheckup))}</div></div>
            <div class="footer">
              <div class="muted">This letter is generated from the hospital management system.</div>
              <div class="sign">Doctor Signature</div>
            </div>
          </div>
          <script>window.onload = () => { window.print(); };</script>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Please allow popups to print the consultation letter.');
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Login Screen
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await handleLogin(email, password);
      } finally {
        setPassword('');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
        {loading && <LogoLoader overlay label="Signing in..." />}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <BrandMark size="lg" centered title="Eva Fertility & Laparoscopy" subtitle="Doctor Portal Login" />
            <p className="text-gray-600 mt-4">Sign in to access patient records</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
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
                autoComplete="current-password"
                spellCheck="false"
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
    const scheduleLimits = getAppointmentScheduleLimits();

    const handleSubmit = async (e) => {
      e.preventDefault();
      const scheduleError = getScheduleValidationMessage(formData.date, formData.time);
      if (scheduleError) {
        alert(scheduleError);
        return;
      }
      await createAppointment(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        {loading && <LogoLoader overlay label="Creating appointment..." />}
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={24} />
              New Appointment
            </h3>
            <button onClick={() => setShowCreateAppointment(false)} disabled={loading} className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50">
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
                <input type="date" required value={formData.date} min={scheduleLimits.minDate} max={scheduleLimits.maxDate}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                <p className="mt-1 text-xs text-gray-500">Allowed from today to 1 month ahead.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                {timeOptions.length > 0 ? (
                  <select required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Select available time...</option>
                    {timeOptions.map(({ time, booked }) => {
                      const outsideWindow = !isScheduleSlotAllowed(formData.date, time);
                      return (
                        <option key={time} value={time} disabled={booked || outsideWindow}>
                          {time}{booked ? ' - booked' : ''}{!booked && outsideWindow ? ' - not available' : ''}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                )}
                <p className="mt-1 text-xs text-gray-500">Same-day time must be at least 2 hours from now.</p>
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
              <button type="button" onClick={() => setShowCreateAppointment(false)} disabled={loading}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50">
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
    const scheduleLimits = getAppointmentScheduleLimits();

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
      const invalidSlot = validSlots.find(slot => getScheduleValidationMessage(slot.date, slot.time));
      if (invalidSlot) {
        alert(getScheduleValidationMessage(invalidSlot.date, invalidSlot.time));
        return;
      }

      setLoading(true);
      try {
        const body = {
          reason,
          hospitalLocationId: hospitalLocationId || null,
          doctorId: getAppointmentDoctorId(selectedAppointment) || null,
          suggestedDates: validSlots
        };
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/reschedule/suggest`, {
          method: 'POST',
          body: JSON.stringify(body)
        });

        if (isSuccessfulResponse(response)) {
          setSuccessMessage('✉️ Reschedule request sent to patient via email');
          setShowRescheduleInitiate(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to send reschedule request');
        }
      } catch (err) {
        alert(err.message || 'Error sending reschedule request');
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
                      min={scheduleLimits.minDate}
                      max={scheduleLimits.maxDate}
                    />
                    {selectedLocation && getLocationTimeOptions(selectedLocation, slot.date, selectedAppointment?.id).length > 0 ? (
                      <select
                        value={slot.time}
                        onChange={(e) => handleSlotChange(index, 'time', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg"
                      >
                        <option value="">Select time...</option>
                        {getLocationTimeOptions(selectedLocation, slot.date, selectedAppointment?.id).map(({ time, booked }) => {
                          const outsideWindow = !isScheduleSlotAllowed(slot.date, time);
                          return (
                            <option key={time} value={time} disabled={booked || outsideWindow}>
                              {time}{booked ? ' - booked' : ''}{!booked && outsideWindow ? ' - not available' : ''}
                            </option>
                          );
                        })}
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
    const scheduleLimits = getAppointmentScheduleLimits();

    const handleApprove = async () => {
      setLoading(true);
      try {
        const newDate = decision === 'approve' ? rescheduleInfo.requestedDate : alternateDate;
        const newTime = decision === 'approve' ? rescheduleInfo.requestedTime : alternateTime;
        const scheduleError = getScheduleValidationMessage(newDate, newTime);
        if (scheduleError) {
          alert(scheduleError);
          setLoading(false);
          return;
        }
        
        const body = {
          newDate: decision === 'approve' ? newDate : null,
          newTime: decision === 'approve' ? newTime : null,
          alternateDate: decision === 'alternate' ? alternateDate : null,
          alternateTime: decision === 'alternate' ? alternateTime : null,
          hospitalLocationId: hospitalLocationId || null,
          doctorId: getAppointmentDoctorId(selectedAppointment) || null
        };
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/reschedule/approve`, {
          method: 'PUT',
          body: JSON.stringify(body)
        });

        if (isSuccessfulResponse(response)) {
          setSuccessMessage('✉️ Reschedule approved! Patient notified via email');
          setShowRescheduleApproval(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to approve reschedule');
        }
      } catch (err) {
        alert(err.message || 'Error approving reschedule');
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
        
        if (isSuccessfulResponse(response)) {
          setSuccessMessage('Reschedule request rejected and patient notified');
          setShowRescheduleApproval(false);
          setSelectedAppointment(null);
          fetchAppointments();
        } else {
          alert(response.error || 'Failed to reject reschedule');
        }
      } catch (err) {
        alert(err.message || 'Error rejecting reschedule');
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
                    min={scheduleLimits.minDate}
                    max={scheduleLimits.maxDate}
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
                      {alternateTimeOptions.map(({ time, booked }) => {
                        const outsideWindow = !isScheduleSlotAllowed(alternateDate, time);
                        return (
                          <option key={time} value={time} disabled={booked || outsideWindow}>
                            {time}{booked ? ' - booked' : ''}{!booked && outsideWindow ? ' - not available' : ''}
                          </option>
                        );
                      })}
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
                <p className="col-span-2 -mt-1 text-xs text-gray-500">Alternate time must be within 1 month and at least 2 hours from now.</p>
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
    const [medicationRows, setMedicationRows] = useState([createMedicationRow()]);
    const [tests, setTests] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [nextCheckupDate, setNextCheckupDate] = useState(
      selectedPatient?.next_checkup ? selectedPatient.next_checkup.split('T')[0] : ''
    );
    const [notes, setNotes] = useState('');

    const updateMedicationRow = (index, field, value) => {
      setMedicationRows((rows) => rows.map((row, rowIndex) => (
        rowIndex === index ? { ...row, [field]: value } : row
      )));
    };

    const addMedicationRow = () => {
      setMedicationRows((rows) => [...rows, createMedicationRow()]);
    };

    const removeMedicationRow = (index) => {
      setMedicationRows((rows) => rows.filter((_, rowIndex) => rowIndex !== index));
    };

    const formatMedicationPrescription = () => {
      const filledRows = medicationRows
        .map((row) => ({
          medicationName: row.medicationName.trim(),
          dosingSchedule: row.dosingSchedule.trim(),
          durationDays: row.durationDays.trim()
        }))
        .filter((row) => row.medicationName || row.dosingSchedule || row.durationDays);

      return filledRows
        .map((row, index) => (
          `${index + 1}. Medication Name: ${row.medicationName}; Dosing Schedule: ${row.dosingSchedule}; Treatment Duration: ${row.durationDays} day(s)`
        ))
        .join('\n');
    };

    const hasIncompleteMedicationRows = () => medicationRows.some((row) => {
      const hasAnyValue = row.medicationName.trim() || row.dosingSchedule.trim() || row.durationDays.trim();
      const hasAllValues = row.medicationName.trim() && row.dosingSchedule.trim() && row.durationDays.trim();
      return hasAnyValue && !hasAllValues;
    });

    const handleCompleteVisit = async () => {
      if (!diagnosis.trim()) {
        alert('Please enter a diagnosis');
        return;
      }

      if (hasIncompleteMedicationRows()) {
        alert('Please complete medication name, dosing schedule, and duration for each medication row');
        return;
      }

      const prescription = formatMedicationPrescription();

      setLoading(true);
      try {
        const response = await api.request(`/doctor/appointments/${selectedAppointment.id}/complete`, {
          method: 'PUT',
          body: JSON.stringify({
            diagnosis,
            prescription,
            tests,
            nextCheckupDate,
            notes,
            patient_id: selectedAppointment.patient_id
          })
        });

        if (isSuccessfulResponse(response)) {
          setSuccessMessage('✉️ Visit completed! Summary sent to patient via email');
          setShowConsultation(false);
          setSelectedAppointment(null);
          setSelectedPatient(null);
          fetchAppointments();
          fetchPatients();
        } else {
          alert(response.error || 'Failed to complete visit');
        }
      } catch (err) {
        alert(err.message || 'Error completing visit');
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
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="hidden grid-cols-[1.3fr_1.2fr_0.7fr_44px] gap-3 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-500 md:grid">
                  <span>Medication Name</span>
                  <span>Dosing Schedule</span>
                  <span>Treatment Duration (Days)</span>
                  <span className="sr-only">Action</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {medicationRows.map((row, index) => (
                    <div key={index} className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1.3fr_1.2fr_0.7fr_44px] md:items-center">
                      <label className="block md:sr-only">
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Medication Name</span>
                      </label>
                      <input
                        type="text"
                        value={row.medicationName}
                        onChange={(e) => updateMedicationRow(index, 'medicationName', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Example: Tab. Paracetamol 500 mg"
                      />

                      <label className="block md:sr-only">
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Dosing Schedule</span>
                      </label>
                      <input
                        type="text"
                        value={row.dosingSchedule}
                        onChange={(e) => updateMedicationRow(index, 'dosingSchedule', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="Example: 1-0-1 after meals"
                      />

                      <label className="block md:sr-only">
                        <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Treatment Duration (Days)</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={row.durationDays}
                        onChange={(e) => updateMedicationRow(index, 'durationDays', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="5"
                      />

                      <button
                        type="button"
                        onClick={() => removeMedicationRow(index)}
                        disabled={medicationRows.length === 1}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Remove medication"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">Suggested slots must be from today to 1 month ahead, and at least 2 hours from now.</p>
              <button
                type="button"
                onClick={addMedicationRow}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                <Plus size={16} />
                Add Medication
              </button>
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
                <Calendar size={18} />
                Next Checkup Date
              </label>
              <input
                type="date"
                value={nextCheckupDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setNextCheckupDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              onClick={() => printConsultationLetter(buildConsultationLetterData(selectedAppointment, selectedPatient, {
                diagnosis,
                prescription: formatMedicationPrescription(),
                tests,
                nextCheckupDate,
                notes
              }))}
              disabled={!diagnosis.trim() || hasIncompleteMedicationRows()}
              className="px-5 bg-white border border-blue-200 text-blue-700 py-3 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Printer size={20} />
              Print Letter
            </button>
            <button
              onClick={handleCompleteVisit}
              disabled={loading || !diagnosis.trim() || hasIncompleteMedicationRows()}
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
            <PatientHistoryView historyText={selectedPatient.history} />
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
    const completedAppointments = appointments.filter(a => a.status === 'Completed');

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
                    {apt.status === 'Completed' && (
                      <button
                        onClick={() => printConsultationLetter(buildConsultationLetterData(apt))}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                      >
                        <Printer size={18} />
                        Print Letter
                      </button>
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

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Completed Consultations</h3>
          {completedAppointments.length === 0 ? (
            <p className="text-gray-500">No completed consultations yet</p>
          ) : (
            <div className="space-y-3">
              {completedAppointments.map(apt => (
                <div key={apt.id} className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{apt.patient_name}</h4>
                      <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                      <p className="text-sm text-gray-700">{apt.type}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={13} />
                        {getAppointmentLocationText(apt)}
                      </p>
                    </div>
                    <button
                      onClick={() => printConsultationLetter(buildConsultationLetterData(apt))}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Printer size={18} />
                      Print Letter
                    </button>
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
    return (
      <>
        <SEO title="Doctor Portal | Eva Fertility & Laparoscopy" description="Private doctor portal." path="/doctor" robots="noindex, nofollow" />
        <LoginScreen />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SEO title="Doctor Portal | Eva Fertility & Laparoscopy" description="Private doctor portal." path="/doctor" robots="noindex, nofollow" />
      {loading && isLoggedIn && <LogoLoader overlay label="Processing request..." />}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BrandMark size="sm" title="Eva Fertility & Laparoscopy" subtitle="Doctor Portal" />
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

        {dataLoading ? (
          <div className="rounded-xl bg-white py-20 shadow-sm">
            <LogoLoader label="Loading doctor portal data..." />
          </div>
        ) : (
          <>
            {activeTab === 'appointments' && <AppointmentsView />}
            {activeTab === 'patients' && <PatientsView />}
          </>
        )}
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

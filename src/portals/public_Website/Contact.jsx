import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarCheck, CheckCircle2, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import LogoLoader from '../../components/LogoLoader';
import { clinic, services } from './siteData';
import { useLanguage } from './LanguageContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://hospital-managementbackend.onrender.com/api';
const PUBLIC_BOOKING_ENDPOINT = process.env.REACT_APP_PUBLIC_BOOKING_ENDPOINT || '/public/appointments';
const patientCategories = ['General', 'Diabetes', 'Hypertension', 'Cardiac', 'Orthopedic', 'Other'];
const MAX_MESSAGE_LENGTH = 500;

const initialFormData = {
  name: '',
  age: '',
  phone: '',
  email: '',
  category: 'General',
  department: services[0]?.title || 'Consultation',
  hospitalLocationId: '',
  date: '',
  time: '',
  message: '',
};

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
  }

  return data;
}

const getLocationStartTime = (location) => (
  location?.appointment_start_time || location?.appointmentStartTime || location?.appointment_from_time || location?.appointmentFromTime || location?.start_time || location?.from_time || location?.fromTime || ''
);

const getLocationEndTime = (location) => (
  location?.appointment_end_time || location?.appointmentEndTime || location?.appointment_to_time || location?.appointmentToTime || location?.end_time || location?.to_time || location?.toTime || ''
);

const buildFallbackSlots = (location) => {
  const start = getLocationStartTime(location);
  const end = getLocationEndTime(location);
  if (!start || !end) return [];

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const startTotal = (startHour * 60) + (startMinute || 0);
  const endTotal = (endHour * 60) + (endMinute || 0);

  if (Number.isNaN(startTotal) || Number.isNaN(endTotal) || endTotal < startTotal) return [];

  const slots = [];
  for (let total = startTotal; total <= endTotal; total += 30) {
    const hour = String(Math.floor(total / 60)).padStart(2, '0');
    const minute = String(total % 60).padStart(2, '0');
    slots.push({ time: `${hour}:${minute}`, booked: false, available: true });
  }

  return slots;
};

function Contact() {
  const { dictionary } = useLanguage();
  const [formData, setFormData] = useState(initialFormData);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function fetchLocations() {
      setLoadingLocations(true);
      try {
        const data = await apiRequest('/hospital-locations');
        if (!cancelled) {
          setHospitalLocations(Array.isArray(data) ? data.filter((location) => location.status !== 'Inactive') : []);
        }
      } catch (error) {
        if (!cancelled) setHospitalLocations([]);
      } finally {
        if (!cancelled) setLoadingLocations(false);
      }
    }

    fetchLocations();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedLocation = useMemo(
    () => hospitalLocations.find((location) => String(location.id) === String(formData.hospitalLocationId)),
    [formData.hospitalLocationId, hospitalLocations]
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchAvailableSlots() {
      if (!formData.hospitalLocationId || !formData.date) {
        setAvailableSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const data = await apiRequest(`/public/locations/${formData.hospitalLocationId}/available-times?date=${encodeURIComponent(formData.date)}`);
        if (!cancelled) {
          setAvailableSlots(Array.isArray(data?.slots) ? data.slots : []);
        }
      } catch (error) {
        if (!cancelled) {
          setAvailableSlots(buildFallbackSlots(selectedLocation));
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    fetchAvailableSlots();
    return () => {
      cancelled = true;
    };
  }, [formData.hospitalLocationId, formData.date, selectedLocation]);

  const validateForm = (data = formData) => {
    const nextErrors = {};
    const trimmedName = data.name.trim();
    const cleanedPhone = data.phone.replace(/\D/g, '');
    const trimmedEmail = data.email.trim();
    const age = Number(data.age);
    const today = new Date().toISOString().split('T')[0];

    if (!trimmedName) {
      nextErrors.name = 'Patient name is required.';
    } else if (trimmedName.length < 2) {
      nextErrors.name = 'Enter at least 2 characters.';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      nextErrors.name = 'Use letters and spaces only.';
    }

    if (!cleanedPhone) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      nextErrors.phone = 'Enter a valid 10 digit Indian mobile number.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!data.age) {
      nextErrors.age = 'Age is required.';
    } else if (!Number.isInteger(age) || age < 1 || age > 120) {
      nextErrors.age = 'Enter age between 1 and 120.';
    }

    if (!patientCategories.includes(data.category)) {
      nextErrors.category = 'Select a valid patient category.';
    }

    if (!data.department) {
      nextErrors.department = 'Select a department.';
    }

    if (!data.hospitalLocationId) {
      nextErrors.hospitalLocationId = 'Select hospital location.';
    }

    if (!data.date) {
      nextErrors.date = 'Appointment date is required.';
    } else if (data.date < today) {
      nextErrors.date = 'Appointment date cannot be in the past.';
    }

    if (!data.time) {
      nextErrors.time = 'Select an available appointment time.';
    }

    if (data.message.trim().length > MAX_MESSAGE_LENGTH) {
      nextErrors.message = `Notes must be ${MAX_MESSAGE_LENGTH} characters or less.`;
    }

    return nextErrors;
  };

  const markFieldTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const getFieldError = (field) => touched[field] ? errors[field] : '';

  const inputClassName = (field) => (
    `mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
      getFieldError(field)
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-pink-200 focus:border-[#e84faf] focus:ring-pink-100'
    }`
  );

  const renderFieldError = (field) => (
    getFieldError(field) ? <p className="mt-1 text-xs font-medium text-red-600">{getFieldError(field)}</p> : null
  );

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validateForm({ ...formData, [field]: value }));
  };

  const handleLocationChange = (value) => {
    setFormData((current) => ({ ...current, hospitalLocationId: value, time: '' }));
    setTouched((current) => ({ ...current, hospitalLocationId: true, time: true }));
    setErrors(validateForm({ ...formData, hospitalLocationId: value, time: '' }));
  };

  const handleDateChange = (value) => {
    setFormData((current) => ({ ...current, date: value, time: '' }));
    setTouched((current) => ({ ...current, date: true, time: true }));
    setErrors(validateForm({ ...formData, date: value, time: '' }));
  };

  const hasSlotLookupInput = Boolean(formData.hospitalLocationId && formData.date);
  const selectableSlots = availableSlots.filter((slot) => slot.available !== false && !slot.booked);
  const cannotSubmit = submitting;

  const localizedServices = services.map((service, index) => ({
    ...service,
    localizedTitle: dictionary.services[index]?.[0] || service.title,
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    setTouched({
      name: true,
      phone: true,
      email: true,
      age: true,
      category: true,
      department: true,
      hospitalLocationId: true,
      date: true,
      time: true,
      message: true,
    });

    if (Object.keys(nextErrors).length > 0) {
      setAlert({
        type: 'error',
        message: 'Please correct the highlighted fields before submitting.',
      });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    try {
      const patientPayload = {
        name: formData.name.trim(),
        age: formData.age,
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        category: formData.category,
        status: 'Active',
        history: formData.message
          ? `Public website appointment request: ${formData.message.trim()}`
          : 'Public website appointment request',
      };

      const appointmentPayload = {
        hospitalLocationId: formData.hospitalLocationId || null,
        doctorId: selectedLocation?.doctor_id || selectedLocation?.doctorId || null,
        date: formData.date,
        time: formData.time,
        type: formData.department === 'Emergency' ? 'Emergency' : 'Consultation',
        department: formData.department,
        status: 'Scheduled',
        notes: [
          'Booked from public website',
          `Requested department: ${formData.department}`,
          formData.message && `Patient note: ${formData.message.trim()}`,
          selectedLocation && `Requested location: ${selectedLocation.hospital_name || selectedLocation.hospitalName || ''} ${selectedLocation.location || ''}`.trim(),
        ].filter(Boolean).join('\n'),
      };

      await apiRequest(PUBLIC_BOOKING_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
          patient: patientPayload,
          appointment: appointmentPayload,
        }),
      });

      setFormData(initialFormData);
      setTouched({});
      setErrors({});
      setAlert({
        type: 'success',
        message: 'Appointment submitted. Your patient record and appointment were created successfully.',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message?.includes('Cannot POST')
          ? 'Public booking API is not available yet. Please add a backend route that creates the patient and appointment without requiring an admin token.'
          : error.message || 'Unable to submit appointment request. Please call the clinic.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#e84faf]">{dictionary.contactPage.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">{dictionary.contactPage.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {dictionary.contactPage.body}
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Phone, label: dictionary.contactPage.phone, value: clinic.phone, href: `tel:${clinic.phone}` },
              { icon: Mail, label: dictionary.contactPage.email, value: clinic.email, href: `mailto:${clinic.email}` },
              { icon: MapPin, label: 'Address', value: clinic.address },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 rounded-lg border border-pink-100 p-4">
                <Icon size={24} className="mt-1 text-[#e84faf]" />
                <div>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  {href ? <a href={href} className="font-semibold text-slate-950">{value}</a> : <p className="font-semibold text-slate-950">{value}</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Share2 size={17} />
              {dictionary.common.social}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.socials.map((social) => (
                <a key={social.label} href={social.href} className="rounded-lg border border-pink-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-[#e84faf]">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-pink-100 bg-[#fff7fc] p-6 shadow-sm">
          {submitting && <LogoLoader overlay label="Submitting appointment..." />}
          <div className="flex items-center gap-3">
            <CalendarCheck size={28} className="text-[#e84faf]" />
            <h2 className="text-2xl font-bold text-slate-950">{dictionary.contactPage.formTitle}</h2>
          </div>

          {loadingLocations && (
            <div className="mt-5 rounded-lg border border-pink-100 bg-white py-4">
              <LogoLoader compact label={dictionary.contactPage.loadingLocations} />
            </div>
          )}

          {alert && (
            <div className={`mt-5 flex gap-3 rounded-lg border p-4 text-sm ${
              alert.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}>
              {alert.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p>{alert.message}</p>
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.fullName}
              <input required value={formData.name} onBlur={() => markFieldTouched('name')} onChange={(event) => handleChange('name', event.target.value)}
                className={inputClassName('name')} placeholder={dictionary.contactPage.placeholders.name} />
              {renderFieldError('name')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.phone}
              <input required type="tel" inputMode="numeric" maxLength="10" value={formData.phone} onBlur={() => markFieldTouched('phone')} onChange={(event) => handleChange('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                className={inputClassName('phone')} placeholder={dictionary.contactPage.placeholders.phone} />
              {renderFieldError('phone')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.email}
              <input required type="email" value={formData.email} onBlur={() => markFieldTouched('email')} onChange={(event) => handleChange('email', event.target.value)}
                className={inputClassName('email')} placeholder={dictionary.contactPage.placeholders.email} />
              {renderFieldError('email')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.age}
              <input required min="1" max="120" type="number" value={formData.age} onBlur={() => markFieldTouched('age')} onChange={(event) => handleChange('age', event.target.value)}
                className={inputClassName('age')} placeholder={dictionary.contactPage.placeholders.age} />
              {renderFieldError('age')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.category}
              <select value={formData.category} onBlur={() => markFieldTouched('category')} onChange={(event) => handleChange('category', event.target.value)}
                className={inputClassName('category')}>
                {patientCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
              {renderFieldError('category')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.department}
              <select value={formData.department} onBlur={() => markFieldTouched('department')} onChange={(event) => handleChange('department', event.target.value)}
                className={inputClassName('department')}>
                {localizedServices.map((service) => (
                  <option key={service.title} value={service.title}>{service.localizedTitle}</option>
                ))}
              </select>
              {renderFieldError('department')}
            </label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
              {dictionary.contactPage.location}
              <select value={formData.hospitalLocationId} onBlur={() => markFieldTouched('hospitalLocationId')} onChange={(event) => handleLocationChange(event.target.value)}
                className={inputClassName('hospitalLocationId')}>
                <option value="">{loadingLocations ? dictionary.contactPage.loadingLocations : dictionary.contactPage.assignLocation}</option>
                {hospitalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.hospital_name || location.hospitalName} - {location.location}
                  </option>
                ))}
              </select>
              {renderFieldError('hospitalLocationId')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.date}
              <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.date}
                onBlur={() => markFieldTouched('date')}
                onChange={(event) => handleDateChange(event.target.value)}
                className={inputClassName('date')} />
              {renderFieldError('date')}
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {dictionary.contactPage.time}
              <select
                required
                value={formData.time}
                disabled={!hasSlotLookupInput || loadingSlots || selectableSlots.length === 0}
                onBlur={() => markFieldTouched('time')}
                onChange={(event) => handleChange('time', event.target.value)}
                className={`${inputClassName('time')} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500`}
              >
                <option value="">
                  {!hasSlotLookupInput
                    ? dictionary.contactPage.selectLocationDate
                    : loadingSlots
                      ? dictionary.contactPage.loadingTimes
                      : selectableSlots.length
                        ? dictionary.contactPage.selectAvailableTime
                        : dictionary.contactPage.noAvailableSlots}
                </option>
                {availableSlots.map((slot) => {
                  const isBooked = slot.available === false || slot.booked;
                  return (
                    <option key={slot.time} value={slot.time} disabled={isBooked}>
                      {slot.time}{isBooked ? ` - ${dictionary.contactPage.booked}` : ''}
                    </option>
                  );
                })}
              </select>
              {renderFieldError('time')}
              {loadingSlots && (
                <div className="mt-2 rounded-lg border border-pink-100 bg-white py-3">
                  <LogoLoader compact label={dictionary.contactPage.loadingTimes} />
                </div>
              )}
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {dictionary.contactPage.message}
            <textarea rows="4" maxLength={MAX_MESSAGE_LENGTH} value={formData.message} onBlur={() => markFieldTouched('message')} onChange={(event) => handleChange('message', event.target.value)}
              className={inputClassName('message')} placeholder={dictionary.contactPage.placeholders.message} />
            <span className={`mt-1 block text-xs ${getFieldError('message') ? 'text-red-600' : 'text-slate-500'}`}>
              {formData.message.length}/{MAX_MESSAGE_LENGTH}
            </span>
            {renderFieldError('message')}
          </label>
          <button type="submit" disabled={cannotSubmit}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#e84faf] px-5 py-3 text-sm font-semibold text-white hover:bg-[#d83d9f] disabled:cursor-not-allowed disabled:opacity-60">
            <CalendarCheck size={18} />
            {submitting ? dictionary.common.submitting : dictionary.common.submitAppointment}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            {dictionary.contactPage.portalNote}
          </p>
        </form>
      </div>
    </section>
  );
}

export default Contact;

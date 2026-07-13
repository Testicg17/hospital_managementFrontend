import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarCheck, CheckCircle2, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { clinic, services } from './siteData';

const API_URL = process.env.REACT_APP_API_URL || 'https://hospital-managementbackend.onrender.com/api';
const PUBLIC_BOOKING_ENDPOINT = process.env.REACT_APP_PUBLIC_BOOKING_ENDPOINT || '/public/appointments';
const patientCategories = ['General', 'Diabetes', 'Hypertension', 'Cardiac', 'Orthopedic', 'Other'];

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

function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

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

  const handleChange = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        type: formData.department,
        status: 'Scheduled',
        notes: [
          'Booked from public website',
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
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Contact</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">Book an appointment or speak with our front desk</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Send your details and preferred department. The clinic team can confirm available time slots and guide you through the next step.
          </p>

          <div className="mt-8 space-y-4">
            {[
              { icon: Phone, label: 'Phone', value: clinic.phone, href: `tel:${clinic.phone}` },
              { icon: Mail, label: 'Email', value: clinic.email, href: `mailto:${clinic.email}` },
              { icon: MapPin, label: 'Address', value: clinic.address },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                <Icon size={24} className="mt-1 text-teal-700" />
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
              Social media
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {clinic.socials.map((social) => (
                <a key={social.label} href={social.href} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-500">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarCheck size={28} className="text-teal-700" />
            <h2 className="text-2xl font-bold text-slate-950">Appointment request</h2>
          </div>

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
              Full name
              <input required value={formData.name} onChange={(event) => handleChange('name', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" placeholder="Patient name" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Phone
              <input required type="tel" value={formData.phone} onChange={(event) => handleChange('phone', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" placeholder="+91..." />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input required type="email" value={formData.email} onChange={(event) => handleChange('email', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" placeholder="name@email.com" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Age
              <input required min="0" type="number" value={formData.age} onChange={(event) => handleChange('age', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" placeholder="Age" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Patient category
              <select value={formData.category} onChange={(event) => handleChange('category', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100">
                {patientCategories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Department
              <select value={formData.department} onChange={(event) => handleChange('department', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100">
                {services.map((service) => <option key={service.title}>{service.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
              Visit location
              <select value={formData.hospitalLocationId} onChange={(event) => handleChange('hospitalLocationId', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100">
                <option value="">{loadingLocations ? 'Loading locations...' : 'Front desk can assign location'}</option>
                {hospitalLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.hospital_name || location.hospitalName} - {location.location}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Preferred date
              <input required type="date" min={new Date().toISOString().split('T')[0]} value={formData.date}
                onChange={(event) => handleChange('date', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Preferred time
              <input required type="time" value={formData.time} onChange={(event) => handleChange('time', event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" />
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Message
            <textarea rows="4" value={formData.message} onChange={(event) => handleChange('message', event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" placeholder="Symptoms, notes, or preferred doctor" />
          </label>
          <button type="submit" disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60">
            <CalendarCheck size={18} />
            {submitting ? 'Submitting...' : 'Submit Appointment Request'}
          </button>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Use the same email in the patient portal to receive OTP access to your records and appointments.
          </p>
        </form>
      </div>
    </section>
  );
}

export default Contact;

# Eva Fertility & Laparoscopy User Manual

## 1. Website URLs

- Public website: https://evafertilitypune.com/
- Admin / Reception portal: https://evafertilitypune.com/admin
- Doctor portal: https://evafertilitypune.com/doctor
- Patient portal: https://evafertilitypune.com/patient
- Backend API base: https://evafertilitypune.com/api

## 2. Public Website

Use the public website to view clinic information, services, articles, gallery, doctor profile, contact details, and appointment booking.

Main pages:

- Home: clinic introduction, doctor highlights, services, patient stories, and booking CTA.
- About: doctor profile, achievements, conferences, and clinical focus.
- Services: fertility, gynecology, pregnancy, laparoscopy, hysteroscopy, PCOS/PCOD, and related care.
- Articles / Blog: patient-friendly education and research-based articles.
- Gallery: clinic visuals and walkthrough.
- Contact: appointment request form, address, phone, email, and social links.
- Doctor profile: digital profile for Dr. Raveendra Gondhali.

### Book Appointment From Website

1. Click `Book Appointment` from any public page.
2. The page opens directly at the appointment form.
3. Fill patient name, phone, email, age, category, department, location, date, time, and notes.
4. Select a date from today up to one month ahead.
5. Same-day time must be at least two hours from current time.
6. Click `Submit Appointment Request`.
7. The system creates the patient record and appointment request in the backend.

### WhatsApp Contact

Click the WhatsApp button to open WhatsApp with a prefilled greeting message. The user can add their name and send the message to the clinic.

## 3. Admin / Reception Portal

Open: https://evafertilitypune.com/admin

The admin/reception portal is used to manage users, patients, appointments, locations, billing, and dashboard data.

### Login

1. Open `/admin`.
2. Enter registered email and password.
3. Click `Sign In`.
4. A logo loader appears while signing in.

### Dashboard

Dashboard shows:

- Total patients
- Today's appointments
- Pending bills
- Total revenue
- Today's appointment list

### User Management

Use `Users` to:

- Add users
- View user list
- Manage roles such as admin/receptionist
- Check active users

### Patient Management

Use `Patients` to:

- Add a new patient
- Edit patient details
- View patient category and history
- Delete patient when required

### Appointment Management

Use `Appointments` to:

- Create appointment
- Select patient
- Select hospital/location
- Select date and available time
- Reschedule appointment
- Cancel appointment
- Send appointment alert

After submitting create/reschedule appointment, a logo loader is shown while the request is processing.

### Hospital Locations

Use `Locations` to:

- Add hospital/location
- Add address
- Assign doctor
- Set appointment start and end time
- Mark location active/inactive

Appointment forms use active locations and their available time windows.

### Billing

Use `Billing` to:

- Create bill
- Select patient
- Add services
- Add amount
- Set bill status
- View invoice
- Print invoice

After submitting create bill, a logo loader is shown while the request is processing.

## 4. Doctor Portal

Open: https://evafertilitypune.com/doctor

The doctor portal is used to view appointments, patients, reschedule requests, and complete consultation visits.

### Login

1. Open `/doctor`.
2. Enter doctor email and password.
3. Click `Sign In`.
4. A logo loader appears while signing in.

### Appointments

Doctor can view:

- Today's appointments
- Upcoming appointments
- Pending reschedule requests
- Completed appointments

Doctor can:

- Create appointment
- Request reschedule from patient
- Approve/reject patient reschedule request
- Start/complete consultation
- Print consultation letter

### Complete Visit

During consultation, doctor can add:

- Diagnosis
- Prescription / medications
- Medication name
- Dosing schedule
- Treatment duration
- Tests / lab work ordered
- Advice / notes
- Next checkup date

After completing visit:

- Appointment is marked completed.
- Patient medical history is updated.
- Consultation letter can be printed.
- Patient can view the record in patient portal.

### Consultation Letter

The letterhead includes:

- Eva Fertility & Laparoscopy (स्त्री क्लिनिक)
- Address
- Phone and email
- Consultation Letter and generated date/time
- Patient details
- Diagnosis
- Prescription table
- Tests
- Advice
- Next checkup
- Doctor signature area

## 5. Patient Portal

Open: https://evafertilitypune.com/patient

The patient portal is used by patients to view profile, appointments, consultation history, bills, and reschedule requests.

### Login With OTP

1. Open `/patient`.
2. Enter registered email.
3. Click `Send OTP to Email`.
4. Enter the OTP received by email.
5. Click `Verify & Login`.

A logo loader appears while OTP is being sent or verified.

### Profile & History

Patient can view:

- Name, phone, email, age, category
- Medical history
- Visit summaries
- Next checkup date

### Appointments

Patient can:

- View upcoming and past appointments
- Request appointment
- Request reschedule
- Accept doctor suggested reschedule
- View/print consultation letter for completed visits

### Bills & Payments

Patient can:

- View bill list
- View invoice
- Print/download invoice where available

Invoice letterhead uses the clinic branding, address, phone, and email.

## 6. Date And Time Rules

Appointment date/time validation is used in:

- Public website booking
- Admin appointment create/reschedule
- Doctor appointment create/reschedule
- Patient appointment request/reschedule

Rules:

- Minimum date is current date.
- Same-day time must be at least two hours after current time.
- Maximum date is one month from current date.
- Time options depend on active hospital/location appointment window.
- Booked slots are disabled where slot information is available.

## 7. Email And Notifications

The system supports email notifications for actions such as:

- Patient OTP
- Public appointment confirmation
- Appointment alerts
- Reschedule notifications
- Consultation completion where configured

If email delivery fails in backend, OTP/log details should be checked in backend logs according to backend configuration.

## 8. Environment Configuration

Frontend public-safe variables are defined in `.env.example`:

```env
REACT_APP_SITE_URL=https://evafertilitypune.com
REACT_APP_PUBLIC_WEBSITE_URL=https://evafertilitypune.com/
REACT_APP_ADMIN_PORTAL_URL=https://evafertilitypune.com/admin
REACT_APP_DOCTOR_PORTAL_URL=https://evafertilitypune.com/doctor
REACT_APP_PATIENT_PORTAL_URL=https://evafertilitypune.com/patient
REACT_APP_API_URL=https://evafertilitypune.com/api
REACT_APP_PUBLIC_BOOKING_ENDPOINT=/public/appointments
REACT_APP_PUBLIC_PATIENT_CATEGORIES_ENDPOINT=/public/categories
REACT_APP_PUBLIC_DEPARTMENTS_ENDPOINT=/public/departments
REACT_APP_GA_MEASUREMENT_ID=
REACT_APP_CLARITY_PROJECT_ID=
REACT_APP_GOOGLE_SITE_VERIFICATION=
```

Do not put backend secrets, database passwords, JWT secrets, or email passwords in frontend environment files.

## 9. Production Hosting Notes

Frontend routing must send these paths to React `index.html`:

- `/`
- `/about`
- `/services`
- `/articles`
- `/blog`
- `/gallery`
- `/contact`
- `/admin`
- `/doctor`
- `/patient`
- `/DrRaveendraGondhali`

Backend API must be available under:

- `/api`

Do not route `/api/*` to React. It must proxy to backend.

## 10. Security Notes

- Admin, doctor, and patient portals are private and marked `noindex`.
- Public pages are indexable for SEO.
- Frontend `.env` is ignored by Git.
- Use `.env.example` for public-safe sample variables.
- Backend secrets must be stored only in backend hosting environment variables.
- Do not share passwords or OTPs publicly.

## 11. Common Troubleshooting

### Access token required

This means a private API was called without login token. Public website should use public endpoints such as `/api/public/...`.

### Category not loading

Check:

- `REACT_APP_API_URL`
- `REACT_APP_PUBLIC_PATIENT_CATEGORIES_ENDPOINT`
- Backend `/api/public/categories`

### Appointment time not showing

Check:

- Location is active.
- Appointment start/end time is configured.
- Selected date is valid.
- Slot is not already booked.

### Login not working

Check:

- Correct portal URL.
- Correct email/password or OTP.
- Backend `/api` is reachable.
- Browser console/network response.

### Build permission error on Windows

If `npm run build` fails with permission denied on `build/apple-touch-icon.png`, close programs using the build folder or rerun with proper permissions.

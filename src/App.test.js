import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => element,
}), { virtual: true });

jest.mock('./components/Analytics', () => function Analytics() {
  return null;
});

jest.mock('./portals/AdminPortal', () => function AdminPortal() {
  return <div>Admin Portal</div>;
});

jest.mock('./portals/PatientPortal', () => function PatientPortal() {
  return <div>Patient Portal</div>;
});

jest.mock('./portals/DoctorPortal', () => function DoctorPortal() {
  return <div>Doctor Portal</div>;
});

jest.mock('./portals/public_Website', () => function PublicWebsite() {
  return <div>Public Website</div>;
});

jest.mock('./portals/public_Website/DrRaveendraGondhali', () => function DrRaveendraGondhali() {
  return <div>Doctor Profile</div>;
});

test('renders application route shell', () => {
  render(<App />);
  expect(screen.getByText(/public website/i)).toBeInTheDocument();
  expect(screen.getByText(/admin portal/i)).toBeInTheDocument();
  expect(screen.getByText(/doctor portal/i)).toBeInTheDocument();
  expect(screen.getByText(/patient portal/i)).toBeInTheDocument();
});

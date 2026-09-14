import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import JobDetailsPage from "./pages/JobDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/jobs" element={<Dashboard />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

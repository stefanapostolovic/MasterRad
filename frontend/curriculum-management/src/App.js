import Home from "./pages/home/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Course from "./pages/course/Course"
import Module from "./pages/module/Module"
import Layout from "./components/layout/Layout";
import Test from "./pages/test/Test"
import TestResult from "./pages/test_result/TestResult";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/module/:id" element={<Module />} />
          <Route path="/:id/test" element={<Test />} />
          <Route path="/:id/test/test-result" element={<TestResult />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

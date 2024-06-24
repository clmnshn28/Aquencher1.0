import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signin from '../src/pages/auth/SignIn';
import SignUp from '../src/pages/auth/SignUp';

import DashboardAdmin from './layouts/main_layouts/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Signin />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path='/Dashboard' element={<DashboardAdmin />}/>
      </Routes>
    </Router>
  );
}

export default App;

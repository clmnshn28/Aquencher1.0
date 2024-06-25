import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signin from '../src/pages/auth/SignIn';
import SignUp from '../src/pages/auth/SignUp';

import DashboardAdmin from './layouts/component_layouts/DashboardAdmin';
import NotificationAdmin from './layouts/component_layouts/NotificationAdmin';
import UsersAdmin from './layouts/component_layouts/UsersAdmin';
import DeliveryTaskAdmin from './layouts/component_layouts/DeliveryTaskAdmin';
// import DeliveryRequestAdmin from './layouts/component_layouts/DeliveryRequestAdmin';
import TransactionAdmin from './layouts/component_layouts/TransactionAdmin';
import InventoryAdmin from './layouts/component_layouts/InventoryAdmin';
import AnnouncementAdmin from './layouts/component_layouts/AnnouncementAdmin';
import CreateAnnouncementAdmin from './layouts/component_layouts/CreateAnnouncementAdmin';
import ConcernsAdmin from './layouts/component_layouts/ConcernsAdmin';
import AccountSettingsAdmin from './layouts/component_layouts/AccountSettingsAdmin';
import ChangePasswordAdmin from './layouts/component_layouts/ChangePasswordAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Signin />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path='/Dashboard' element={<DashboardAdmin />}/>
        <Route path='/Notifications' element={<NotificationAdmin />}/>
        <Route path='/Users' element={<UsersAdmin />}/>
        <Route path='/Delivery/Task' element={<DeliveryTaskAdmin/>}/>
        
        <Route path='/Transactions' element={<TransactionAdmin/>}/>
        <Route path='/Inventory' element={<InventoryAdmin/>}/>
        <Route path='/Announcements' element={<AnnouncementAdmin/>}/>
        <Route path='/Announcements/CreateAnnouncement' element={<CreateAnnouncementAdmin/>}/>
        <Route path='/Concerns' element={<ConcernsAdmin/>}/>
        <Route path='/Account/Settings/MyProfile' element={<AccountSettingsAdmin/>}/>
        <Route path='/Account/Settings/ChangePassword' element={<ChangePasswordAdmin/>}/>
      </Routes>
    </Router>
  );
}

export default App;

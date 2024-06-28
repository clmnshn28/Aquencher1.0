import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {SignIn, SignUp} from 'pages/auth';

import {DashboardAdmin} from 'pages/admin/dashboard';
import {NotificationAdmin} from 'pages/admin/notification';
import {UsersAdmin} from 'pages/admin/users';
import {DeliveryTaskAdmin} from 'pages/admin/delivery';
// import DeliveryRequestAdmin from 'pages/admin/delivery/DeliveryRequestAdmin';
import {TransactionAdmin} from 'pages/admin/transaction';
import {InventoryAdmin} from 'pages/admin/inventory';
import {AnnouncementAdmin, CreateAnnouncementAdmin} from 'pages/admin/announcement';
import {ConcernsAdmin} from 'pages/admin/concern';
import {AccountSettingsAdmin , ChangePasswordAdmin } from 'pages/admin/account';

const MainRoutes = () =>{
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
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
};

export default MainRoutes;
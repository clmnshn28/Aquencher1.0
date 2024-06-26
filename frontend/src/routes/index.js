import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Signin from 'pages/auth/SignIn';
import SignUp from 'pages/auth/SignUp';

import DashboardAdmin from 'pages/admin/dashboard/DashboardAdmin';
import NotificationAdmin from 'pages/admin/notification/NotificationAdmin';
import UsersAdmin from 'pages/admin/users/UsersAdmin';
import DeliveryTaskAdmin from 'pages/admin/delivery/DeliveryTaskAdmin';
// import DeliveryRequestAdmin from 'pages/admin/delivery/DeliveryRequestAdmin';
import TransactionAdmin from 'pages/admin/transaction/TransactionAdmin';
import InventoryAdmin from 'pages/admin/inventory/InventoryAdmin';
import AnnouncementAdmin from 'pages/admin/announcement/AnnouncementAdmin';
import CreateAnnouncementAdmin from 'pages/admin/announcement/CreateAnnouncementAdmin';
import ConcernsAdmin from 'pages/admin/concern/ConcernsAdmin';
import {AccountSettingsAdmin , ChangePasswordAdmin } from 'pages/admin/account';

const MainRoutes = () =>{
  return(
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
};

export default MainRoutes;
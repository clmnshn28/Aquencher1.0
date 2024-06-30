import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {SignIn, SignUp} from 'pages/auth';

import {DashboardAdmin} from 'pages/admin/dashboard';
import {NotificationAdmin} from 'pages/admin/notification';
import {UsersAdmin, UsersEditAdmin} from 'pages/admin/users';
import {DeliveryTaskAdmin} from 'pages/admin/delivery';
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
        <Route path='/Admin/Dashboard' element={<DashboardAdmin />}/>
        <Route path='/Admin/Notifications' element={<NotificationAdmin />}/>
        <Route path='/Admin/Users' element={<UsersAdmin />}/>
        <Route path='/Admin/Users/Customer/Edit' element={<UsersEditAdmin />}/>
        <Route path='/Admin/Delivery/Task' element={<DeliveryTaskAdmin/>}/>
        
        <Route path='/Admin/Transactions' element={<TransactionAdmin/>}/>
        <Route path='/Admin/Inventory' element={<InventoryAdmin/>}/>
        <Route path='/Admin/Announcements' element={<AnnouncementAdmin/>}/>
        <Route path='/Admin/Announcements/CreateAnnouncement' element={<CreateAnnouncementAdmin/>}/>
        <Route path='/Admin/Concerns' element={<ConcernsAdmin/>}/>
        <Route path='/Admin/Account/Settings/MyProfile' element={<AccountSettingsAdmin/>}/>
        <Route path='/Admin/Account/Settings/ChangePassword' element={<ChangePasswordAdmin/>}/>
      </Routes>
  </Router>
  );
};

export default MainRoutes;

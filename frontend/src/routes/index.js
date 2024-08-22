import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {SignIn, SignUp} from 'pages/auth';

import {AdminLayout, CustomerLayout} from 'layouts/main_layouts';

import {DashboardAdmin} from 'pages/admin/dashboard';
import {NotificationAdmin} from 'pages/admin/notification';
import {UsersAdmin, UsersEditAdmin, UsersViewAdmin} from 'pages/admin/users';
import {DeliveryTaskAdmin} from 'pages/admin/delivery';
import {TransactionAdmin} from 'pages/admin/transaction';
import {InventoryAdmin} from 'pages/admin/inventory';
import {AnnouncementAdmin, CreateAnnouncementAdmin} from 'pages/admin/announcement';
import {ConcernsAdmin} from 'pages/admin/concern';
import {AccountSettingsAdmin , ChangePasswordAdmin } from 'pages/admin/account';

import { Notification } from 'pages/customer/notification';

const MainRoutes = () =>{
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        
        <Route path='/Admin/' element={<AdminLayout />}>
          <Route path='Dashboard' element={<DashboardAdmin />}/>
          <Route path='Notifications' element={<NotificationAdmin />}/>
          <Route path="Users">
            <Route index element={<UsersAdmin />} />
            <Route path="Customer/Edit" element={<UsersEditAdmin />} />
            <Route path="Customer/ViewDetails" element={<UsersViewAdmin/>}/>
          </Route>
          <Route path="Delivery/">
            <Route path='Task' element={<DeliveryTaskAdmin/>}/>
          </Route>
          <Route path='Transactions' element={<TransactionAdmin/>}/>
          <Route path='Inventory' element={<InventoryAdmin/>}/>
          <Route path="Announcements">
            <Route index element={<AnnouncementAdmin />} />
            <Route path="CreateAnnouncement" element={<CreateAnnouncementAdmin />} />
          </Route>
          <Route path='Concerns' element={<ConcernsAdmin/>}/>
          <Route path="Account/Settings/">
            <Route path="MyProfile" element={<AccountSettingsAdmin />} />
            <Route path="ChangePassword" element={<ChangePasswordAdmin />} />
          </Route>
        </Route>

        <Route path='/Customer/' element={<CustomerLayout/>}>
          <Route path='Notifications' element={<Notification/>}/>

        </Route>

      </Routes>
  </Router>
  );
};

export default MainRoutes;

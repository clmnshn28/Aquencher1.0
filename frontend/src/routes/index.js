import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

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
import { Request } from 'pages/customer/request';

const MainRoutes = () =>{
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path='/Admin/' element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route path='Dashboard' element={<DashboardAdmin />}/>
          <Route path='Notifications' element={<NotificationAdmin />}/>
          <Route path="Users">
            <Route index element={<UsersAdmin />} />
            <Route path="customer/edit" element={<UsersEditAdmin />} />
            <Route path="customer/view-details" element={<UsersViewAdmin/>}/>
          </Route>
          <Route path="delivery">
            <Route path='task' element={<DeliveryTaskAdmin/>}/>
          </Route>
          <Route path='transactions' element={<TransactionAdmin/>}/>
          <Route path='inventory' element={<InventoryAdmin/>}/>
          <Route path="announcements">
            <Route index element={<AnnouncementAdmin />} />
            <Route path="create-announcement" element={<CreateAnnouncementAdmin />} />
          </Route>
          <Route path='concerns' element={<ConcernsAdmin/>}/>
          <Route path="account/settings">
            <Route path="my-profile" element={<AccountSettingsAdmin />} />
            <Route path="change-password" element={<ChangePasswordAdmin />} />
          </Route>
        </Route>

        <Route path='/Customer/' role="customer" element={
          <PrivateRoute role="customer">
            <CustomerLayout/>
          </PrivateRoute>
        }>
          <Route path='Notifications' element={<Notification/>}/>
          <Route path='Requests' element={<Request/>}/>
        </Route>

      </Routes>
  </Router>
  );
};

export default MainRoutes;

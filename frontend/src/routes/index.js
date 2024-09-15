import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {CustomerSignIn, AdminSignIn, SignUp} from 'pages/auth';

import {AdminLayout, CustomerLayout} from 'layouts/main_layouts';

import {DashboardAdmin} from 'pages/admin/dashboard';
import {NotificationAdmin} from 'pages/admin/notification';
import {UsersAdmin, DeactivatedAccountsAdmin, UsersEditAdmin, UsersViewAdmin} from 'pages/admin/users';
import {RequestsAdmin, QueueAdmin, CompletedAdmin, RejectedAdmin} from 'pages/admin/request';
import {TransactionAdmin} from 'pages/admin/transaction';
import {InventoryAdmin} from 'pages/admin/inventory';
import {AnnouncementAdmin} from 'pages/admin/announcement';
import {ConcernsAdmin} from 'pages/admin/concern';
import {AccountSettingsAdmin , ChangePasswordAdmin } from 'pages/admin/account';

import { Notification } from 'pages/customer/notification';
import { Request } from 'pages/customer/request';

const MainRoutes = () =>{
  return(
    <Router>
      <Routes>
        <Route exact path="/" element={<CustomerSignIn />} />
        <Route path="/admin/sign-in" element={<AdminSignIn />} />      
        <Route path="/sign-up" element={<SignUp />} />
        
        <Route path='/admin/' element={
          <PrivateRoute role="admin">
            <AdminLayout />
          </PrivateRoute>
        }>
          <Route path='dashboard' element={<DashboardAdmin />}/>
          <Route path='notifications' element={<NotificationAdmin />}/>
          <Route path="users">
            <Route path="customers" element={<UsersAdmin />} />
            <Route path="deactivated-accounts" element={<DeactivatedAccountsAdmin />} />
            <Route path="customer/edit" element={<UsersEditAdmin />} />
            <Route path="customer/view-details" element={<UsersViewAdmin/>}/>
          </Route>
          <Route path='requests'>
            <Route path='all-requests' element={<RequestsAdmin/>}/>
            <Route path='queue' element={<QueueAdmin/>}/>
            <Route path='completed' element={<CompletedAdmin/>}/>
            <Route path='rejected-requests' element={<RejectedAdmin/>}/>
          </Route>
          <Route path='transactions' element={<TransactionAdmin/>}/>
          <Route path='inventory' element={<InventoryAdmin/>}/>
          <Route path="announcements" element={<AnnouncementAdmin />}/>
          <Route path='concerns' element={<ConcernsAdmin/>}/>
          <Route path="account/settings">
            <Route path="my-profile" element={<AccountSettingsAdmin />} />
            <Route path="change-password" element={<ChangePasswordAdmin />} />
          </Route>
        </Route>

        <Route path='/customer/' element={
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

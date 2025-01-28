import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NotFound from '../views/NotFound.vue';
import MainLayout from '../layouts/MainLayout.vue';
import SignIn from '../views/SignInView.vue';
import Position from '../views/basic/PositionView.vue';
import Nation from '../views/basic/NationView.vue';
import Qualification from '../views/basic/QualificationView.vue';
import Department from '../views/basic/DepartmentView.vue';
import InternalFinance from '../views/finance/InternalFinanceView.vue';
import Hydroelectricity from '../views/hydroelectricity/HydroelectricityView.vue';
import Supervision from '../views/supervision/SupervisionView.vue';
import RoomMap from '../views/roominformation/RoomMapView.vue';
import AddRoom from '../views/roominformation/AddRoomView.vue';
import RoomConfig from '../views/roominformation/RoomConfigView.vue';
import VipLevel from '../views/customermanagement/VipLevelView.vue';
import Customer from '../views/customermanagement/CustomerView.vue';
import CustomerSpend from '../views/customermanagement/CustomerSpendView.vue';
import StaffManagement from '../views/humanresourcemanagement/StaffManagementView.vue';
import GoodsManagement from '../views/materialmanagement/GoodsmanagementView.vue';
import OperationLog from '../views/operationmanagement/OperationLogView.vue';
import AddAdmin from '../views/systemmanagement/AddAdminiView.vue';
import ZeroConfig from '../views/systemmanagement/ZeroConfigView.vue';
import SystemModule from '../views/systemmanagement/SystemModuleView.vue';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView },
      {
        path: '/position',
        name: 'position',
        component: Position
      },
      {
        path: '/nation',
        name: 'nation',
        component: Nation
      },
      {
        path: '/qualification',
        name: 'qualification',
        component: Qualification
      },
      {
        path: '/department',
        name: 'department',
        component: Department
      },
      {
        path: '/internalfinance',
        name: 'internalfinance',
        component: InternalFinance
      },
      {
        path: '/hydroelectricity',
        name: 'hydroelectricity',
        component: Hydroelectricity
      },
      {
        path: '/supervisioninfo',
        name: 'supervisioninfo',
        component: Supervision
      },
      {
        path: '/roommap',
        name: 'roommap',
        component: RoomMap
      },
      {
        path: '/addroom',
        name: 'addroom',
        component: AddRoom
      },
      {
        path: '/roomconfig',
        name: 'roomconfig',
        component: RoomConfig
      },
      {
        path: '/viplevel',
        name: 'viplevel',
        component: VipLevel
      },
      {
        path: '/customer',
        name: 'customer',
        component: Customer
      },
      {
        path: '/customerspend',
        name: 'customerspend',
        component: CustomerSpend
      },
      {
        path: '/staffmanagement',
        name: 'staffmanagement',
        component: StaffManagement
      },
      {
        path: '/goodsManagement',
        name: 'goodsManagement',
        component: GoodsManagement
      },
      {
        path: '/operationLog',
        name: 'operationLog',
        component: OperationLog
      },
      {
        path: '/addadmin',
        name: 'addadmin',
        component: AddAdmin
      },
      {
        path: '/zeroconfig',
        name: 'zeroconfig',
        component: ZeroConfig
      },
      {
        path: '/systemmodule',
        name: 'systemmodule',
        component: SystemModule
      }
    ]
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

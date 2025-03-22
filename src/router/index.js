import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import NotFound from '../views/responsepage/NotFound.vue';
import MainLayout from '../layouts/MainLayout.vue';
import SignIn from '../views/SignInView.vue';
import Position from '../views/base/PositionView.vue';
import Nation from '../views/base/NationView.vue';
import Qualification from '../views/base/QualificationView.vue';
import Department from '../views/base/DepartmentView.vue';
import InternalFinance from '../views/finance/InternalFinanceView.vue';
import Hydroelectricity from '../views/hydroelectricity/HydroelectricityInfoView.vue';
import Supervision from '../views/supervision/SupervisionView.vue';
import RoomMap from '../views/roominformation/RoomMapView.vue';
import RoomManagement from '../views/roominformation/RoomManagementView.vue';
import RoomConfig from '../views/roominformation/RoomConfigView.vue';
import VipLevel from '../views/customermanagement/VipLevelView.vue';
import Customer from '../views/customermanagement/CustomerView.vue';
import CustomerSpend from '../views/customermanagement/CustomerSpendView.vue';
import CustomerType from '../views/customermanagement/CustomerTypeView.vue';
import StaffManagement from '../views/humanresourcemanagement/StaffManagementView.vue';
import EmployeeDetail from '../views/humanresourcemanagement/EmployeeDetailView.vue';
import GoodsManagement from '../views/materialmanagement/GoodsmanagementView.vue';
import OperationLog from '../views/operationmanagement/OperationLogView.vue';
import AddAdmin from '../views/systemmanagement/AddAdminiView.vue';
import ZeroConfig from '../views/systemmanagement/ZeroConfigView.vue';
import SystemModule from '../views/systemmanagement/SystemModuleView.vue';
import { checkTokenValidity } from '../utils/auth';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomeView, meta: { requiresAuth: true } },
      {
        path: '/position',
        name: 'position',
        component: Position,
        meta: { requiresAuth: true }
      },
      {
        path: '/nation',
        name: 'nation',
        component: Nation,
        meta: { requiresAuth: true }
      },
      {
        path: '/qualification',
        name: 'qualification',
        component: Qualification,
        meta: { requiresAuth: true }
      },
      {
        path: '/department',
        name: 'department',
        component: Department,
        meta: { requiresAuth: true }
      },
      {
        path: '/internalfinance',
        name: 'internalfinance',
        component: InternalFinance,
        meta: { requiresAuth: true }
      },
      {
        path: '/hydroelectricinformation',
        name: 'hydroelectricinformation',
        component: Hydroelectricity,
        meta: { requiresAuth: true }
      },
      {
        path: '/supervisioninfo',
        name: 'supervisioninfo',
        component: Supervision,
        meta: { requiresAuth: true }
      },
      {
        path: '/roommap',
        name: 'roommap',
        component: RoomMap,
        meta: { requiresAuth: true }
      },
      {
        path: '/roommanagement',
        name: 'roommanagement',
        component: RoomManagement,
        meta: { requiresAuth: true }
      },
      {
        path: '/roomconfig',
        name: 'roomconfig',
        component: RoomConfig,
        meta: { requiresAuth: true }
      },
      {
        path: '/viplevel',
        name: 'viplevel',
        component: VipLevel,
        meta: { requiresAuth: true }
      },
      {
        path: '/customer',
        name: 'customer',
        component: Customer,
        meta: { requiresAuth: true }
      },
      {
        path: '/customerspend',
        name: 'customerspend',
        component: CustomerSpend,
        meta: { requiresAuth: true }
      },
      {
        path: '/customertype',
        name: 'customertype',
        component: CustomerType,
        meta: { requiresAuth: true }
      },
      {
        path: '/staffmanagement',
        name: 'staffmanagement',
        component: StaffManagement,
        meta: { requiresAuth: true }
      },
      {
        path: '/employeedetail/:employeeId',
        name: 'employeedetail',
        component: EmployeeDetail,
        meta: { requiresAuth: true }
      },
      {
        path: '/goodsManagement',
        name: 'goodsManagement',
        component: GoodsManagement,
        meta: { requiresAuth: true }
      },
      {
        path: '/operationLog',
        name: 'operationLog',
        component: OperationLog,
        meta: { requiresAuth: true }
      },
      {
        path: '/addadmin',
        name: 'addadmin',
        component: AddAdmin,
        meta: { requiresAuth: true }
      },
      {
        path: '/zeroconfig',
        name: 'zeroconfig',
        component: ZeroConfig,
        meta: { requiresAuth: true }
      },
      {
        path: '/systemmodule',
        name: 'systemmodule',
        component: SystemModule,
        meta: { requiresAuth: true }
      },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!checkTokenValidity()) {
          return
      }
      next();
  } else {
      next();
  }
});

export default router;

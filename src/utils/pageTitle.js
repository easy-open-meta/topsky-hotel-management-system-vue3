export function getPageTitle(routePath) {
  switch (routePath) {
      case '/':
          return 'message.homePage';
      case '/position':
          return 'message.positionManage';
      case '/nation':
          return 'message.nationManage';
      case '/qualification':
          return 'message.educationManage';
      case '/department':
          return 'message.departmentManage';
      case '/internalfinance':
          return 'message.internalFinanceBill';
      case '/hydroelectricity':
          return 'message.hydroelectricInfo';
      case '/supervisioninfo':
          return 'message.supervisionInfo';
      case '/roommap':
          return 'message.roomMapOverview';
      case '/addroom':
          return 'message.addRoom';
      case '/roomconfig':
          return 'message.roomConfig';
      case '/viplevel':
          return 'message.vipLevelRules';
      case '/customer':
          return 'message.customerInfoManage';
      case '/customerspend':
          return 'message.customerSpendBill';
      case '/staffmanagement':
          return 'message.staffManage';
      case '/goodsmanagement':
          return 'message.goodsManage';
      case '/operationlog':
          return 'message.operationLog';
      case '/addadmin':
          return 'message.addAdmin';
      case '/zeroconfig':
          return 'message.zeroConfig';
       case '/systemmodule':
          return 'message.systemModule';
      default:
          return 'message.defaultTitle';
  }
}
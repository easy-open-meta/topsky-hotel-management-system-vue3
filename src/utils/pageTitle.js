export function getPageTitle(routePath) {
  switch (routePath) {
      case '/':
          return 'message.home';
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
      case '/hydroelectricinformation':
          return 'message.hydroelectricinformation';
      case '/supervisioninfo':
          return 'message.supervisionInfo';
      case '/roommap':
          return 'message.roomMapOverview';
      case '/roommanagement':
          return 'message.roomManagement';
      case '/roomconfig':
          return 'message.roomConfig';
      case '/viplevel':
          return 'message.vipLevelRules';
      case '/customer':
          return 'message.customer';
      case '/customerspend':
          return 'message.customerspend';
      case '/staffmanagement':
          return 'message.staffmanagement';
      case '/goodsmanagement':
          return 'message.goodsmanagement';
      case '/operationlog':
          return 'message.operationlog';
      case '/addadmin':
          return 'message.addadmin';
      case '/zeroconfig':
          return 'message.zeroconfig';
       case '/systemmodule':
          return 'message.systemmodule';
      default:
          return 'message.defaultTitle';
  }
}
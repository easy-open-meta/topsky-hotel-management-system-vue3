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
      case '/passport':
          return 'message.passportManage';
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
      case '/resermanagement':
          return 'message.reserManagement';
      case '/viplevel':
          return 'message.vipLevelRules';
      case '/customer':
          return 'message.customer';
      case '/customerspend':
          return 'message.customerspend';
      case '/customertype':
          return 'message.customertype';
      case '/staffmanagement':
          return 'message.staffmanagement';
      case '/goodsmanagement':
          return 'message.goodsmanagement';
      case '/operationlog':
          return 'message.operationlog';
      case '/administratormanagement':
          return 'message.administratormanagement';
      case '/zeroconfig':
          return 'message.zeroconfig';
       case '/systemmodule':
          return 'message.systemmodule';
      default:
          return 'message.defaultTitle';
  }
}
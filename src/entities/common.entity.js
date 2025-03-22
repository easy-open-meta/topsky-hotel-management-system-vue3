export const BaseFields = {
    IGNOREPAGING:'IgnorePaging',
    IS_DELETED: 'IsDelete',
    DATA_INS_USER: 'DataInsUsr',
    DATA_INS_DATE: 'DataInsDate',
    DATA_CHG_USER: 'DataChgUsr',
    DATA_CHG_DATE: 'DataChgDate'
  };

  export const BaseInitialValues = {
    [BaseFields.IGNOREPAGING]: false,
    [BaseFields.IS_DELETED]: 0,
    [BaseFields.DATA_INS_USER]: '',
    [BaseFields.DATA_INS_DATE]: null,
    [BaseFields.DATA_CHG_USER]: '',
    [BaseFields.DATA_CHG_DATE]: null
  };
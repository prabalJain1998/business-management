export const permissions = {
  admin: {
    ORDER_CREATE: true,
    ORDER_UPDATE: true,
    ORDER_DELETE: true,
    ORDER_VIEW: true,

    ORDER_ACCOUNT_STATEMENT_VIEW: true,
    ORDER_UPDATE_STATUS: true,
    ORDER_UPDATE_PAYMENT: true,
    ORDER_UPDATE_PAYMENT_STATUS: true,
    DASHBOARD_VIEW: true,
    DASHBOARD_ANALYTICS_VIEW: true,
    DASHBOARD_NOTIFICATION_VIEW: true,
    DASHBOARD_REMINDER_VIEW: true,

    EXPORT_ORDERS: true,
    ORDER_SEARCH: true,

    PARTY_CREATE: true,
    PARTY_UPDATE: true,
    PARTY_VIEW: true,
    ALL_PARTY_VIEW: true,
    PARTY_SEARCH: true,

    PARTY_DETAILS: true,
    PARTY_ACCEPT_PAYMENT: true,

    INTERNAL_PARTY_CREATE: true,
    INTERNAL_PARTY_VIEW: true,
    ALL_INTERNAL_PARTY_VIEW: true,
    INTERNAL_PARTY_ACCEPT_PAYMENT: true,
    INTERNAL_PARTY_DETAILS: true,
    INTERNAL_PARTY_UPDATE: true,

    DIGITAL_CREATE_ORDER: true,
    DIGITAL_UPDATE_ORDER: true,
    DIGITAL_PAYMENT_ORDER: true,
    DIGITAL_ALL_ORDER_VIEW: true,

    CREATE_PRODUCT: true,
    ALL_PRODUCTS_VIEW: true,
    EDIT_PRODUCT: true,

    CREATE_EMPLOYEE: true,
    EMPLOYEE_DETAILS_VIEW: true,
    EMPLOYEE_ENTRY: true,

    TRASH_VIEW: true,
    TRASH_DELETE: true,

    UPDATE_PASSWORD: true,

    LOGS_VIEW: true,
    LOGS_PAYMENT_ORDER: true,
  },
  manager: {
    ORDER_CREATE: true,
    ORDER_UPDATE: true,
    ORDER_DELETE: true,
    ORDER_VIEW: true,

    ORDER_ACCOUNT_STATEMENT_VIEW: true,
    ORDER_UPDATE_STATUS: true,
    ORDER_UPDATE_PAYMENT: true,
    ORDER_UPDATE_PAYMENT_STATUS: true,

    DASHBOARD_VIEW: true,
    DASHBOARD_ANALYTICS_VIEW: true,
    DASHBOARD_NOTIFICATION_VIEW: false,
    DASHBOARD_REMINDER_VIEW: true,

    EXPORT_ORDERS: true,
    ORDER_SEARCH: true,

    PARTY_CREATE: true,
    PARTY_UPDATE: true,
    PARTY_VIEW: true,
    ALL_PARTY_VIEW: true,
    PARTY_SEARCH: true,

    PARTY_DETAILS: true,
    PARTY_ACCEPT_PAYMENT: true,

    INTERNAL_PARTY_CREATE: true,
    INTERNAL_PARTY_VIEW: true,
    ALL_INTERNAL_PARTY_VIEW: true,
    INTERNAL_PARTY_ACCEPT_PAYMENT: true,
    INTERNAL_PARTY_DETAILS: true,
    INTERNAL_PARTY_UPDATE: true,

    DIGITAL_CREATE_ORDER: true,
    DIGITAL_UPDATE_ORDER: true,
    DIGITAL_PAYMENT_ORDER: false,
    DIGITAL_ALL_ORDER_VIEW: true,

    CREATE_PRODUCT: true,
    ALL_PRODUCTS_VIEW: true,
    EDIT_PRODUCT: true,

    CREATE_EMPLOYEE: true,
    EMPLOYEE_DETAILS_VIEW: true,
    EMPLOYEE_ENTRY: true,

    TRASH_VIEW: true,
    TRASH_DELETE: true,

    UPDATE_PASSWORD: true,

    LOGS_VIEW: true,
    LOGS_PAYMENT_ORDER: false,
  },
};

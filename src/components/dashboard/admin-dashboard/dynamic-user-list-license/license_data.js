const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Service Name", uid: "serviceName", sortable: true },
  { name: "Days Limit", uid: "dayLimit", sortable: true },
  { name: "Daily Limit", uid: "dailyLimit", sortable: true },
  { name: "Total Limit", uid: "totalLimit", sortable: true },
  { name: "License Key", uid: "licenseKey", sortable: true },
  { name: "Expiry", uid: "expiryDate", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Action", uid: "action", sortable: true },
];

const statusColorMap = {
  suspended: "danger",
  used: "success",
};

const statusOptions = [
  { name: "New", uid: "used" },
  { name: "Suspend", uid: "suspended" },
];

export { columns, statusOptions, statusColorMap };

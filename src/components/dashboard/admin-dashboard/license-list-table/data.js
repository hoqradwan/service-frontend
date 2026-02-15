const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Service Name", uid: "serviceName", sortable: true },
  { name: "Days Limit", uid: "dayLimit", sortable: true },
  { name: "Daily Limit", uid: "dailyLimit", sortable: true },
  { name: "Total Limit", uid: "totalLimit", sortable: true },
  { name: "Device Limit", uid: "deviceLimit", sortable: true },
  { name: "Key String", uid: "licenseKey", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Action", uid: "actions" },
];

const statusColorMap = {
  new: "secondary",
  suspended: "danger",
  expired: "warning",
  used: "success",
};

const statusOptions = [
  { name: "New", uid: "new" },
  { name: "Expired", uid: "expired" },
  { name: "suspended", uid: "suspended" },
  { name: "Used", uid: "used" },
];

export { columns, statusOptions, statusColorMap };

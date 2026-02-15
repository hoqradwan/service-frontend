export const data = [
  {
    id: 1,
    name: "Total User",
    total_download: 2,
    total_limit: 56,
  },
  {
    id: 2,
    name: "Today User",
    total_download: 27,
    total_limit: 85,
  },
  {
    id: 3,
    name: "Total Active User",
    total_download: 26,
    total_limit: 50,
  },
  {
    id: 4,
    name: "Today Envato Download",
    total_download: 62,
    total_limit: 500,
  },
  {
    id: 5,
    name: "Total Freepik Download",
    total_download: 82,
    total_limit: 51,
  },
  {
    id: 6,
    name: "Today Freepik Download",
    total_download: 266,
    total_limit: 875,
  },
  {
    id: 7,
    name: "Today Envato Download",
    total_download: 266,
    total_limit: 875,
  },
  {
    id: 8,
    name: "Total Limit",
    total_download: 266,
    total_limit: 875,
  },
];

export const color = [
  "1976D2",
  "5C4AC7",
  "FFB22B",
  "EF5350",
  "FFB22B",
  "1976D2",
  "24B296",
  "5C4AC7",
];

const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Service Name", uid: "serviceName", sortable: true },
  { name: "Days Limit", uid: "dayLimit", sortable: true },
  { name: "Daily Limit", uid: "dailyLimit", sortable: true },
  { name: "Total Limit", uid: "totalLimit", sortable: true },
  { name: "License Key", uid: "licenseKey", sortable: true },
  { name: "Expiry", uid: "expiryDate", sortable: true },
];

const statusColorMap = {
  new: "success",
  suspend: "danger",
  sold: "warning",
  used: "secondary",
};

const statusOptions = [
  { name: "New", uid: "new" },
  { name: "Suspend", uid: "suspend" },
  { name: "Sold", uid: "sold" },
  { name: "Used", uid: "used" },
];

export { columns, statusOptions, statusColorMap };

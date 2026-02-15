const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Service Name", uid: "serviceName" },
  { name: "Account", uid: "account", sortable: true },
  { name: "Cookie", uid: "cookie" },
  { name: "Date", uid: "joining", sortable: true },
  { name: "Source", uid: "source" },
  { name: "Status", uid: "status", sortable: true },
  { name: "Action", uid: "action" },
];

const statusColorMap = {
  active: "success",
  deactivate: "danger",
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

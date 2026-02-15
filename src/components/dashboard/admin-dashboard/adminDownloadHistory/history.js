const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Service Name", uid: "serviceName", sortable: true },
  { name: "Assets", uid: "assets", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Time", uid: "time", sortable: true },
];

const statusColorMap = {
  pending: "warning",
  accepted: "success",
};

const statusOptions = [
  { name: "New", uid: "new" },
  { name: "pending", uid: "pending" },
];

export { columns, statusOptions, statusColorMap };

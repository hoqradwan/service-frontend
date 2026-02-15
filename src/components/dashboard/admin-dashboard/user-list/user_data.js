const columns = [
  { name: "ID", uid: "serial", sortable: true },
  { name: "Name", uid: "name", sortable: true },
  { name: "Email", uid: "email", sortable: true },
  { name: "Whatsapp", uid: "phone", sortable: true },
  { name: "Joining", uid: "joining", sortable: true },
  { name: "License", uid: "license", sortable: true },
  { name: "Status", uid: "status", sortable: true },
  { name: "Action", uid: "action", sortable: true },
];

const statusColorMap = {
  active: "success",
  deactivate: "danger",
  sold: "warning",
  used: "secondary",
};

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Deactivate", uid: "deactivate" },
  { name: "Sold", uid: "sold" },
  { name: "Used", uid: "used" },
];

export { columns, statusOptions, statusColorMap };

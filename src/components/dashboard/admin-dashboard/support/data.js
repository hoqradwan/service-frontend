import React from "react";
const columns = [
  { name: "ID", uid: "id" },
  { name: "Social Icon", uid: "image" },
  { name: "Go to URL", uid: "url" },
  { name: "Action", uid: "actions" },
];

const users = [
  {
    id: 1,
    url: "https://digitaltoolsbd.com/",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    url: "https://digitaltoolsbd.com/",
    status: "paused",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    url: "https://digitaltoolsbd.com/",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    url: "https://digitaltoolsbd.com/",
    status: "vacation",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    url: "https://digitaltoolsbd.com/",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

export { columns, users };

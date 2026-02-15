import swal from "sweetalert";

export const generatePasswordModal = (password) => {
  swal({
    title: password,
    text: "User temporary password",
    icon: "success",
    buttons: ["Cancel", "Copy"],
    // dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      swal("Your password is copied", {
        icon: "success",
      });
    }
    navigator.clipboard.writeText(password);
  });
};

export default generatePasswordModal;

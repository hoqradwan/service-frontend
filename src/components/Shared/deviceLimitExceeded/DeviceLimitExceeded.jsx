import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const DeviceLimitExceeded = () => {
  const router = useRouter();
  const token = Cookies.get("session");

  const logout = async () => {
    const sure = await Swal.fire({
      title: "Log out from all devices?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F31260",
      cancelButtonColor: "#2C537A",
      confirmButtonText: "Log Out",
    });
    if (sure?.isConfirmed) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/active-device/sign-out-all`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (result?.success) {
        Cookies.remove("session");
        Cookies.remove("role");
        localStorage.removeItem("userInfo");
        toast.success("Logout successful");
        router.push("/login");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="">
      <p className="bg-lime-200 p-4 rounded-md">
        <span className="text-red-600 block">ATTENTION </span>
        You have crossed the device limit for this service. To continue
        downloading, please log out from other devices!
      </p>
      <div className="flex justify-center items-center mt-5">
        <button
          onClick={logout}
          type="button"
          className="bg-red-500 px-6 py-3 rounded-lg font-semibold text-white"
        >
          Log Out From All Devices
        </button>
      </div>
    </div>
  );
};

export default DeviceLimitExceeded;

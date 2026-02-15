"use client";
import { Button, Input } from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const UpdateComponent = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const params = useParams();
  const router = useRouter();
  const token = Cookies.get("session");

  const onSubmit = async (data) => {
    if (Number(data.dailyLimit) > Number(data.totalLimit)) {
      return toast.error(
        "Total limit must be greater than or equal to daily limit"
      );
    }
    const updatedData = {
      dayLimit: Number(data.dayLimit),
      dailyLimit: Number(data.dailyLimit),
      totalLimit: Number(data.totalLimit),
      deviceLimit: Number(data.deviceLimit),
    };
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/license/update/${params.slug}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updatedData),
    });

    if (response.status === 200) {
      toast.success("License is updated");
      router.push("/dashboard/admin/license-list");
      router.refresh();
      reset();
    } else {
      toast.error("Server error occurred");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-[#EDF4F8]">
      <div className="h-[90vh] flex items-center justify-center">
        <div className="shadow-md rounded-sm p-5 py-10 bg-white">
          {/* expire input */}
          <Input
            autoFocus
            type="number"
            label="After how many days will expire."
            labelPlacement="outside"
            variant="bordered"
            {...register("dayLimit", { required: true, min: 1 })}
            className="block min-w-[45vw]"
          />
          {errors.dayLimit && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}

          {/* expire input */}
          <Input
            type="number"
            label="Daily Download Limit"
            labelPlacement="outside"
            variant="bordered"
            {...register("dailyLimit", { required: true, min: 1 })}
            className="block min-w-[45vw]"
          />
          {errors.dailyLimit && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}

          {/* expire input */}
          <Input
            type="number"
            label="Total Download Limit."
            labelPlacement="outside"
            variant="bordered"
            {...register("totalLimit", { required: true, min: 1 })}
            className="block min-w-[45vw]"
          />
          {errors.totalLimit && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}

          {/* Device Limit input */}
          <Input
            type="number"
            label="Device Limit."
            labelPlacement="outside"
            variant="bordered"
            {...register("deviceLimit", { required: true, min: 1 })}
            className="block min-w-[45vw]"
          />
          {errors.deviceLimit && (
            <span className="text-red-500 text-xs">This field is required</span>
          )}
          <Button
            variant="solid"
            color="success"
            type="submit"
            className="mt-5 block text-white w-[17vw] mx-auto"
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateComponent;

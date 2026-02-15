"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import logo from "../../../assets/logo-square.png";
import SignUp from "../../../assets/signup.gif";
import { FaWhatsapp, FaRegCopy } from "react-icons/fa";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "../loader/Loader";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCopy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setWhatsAppNumber(number);
      setIsCopied(true);
      Swal.fire("Copied", number);
    } catch (error) {
      Swal.fire("Error", "Failed to copy number");
    }
  };

  const information = (
    <div className="w-[250px]">
      <p className="bg-primary text-base px-2 rounded-sm block text-white py-2 w-full">
        Why WhatsApp
      </p>
      <div className="max-w-[250px] px-1 space-y-3 py-1">
        <p>
          সম্মানিত ইউজার, হরহামেশাই আইডি/পেইজ/হোয়াটসঅ্যাপ ডিজেবল জনিত ইস্যুস
          হয়ে থাকে, এই ধরণের যেকোনো সমস্যায় যেন আমরা আপনাকে খুব সহজেই খোঁজে পেতে
          পারি সেই লক্ষেই আপনার হোয়াটসঅ্যাপ নাম্বারটি নিয়ে রাখা। পাব্লিকলি
          শেয়ার করার উদ্দেশ্যে নয়। তাই নিশ্চিন্তে আপনার হোয়াটসঅ্যাপ নাম্বারটি
          দিতে পারেন।
        </p>
        <p>
          এছাড়াও নিচের দেয়া টেলিগ্রাম গ্রুপে জয়েন এবং আমাদের অফিসিয়াল
          হোয়াটসঅ্যাপ নাম্বারটিও রেখে দিতে পারেন। এই ক্ষেত্রে পাশে থাকা (? )
          চিহ্নটিতে ক্লিক করলেই নাম্বারটি কপি হয়ে যাবে।
        </p>
        <p>
          ☎ WhatsApp (Admin): 01882-658934 💠Telegram channel:
          https://t.me/digitaltoolsbd
        </p>
      </div>
    </div>
  );

  const handlePhoneInput = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setValue("phone", numericValue);
    trigger("phone");
  };

  const handleBlur = async () => {
    await trigger("phone");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.success) {
        router.push("/login");
        toast.success("SignUp successful!");
      } else {
        toast.error(result.message || "SignUp failed.");
        if (result.errors) {
          result.errors.forEach((error) => {
            setError(error.field, { type: "manual", message: error.message });
          });
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="grid md:grid-cols-10 w-full h-full items-center text-slate-500 gap-8 md:px-[140px]">
          <div className="hidden md:flex col-span-8 md:col-span-6 justify-center items-center">
            <Image
              src={SignUp}
              alt="SignUp"
              priority={true}
              width={500}
              height={500}
            />
          </div>
          <div className="col-span-9 md:col-span-4 flex flex-col justify-center items-center h-full px-4">
            <div className="w-full">
              <Image
                src={logo}
                alt="logo"
                className="mx-auto mb-2"
                width={50}
                height={50}
                priority={true}
              />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="name" className="block mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className={`w-full py-2 px-4 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-[#4DBC60]`}
                    onBlur={() => trigger("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="block mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full py-2 px-4 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-[#4DBC60]`}
                    onBlur={() => trigger("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="whatsapp" className="mb-1 flex items-center">
                    WhatsApp
                    <Tooltip showArrow placement="right" content={information}>
                      <button>
                        <FaWhatsapp className="ml-1 text-xl text-red-500" />
                      </button>
                    </Tooltip>
                    {!isCopied ? (
                      <FaRegCopy
                        onClick={() => handleCopy("01882658934")}
                        className="ml-3 text-xl cursor-pointer"
                      />
                    ) : (
                      <span className="pl-1 text-green-500 font-semibold">
                        Copied
                      </span>
                    )}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    {...register("phone", {
                      pattern: {
                        value: /^[0-9]*$/,
                        message: "Phone number must be numeric",
                      },
                      onChange: handlePhoneInput,
                    })}
                    className={`w-full py-2 px-4 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-[#4DBC60]`}
                    onBlur={handleBlur}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="mb-3 relative">
                  <label htmlFor="password" className="block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full py-2 px-4 border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded focus:outline-[#4DBC60]`}
                      onBlur={() => trigger("password")}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="mb-6 relative">
                  <label htmlFor="confirmPassword" className="block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      className={`w-full py-2 px-4 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded focus:outline-[#4DBC60]`}
                      onBlur={() => trigger("confirmPassword")}
                    />
                    <span
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm pt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#4DBC60] w-full text-white py-3 rounded font-semibold hover:bg-[#36A14D] focus:outline-none focus:bg-[#36A14D]"
                >
                  Sign Up
                </button>
              </form>
              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link href="/login" className="text-[#4DBC60]">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;

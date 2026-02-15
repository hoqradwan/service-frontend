"use client";

import Image from "next/image";
import logo from "../../../assets/logo-square.png";
import login from "../../../assets/login2.gif";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Loader from "../loader/Loader";
import ForgetPassword from "../Forgot-password/ForgetPassword";
// import { useAuth } from "@/Provider/AuthContext";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm();
  // const { setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      clearErrors();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        // Clear cookies and local storage after unsuccessful login
        Cookies.remove("session");
        Cookies.remove("role");
        localStorage.removeItem("userInfo");
        if (result.field) {
          setError(result.field, { type: "manual", message: result.message });
        } else if (result.message) {
          setError("server", { type: "manual", message: result.message });
        }
        setLoading(false);
        return;
      }

      // Set token in cookie
      Cookies.set("session", result?.data?.token, {
        expires: 2 / 24, // 2 hours
        sameSite: "strict",
        secure: true, // Ensure this is set based on your environment
      });
      // setIsAuthenticated(true);
      // Creates userInfo object
      const userInfo = {
        id: result?.data?.user?.id,
        name: result?.data?.user?.name,
        email: result?.data?.user?.email,
      };
      // Sets the userInfo object in local storage
      localStorage.setItem("userInfo", JSON.stringify(userInfo));

      // Reset the form
      reset();

      // Set role and handle redirection
      if (result?.data?.user?.role === "admin") {
        toast.success("Login successful");
        Cookies.set("role", "admin", {
          expires: 2 / 24, // 2 hours
          sameSite: "strict",
          secure: true, // Ensure this is set based on your environment
        });
        router.replace("/dashboard/admin/order-list");
      } else {
        toast.success("Login successful");
        Cookies.set("role", "user", {
          expires: 2 / 24, // 2 hours
          sameSite: "strict",
          secure: true, // Ensure this is set based on your environment
        });
        router.replace("/dashboard/user/download-history");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => {
    clearErrors(field);
    clearErrors("server");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden">
      {loading && <Loader />}
      {!loading && (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="grid md:grid-cols-10 w-full h-full items-center text-slate-500 gap-8 md:px-[140px]">
            <div className="hidden md:flex col-span-8 md:col-span-6 justify-center items-center">
              <Image
                src={login}
                alt="login"
                priority={true}
                width={500}
                height={500}
                unoptimized
              />
            </div>

            <div className="col-span-9 md:col-span-4 flex flex-col justify-center items-center h-full px-4">
              <div className="w-full">
                <div>
                  <Image src={logo} alt="logo" className="mx-auto mb-4" />
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4 space-y-3">
                      <div>
                        <label htmlFor="email" className="block mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          className={`w-full py-2 px-4 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded focus:outline-[#4DBC60]`}
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: "Invalid email address",
                            },
                          })}
                          onChange={() => handleInputChange("email")}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4 relative">
                        <label htmlFor="password" className="block mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                              required: "Password is required",
                            })}
                            className={`w-full py-2 px-4 border ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded focus:outline-[#4DBC60]`}
                            onChange={() => handleInputChange("password")}
                          />
                          <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <AiOutlineEyeInvisible className="text-xl" />
                            ) : (
                              <AiOutlineEye className="text-xl" />
                            )}
                          </span>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.password.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Displaying general server-side error */}
                    {errors.server && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.server.message}
                      </p>
                    )}

                    <div className="py-3 flex gap-4 justify-between items-center w-full">
                      <div className="flex items-center">
                        <input
                          className="custom-checkbox"
                          type="checkbox"
                          name="checkbox"
                          id="checkbox"
                        />
                        <label htmlFor="checkbox" className="ml-2">
                          Remember Me
                        </label>
                      </div>
                      <div className="flex gap-1 items-center hover:text-[#4DBC60] transition-all duration-300 ease-linear">
                        <ForgetPassword />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-5 bg-[#4DBC60] hover:bg-opacity-90 text-white py-2 rounded uppercase transition-all duration-300 ease-linear"
                      disabled={loading}
                    >
                      Log in
                    </button>
                  </form>

                  <div className="pt-6 text-center">
                    <p>
                      Do not have an account?{" "}
                      <Link href="/signup" className="text-[#4DBC60]">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;

// "use client";

// import Image from "next/image";
// import logo from "../../../assets/logo-square.png";
// import login from "../../../assets/login2.gif";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import Cookies from "js-cookie";
// import Loader from "../loader/Loader";
// import ForgetPassword from "../Forgot-password/ForgetPassword";

// const LoginForm = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//     clearErrors,
//     reset,
//   } = useForm();

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       clearErrors();
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         }
//       );
//       const result = await response.json();

//       if (!response.ok) {
//         if (result.field) {
//           setError(result.field, { type: "manual", message: result.message });
//         } else if (result.message) {
//           setError("server", { type: "manual", message: result.message });
//         }
//         setLoading(false);
//         return;
//       }

//       // Set token in cookie
//       Cookies.set("session", result?.data?.token, {
//         expires: 1,
//         sameSite: "strict",

//         //  need before deploying
//         secure: true,
//       });
//       // Cookies.set("sessionId", result?.data?.sessionId, {
//       //   expires: 1,
//       //   sameSite: "strict",

//       //   //  need before deploying
//       //   secure: true,
//       // });

//       // creates userInfo object
//       const userInfo = {
//         id: result?.data?.user?.id,
//         name: result?.data?.user?.name,
//         email: result?.data?.user?.email,
//       };
//       // sets the userInfo object in localstorage
//       localStorage.setItem("userInfo", JSON.stringify(userInfo));
//       // Reset the form
//       reset();

//       // Set role and handle redirection
//       if (result?.data?.user?.role === "admin") {
//         toast.success("Login successful");
//         Cookies.set("role", "admin", {
//           expires: 1,
//           sameSite: "strict",
//           secure: true,
//         });
//         router.replace("/dashboard/admin/order-list");
//       } else {
//         toast.success("Login successful");
//         Cookies.set("role", "user", {
//           expires: 1,
//           sameSite: "strict",
//           secure: true,
//         });
//         router.replace("/dashboard/user/download-history");
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field) => {
//     clearErrors(field);
//     clearErrors("server");
//   };

//   return (
//     <div className="w-full h-screen flex items-center justify-center overflow-hidden">
//       {loading && <Loader />}
//       {!loading && (
//         <div className="w-full h-screen flex items-center justify-center">
//           <div className="grid md:grid-cols-10 w-full h-full items-center text-slate-500 gap-8 md:px-[140px]">
//             <div className="hidden md:flex col-span-8 md:col-span-6 justify-center items-center">
//               <Image
//                 src={login}
//                 alt="login"
//                 priority={true}
//                 width={500}
//                 height={500}
//                 unoptimized
//               />
//             </div>

//             <div className="col-span-9 md:col-span-4 flex flex-col justify-center items-center h-full px-4">
//               <div className="w-full">
//                 <div>
//                   <Image src={logo} alt="logo" className="mx-auto mb-4" />
//                   <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="mb-4 space-y-3">
//                       <div>
//                         <label htmlFor="email" className="block mb-1">
//                           Email Address
//                         </label>
//                         <input
//                           id="email"
//                           className={`w-full py-2 px-4 border ${
//                             errors.email ? "border-red-500" : "border-gray-300"
//                           } rounded focus:outline-[#4DBC60]`}
//                           {...register("email", {
//                             required: "Email is required",
//                             pattern: {
//                               value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                               message: "Invalid email address",
//                             },
//                           })}
//                           onChange={() => handleInputChange("email")}
//                         />
//                         {errors.email && (
//                           <p className="text-red-500 text-sm mt-2">
//                             {errors.email.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="mb-4 relative">
//                         <label htmlFor="password" className="block mb-1">
//                           Password
//                         </label>
//                         <div className="relative">
//                           <input
//                             id="password"
//                             type={showPassword ? "text" : "password"}
//                             {...register("password", {
//                               required: "Password is required",
//                             })}
//                             className={`w-full py-2 px-4 border ${
//                               errors.password
//                                 ? "border-red-500"
//                                 : "border-gray-300"
//                             } rounded focus:outline-[#4DBC60]`}
//                             onChange={() => handleInputChange("password")}
//                           />
//                           <span
//                             className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                             onClick={() => setShowPassword(!showPassword)}
//                           >
//                             {showPassword ? (
//                               <AiOutlineEyeInvisible className="text-xl" />
//                             ) : (
//                               <AiOutlineEye className="text-xl" />
//                             )}
//                           </span>
//                         </div>
//                         {errors.password && (
//                           <p className="text-red-500 text-sm mt-2">
//                             {errors.password.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Displaying general server-side error */}
//                     {errors.server && (
//                       <p className="text-red-500 text-sm mt-2">
//                         {errors.server.message}
//                       </p>
//                     )}

//                     <div className="py-3 flex gap-4 justify-between items-center w-full">
//                       <div className="flex items-center">
//                         <input
//                           className="custom-checkbox"
//                           type="checkbox"
//                           name="checkbox"
//                           id="checkbox"
//                         />
//                         <label htmlFor="checkbox" className="ml-2">
//                           Remember Me
//                         </label>
//                       </div>
//                       <div className="flex gap-1 items-center hover:text-[#4DBC60] transition-all duration-300 ease-linear">
//                         <ForgetPassword />
//                       </div>
//                     </div>

//                     <button
//                       type="submit"
//                       className="w-full mt-5 bg-[#4DBC60] hover:bg-opacity-90 text-white py-2 rounded uppercase transition-all duration-300 ease-linear"
//                       disabled={loading}
//                     >
//                       Log in
//                     </button>
//                   </form>

//                   <div className="pt-6 text-center">
//                     <p>
//                       Do not have an account?{" "}
//                       <Link href="/signup" className="text-[#4DBC60]">
//                         Sign Up
//                       </Link>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoginForm;

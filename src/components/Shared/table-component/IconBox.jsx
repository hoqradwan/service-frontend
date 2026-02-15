import { MdDelete } from "react-icons/md";
import { MdOutlineContentCopy } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineEdit } from "react-icons/ai";
import { IoBan } from "react-icons/io5";
import { IoFlashOffSharp } from "react-icons/io5";
import { IoFlashOutline } from "react-icons/io5";

export const DeleteIcon = () => {
  return <MdDelete className="text-red-400" />;
};

export const CopyIcon = () => {
  return <MdOutlineContentCopy className="text-fuchsia-400" />;
};

export const BurgerMenu = () => {
  return <GiHamburgerMenu className="text-success-400" />;
};

export const EditOutline = () => {
  return <AiOutlineEdit className="text-orange-400" />;
};

export const Suspend = () => {
  return (
    <IoBan className="text-red-500 text-center text-[18px] cursor-pointer" />
  );
};
export const Suspended = () => {
  return (
    <IoFlashOffSharp className="text-red-500 text-center text-[18px] cursor-pointer" />
  );
};
export const Activated = () => {
  return (
    <IoFlashOutline className="text-teal-500 text-center text-[18px] cursor-pointer" />
  );
};

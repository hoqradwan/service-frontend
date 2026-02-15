"use client";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";

export default function TypesModal({ url, options, openTypesModal, setOpenTypesModal, downloadRequest }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {

        const sendData = {
            url: url,
            type: data?.type
        }
        // console.log("data", sendData);
        downloadRequest(sendData);
        reset();
    };
    return (
        <>
            <Modal isOpen={openTypesModal} onOpenChange={() => setOpenTypesModal(!openTypesModal)} placement="top-center">
                <ModalContent className="py-5">
                    {(onClose) => (
                        <>
                            {/* modal header */}
                            <ModalHeader className="flex  text-sm font-bold">
                                Select the format that you want to download
                            </ModalHeader>
                            {/* modal footer */}
                            <ModalFooter className="flex items-cener justify-center">
                                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                                    
                                    <select
                                        {...register("type", {
                                            required: "Please select a format",
                                            validate: (value) => value !== "" || "This field is required",  
                                        })}
                                        defaultValue="" 
                                        className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option value="" disabled>
                                            Please select a format
                                        </option>
                                        {options?.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && (
                                        <span className="text-red-500 text-xs">{errors.type.message}</span>
                                    )}
                                    <div className="w-full flex justify-end mt-3">
                                        <Button
                                            type="submit"
                                            className="bg-blue-500 text-white"
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

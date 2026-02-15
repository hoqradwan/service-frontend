"use client";
import { Fragment, useState, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const services = [
  { name: "Envato", apiEndpoint: "/api/license/envato-stats" },
  { name: "Storyblocks", apiEndpoint: "/api/license/story-blocks-stats" },
  { name: "Motion Array", apiEndpoint: "/api/license/motion-array-stats" },
  { name: "Freepik", apiEndpoint: "/api/license/freepik-stats" },
];

export default function Dropdown({ setSelectedService }) {
  const [selected, setSelected] = useState(services[0]); // Default is Envato

  // Update selected service in parent when component mounts (for default service)
  useEffect(() => {
    setSelectedService(selected);
  }, [selected, setSelectedService]);

  const handleSelection = (service) => {
    setSelected(service);
    setSelectedService(service); // Update the parent state with the selected service
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-10 z-50">
      <Listbox value={selected} onChange={handleSelection}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left text-gray-800 shadow-md hover:bg-green-100 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <span className="block truncate font-semibold">
              {selected.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-800"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {services.map((service, serviceIdx) => (
                <Listbox.Option
                  key={serviceIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-green-100 text-green-900" : "text-gray-900"
                    }`
                  }
                  value={service}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-bold" : "font-normal"
                        }`}
                      >
                        {service.name}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

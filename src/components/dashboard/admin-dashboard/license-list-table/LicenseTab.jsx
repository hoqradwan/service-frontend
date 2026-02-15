import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@headlessui/react";

const services = [
  { name: "Envato" },
  { name: "Storyblocks" },
  { name: "Motion Array" },
  { name: "Freepik" },
];

export default function LicenseTab() {
  return (
    <div className="flex w-full justify-center px-4">
      <div className="w-full max-w-md">
        <TabGroup>
          <TabList className="flex gap-4 border-b border-gray-300">
            {services.map(({ name }) => (
              <Tab
                key={name}
                className={({ selected }) =>
                  `rounded-full py-2 px-4 text-sm font-semibold text-black focus:outline-none ${
                    selected
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-200"
                  }`
                }
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {services.map(({ name }) => (
              <TabPanel key={name} className="p-4">
                {/* No content needed, just the tab name */}
                <div className="text-center text-lg font-semibold">{name}</div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}

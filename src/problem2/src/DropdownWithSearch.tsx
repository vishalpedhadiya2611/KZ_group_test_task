import React, { useState, ReactNode, useEffect, useRef } from "react";
import { arrow } from "./assets";

type DropdownWithSearchProps = {
  trigger: ReactNode;
  searchComponent: React.ReactElement<JSX.IntrinsicElements["input"]>;
  dropdownContent: React.ReactElement<{ children: React.ReactNode }>;
  onSearchChange?: (query: string) => void;
  onClose?: () => void;
  onItemSelect?: (item: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setData: (data: any[]) => void;
  originalData: any[];
};

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  trigger,
  searchComponent,
  dropdownContent,
  onSearchChange,
  onClose,
  onItemSelect,
  searchQuery,
  setSearchQuery,
  setData,
  originalData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    setActiveIndex(-1);
    onSearchChange && onSearchChange(value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      setSearchQuery("");
      onClose && onClose();
    }
    if (originalData.length > 0) {
      setData(originalData);
    }
  };

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSearchQuery("");
    }
  };

  const handleItemClick = (item: any) => {
    setIsOpen(false);
    setSearchQuery("");
    setActiveIndex(-1);
    onItemSelect && onItemSelect(item);
    setData(originalData);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left w-full"
      tabIndex={0}
    >
      <div
        onClick={handleToggleDropdown}
        className="cursor-pointer border rounded w-full flex justify-between items-center p-3"
      >
        {trigger}
        <img
          src={arrow}
          alt="Arrow Icon"
          className={`w-3 ${
            isOpen ? "" : "rotate-180"
          } tar transition-transform duration-300 ease-in-out`}
        />
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 max-h-80 overflow-y-auto w-full">
          <div className="p-2 border-b">
            {React.isValidElement(searchComponent) ? (
              React.cloneElement(searchComponent, {
                value: searchQuery,
                onChange: handleSearchChange,
              })
            ) : (
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 text-sm rounded"
                placeholder="Search..."
              />
            )}
          </div>
          <div className="p-2">
            {React.isValidElement(dropdownContent)
              ? React.cloneElement(dropdownContent, {
                  children: React.Children.map(
                    dropdownContent.props.children,
                    (child, index) => {
                      if (React.isValidElement(child)) {
                        return React.cloneElement(
                          child as React.ReactElement<any>,
                          {
                            className: `px-4 py-2 cursor-pointer hover:bg-gray-200 flex justify-between items-center ${
                              index === activeIndex ? "bg-gray-200" : ""
                            }`,
                            onClick: () =>
                              handleItemClick(
                                child.props.children[0]?.props
                                  ?.children as string
                              ),
                          }
                        );
                      }
                      return child;
                    }
                  ),
                })
              : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownWithSearch;

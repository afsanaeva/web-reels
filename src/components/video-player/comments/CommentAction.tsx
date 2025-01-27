import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import ModalCancelConfirm from "@/components/ModalCancelConfirm";

interface CommentActionsDropdownProps {
  onToggle: () => void; // Callback to notify parent of toggle
  onEdit: () => void; // Callback for edit action
  onDelete: (id: string) => void; // Callback for delete action
  id: string; // ID of the comment or item
}

export default function CommentActionsDropdown({
  onToggle,
  onEdit,
  onDelete,
  id,
}: CommentActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false); // Dropdown state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    onToggle(); // Notify parent when dropdown is toggled
  };

  const closeDropdown = () => setIsOpen(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-black hover:bg-[#F0F7FE]"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img
          src={"/icons/verticalMenu.svg"}
          alt="Menu"
          width={25}
          height={20}
        />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 w-40 bg-white shadow-lg rounded-lg z-10"
          role="menu"
          aria-label="Comment actions"
        >
          <ul>
            <li
              className="flex items-center px-4 py-2 font-18px hover:bg-[#F0F7FE] text-[#000E3C] cursor-pointer font-medium"
              role="menuitem"
              onClick={() => {
                onEdit(); // Trigger edit action
                closeDropdown();
              }}
            >
              <img
                src={"/icons/edit.svg"}
                alt="Edit"
                className="mr-2"
                width={20}
                height={20}
              />
              Edit
            </li>
            <li
              className="flex items-center px-4 py-2 font-18px hover:bg-[#F0F7FE] text-[#000E3C] cursor-pointer font-medium"
              role="menuitem"
              onClick={() => {
                toggleModal(); // Open the confirmation modal
                closeDropdown();
              }}
            >
              <img
                src={"/icons/delete.svg"}
                alt="Delete"
                className="mr-2"
                width={20}
                height={20}
              />
              Delete
            </li>
          </ul>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ModalCancelConfirm
          isOpen={isModalOpen}
          toggleDialog={toggleModal}
          handleDialogConfirm={() => {
            onDelete(id); // Confirm delete action
            toggleModal(); // Close modal
          }}
          title={"Delete Comment?"} // Primary title
          subtitle={"Delete your comment permanently?"} // Secondary subtitle
          confirmButtonText="Delete"
        />
      )}
    </div>
  );
}

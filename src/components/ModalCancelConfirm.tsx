import React from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface ModalCancelConfirmProps {
  handleDialogConfirm: () => void; // Function to handle confirmation
  handleDialogCancel?: () => void; // Optional function to handle cancellation
  title: string; // Primary title text for the dialog
  subtitle: string; // Secondary subtitle text for the dialog
  isOpen?: boolean; // Boolean to indicate if the dialog is open
  toggleDialog: () => void; // Function to toggle dialog visibility
  confirmButtonText?: string; // Optional text for the confirm button
}

const ModalCancelConfirm: React.FC<ModalCancelConfirmProps> = ({
  handleDialogConfirm,
  handleDialogCancel,
  title,
  subtitle,
  isOpen = false,
  toggleDialog,
  confirmButtonText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="py-6 gap-4 justify-center rounded-xl items-center bg-white">
        <DialogHeader>
          {/* Primary Title */}
          <DialogTitle className="font-18px font-medium text-[#000E3C]">
            {title}
          </DialogTitle>
          {/* Secondary Subtitle */}
          <p className="font-18px text-[#8790A1] !mt-4 text-center font-medium">{subtitle}</p>
        </DialogHeader>
        <DialogFooter className="flex justify-between w-full">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              handleDialogCancel && handleDialogCancel();
            }}
            className="rounded-full text-[#000E3C] "
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              toggleDialog();
              handleDialogConfirm();
            }}
            className="rounded-full text-red-500 hover:bg-red-100"
              variant="ghost"
          >
            {confirmButtonText || "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCancelConfirm;

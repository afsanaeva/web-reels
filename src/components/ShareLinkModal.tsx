import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";

interface ShareLinkModalProps {
  videoUrl: string; // The link to be shared
  isOpen: boolean; // Boolean to indicate if the modal is open
  toggleModal: () => void; // Function to toggle modal visibility
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  videoUrl,
  isOpen,
  toggleModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(videoUrl)
      .then(() => {
        // Show success toast
        toast({
          description: "Link copied to clipboard.",
          variant: "success",
        });

        setCopied(true);
        setTimeout(() => setCopied(false), 5000); // Reset copied state after 5 seconds
      })
      .catch((error) => {
        console.error("Failed to copy the URL", error);

        // Show error toast
        toast({
          description: "Failed to copy.",
          variant: "error",
        });
      });
  };

  const handleFacebookShare = () => {
    const facebookShareUrl = `https://www.facebook.com/
    )}`;
    window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleMessengerShare = () => {
    const messengerShareUrl = `https://www.messenger.com/
    )}`;
    window.open(messengerShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppShare = () => {
    const whatsappShareUrl = `https://www.whatsapp.com/
    )}`;
    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  };

  const handleInstagramShare = () => {
    const whatsappShareUrl = `https://www.instagram.com/
    )}`;
    window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={toggleModal}>
      <DialogContent className="px-6 py-3 justify-center rounded-xl items-center bg-white max-w-lg absolute left-[35%] ml-2 transform -translate-x-4">
        <DialogTitle>
          <VisuallyHidden>Share Link Modal</VisuallyHidden>
        </DialogTitle>
        {/* Sharing Options */}
        <div className="flex gap-5 w-full mt-4">
          <div
            className="flex flex-col items-center"
            onClick={handleMessengerShare}
          >
            <Image
              src="/assets/socialMedia/messenger.png"
              alt="Messenger"
              width={48}
              height={30}
              
            />
            <span className="font-16px text-[#000E3C] mt-2">Messenger</span>
          </div>
          <div
            className="flex flex-col items-center w-[80px] cursor-pointer"
            onClick={handleFacebookShare}
          >
            <Image
              src="/assets/socialMedia/facebook.png"
              alt="Facebook"
              width={48}
              height={30}
              
            />
            <span className="font-16px text-[#000E3C] mt-2">Facebook</span>
          </div>
          <div
            className="flex flex-col items-center w-[80px]  cursor-pointer"
            onClick={handleWhatsAppShare}
          >
            <Image
              src="/assets/socialMedia/whatsapp.png"
              alt="WhatsApp"
              width={48}
              height={30}
              
            />
            <span className="font-16px text-[#000E3C] mt-2">WhatsApp</span>
          </div>
          <div
            className="flex flex-col items-center w-[80px]  cursor-pointer"
            onClick={handleInstagramShare}
          >
            <Image
              src="/assets/socialMedia/instagram.png"
              alt="Instagram"
              width={48}
              height={30}
              
            />
            <span className="font-16px text-[#000E3C] mt-2">Instagram</span>
          </div>
          <div className="flex flex-col items-center w-[80px]  cursor-pointer">
            <Image
              src={"/icons/horizontalMenu.svg"}
              alt="menu"
              width={48}
              height={48}
              className=" bg-[#F0F7FE] rounded-full"
              unoptimized
            />
            <span className="font-16px text-[#000E3C] mt-2">See More</span>
          </div>
        </div>

        {/* Link Copy Section */}
        <div className="flex items-center w-full mt-6 p-2">
          <input
            type="text"
            value={videoUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-[#F0F7FE] rounded-l-md font-14px font-medium focus:outline-none pr-3 truncate"
          />

          <button
            onClick={handleCopy}
            className="px-3 py-2 font-14px font-bold text-[#005AFF] rounded-r-md bg-[#F0F7FE] pl-2"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkModal;

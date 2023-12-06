import React from "react";
import { Avatar } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";

interface ProfileAvatarProps {
  imageUrl: string;
  className?: string;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  className,
}) => {
  return (
    <Avatar className={cn(className ? className : "w-7 h-7 md:h-10 md:w-10")}>
      <AvatarImage src={imageUrl} />
    </Avatar>
  );
};

export default ProfileAvatar;

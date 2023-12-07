import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import MotionDivUp from "./animation/motion-div-up";
import ServerSideBar from "./server/server-sidebar";
import NavigationBar from "./navigation/navigation-bar";

interface MobileToggleProps {
  serverId: string;
}

const MobileToggle: React.FC<MobileToggleProps> = ({ serverId }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu className="w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex py-0 pr-0 w-fit" side="left">
        <div className="w-[72px]">
          <NavigationBar />
        </div>
        <MotionDivUp key="server-sidebar" className="w-64 h-full">
          <ServerSideBar serverId={serverId} key={"sidebar-toggle"} />
        </MotionDivUp>
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

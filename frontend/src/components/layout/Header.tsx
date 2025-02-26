import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Menu, LineChart, LucideIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}
export default function Header() {
  const navItems = [
    { href: "/portfolio", label: "Portfolio", icon: PieChart },
    { href: "/strategy", label: "Strategy", icon: LineChart },
  ];

  const renderNavItem = (item: NavItem) => (
    <Button
      variant="ghost"
      asChild
      className="text-white hover:text-blue-400 transition-colors"
    >
      <a href={item.href} className="flex items-center space-x-1">
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    </Button>
  );

  const renderMobileNavItem = (item: NavItem) => (
    <Button
      variant="ghost"
      asChild
      className="text-gray-200 hover:text-white hover:bg-gray-800/50 transition-all duration-200 justify-start"
    >
      <a href={item.href} className="flex items-center space-x-2">
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    </Button>
  );

  return (
    <Card className="w-full sticky top-0 z-50 bg-black/40 backdrop-blur-lg shadow-lg rounded-b-xl">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <a href="/" className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">Backtest</h1>
        </a>

        {/* Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <div key={index}>{renderNavItem(item)}</div>
          ))}
        </nav>

        {/* Mobile */}
        <Drawer>
          <DrawerTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-gray-800/50"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-black/90 backdrop-blur-xl text-white border-t border-gray-800/50 rounded-t-xl max-h-[50vh]">
            <nav className="flex flex-col space-y-4 p-6">
              {navItems.map((item, index) => (
                <div key={index}>{renderMobileNavItem(item)}</div>
              ))}
            </nav>
          </DrawerContent>
        </Drawer>
      </div>
    </Card>
  );
}

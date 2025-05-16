
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Menu, 
  X, 
  User, 
  Settings,
  SunMoon
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = ({ isDemoMode }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDisconnect = () => {
    navigate('/');
  };

  return (
    <header className="bg-card py-3 px-4 md:px-6 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            MAP
          </h1>
          {isDemoMode && (
            <Badge variant="outline" className="ml-3 bg-yellow-500/20 text-yellow-500 border-yellow-500">
              DEMO
            </Badge>
          )}
          <span className="ml-3 hidden md:inline-block text-sm text-muted-foreground">
            Drone Monitoring Dashboard
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <SunMoon size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <Settings size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  onClick={handleDisconnect}
                  className="text-muted-foreground hover:text-foreground hover:bg-destructive/10"
                >
                  Disconnect
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Return to landing page</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <User size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>User profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-10">
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground">
                    Drone Monitoring Dashboard
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="justify-start">
                    <SunMoon size={18} className="mr-2" />
                    Toggle theme
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <Settings size={18} className="mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start" 
                    onClick={handleDisconnect}
                  >
                    <Home size={18} className="mr-2" />
                    Disconnect
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start">
                    <User size={18} className="mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

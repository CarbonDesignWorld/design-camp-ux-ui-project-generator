import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tent, Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Tent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            <span className="text-lg sm:text-xl font-bold font-handwritten text-foreground">Design Camp</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link 
              to="/challenges/today"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Today's Challenge
            </Link>
            <Link 
              to="/projects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <Link 
              to="/community"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <Link 
              to="/leaderboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Leaderboard
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[100px] truncate">{user.user_metadata?.name || "Camper"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button variant="camp" size="sm" asChild>
                  <Link to="/signup">Join Camp</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1">
              <Link 
                to="/challenges/today"
                className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-3 px-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Today's Challenge
              </Link>
              <Link 
                to="/projects"
                className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-3 px-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/community"
                className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-3 px-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Community
              </Link>
              <Link 
                to="/leaderboard"
                className="text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors py-3 px-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              <div className="flex gap-3 pt-4 mt-2 border-t border-border">
                {user ? (
                  <Button variant="ghost" size="default" className="flex-1 h-12" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="default" className="flex-1 h-12" asChild>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button variant="camp" size="default" className="flex-1 h-12" asChild>
                      <Link to="/signup">Join Camp</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

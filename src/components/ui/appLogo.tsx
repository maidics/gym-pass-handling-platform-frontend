import { SearchAlert } from "lucide-react";

interface AppLogoProps {
  className?: string;
}

const AppLogo = ({ className }: AppLogoProps) => {
  return <SearchAlert className={className} />;
};

export default AppLogo;

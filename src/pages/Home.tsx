import { Center } from "@components/ui/center.tsx";
import { ThemeToggle } from "@components/ui/themeToggle.tsx";
import { LanguageSwitcher } from "@components/ui/languageSwitcher.tsx";
import { AuthCard } from "@components/auth/AuthCard.tsx";

const Home = () => {
  return (
    <Center>
      <LanguageSwitcher className="fixed top-6 right-20 z-50" />
      <ThemeToggle className="fixed top-6 right-6 z-50" />
      <AuthCard />
    </Center>
  );
};

export default Home;

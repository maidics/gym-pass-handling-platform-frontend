import { ArrowLeft, FileQuestionMark } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { Card } from "@ui/card.tsx";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="mb-4 text-4xl font-bold inline-flex items-center justify-center gap-2">
          <FileQuestionMark className="h-10 w-10" /> 404
        </h1>

        <p className="mb-6 text-md text-muted-foreground font-bold">
          {`${t("Oops")} ${t("PageNotFound")}`}
        </p>

        <Button variant="default" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
          {t("Back")}
        </Button>
      </Card>
    </div>
  );
};

export default NotFound;

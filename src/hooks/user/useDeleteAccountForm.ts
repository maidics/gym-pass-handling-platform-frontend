import { useState } from "react";
import { useDeleteMyAccount } from "./useDeleteAccount.ts";
import { useAuth } from "@hooks/user/useAuth.ts";

export const useDeleteMyAccountForm = () => {
  const { user } = useAuth();

  const { mutateAsync: deleteAccount, isPending: isLoading } =
    useDeleteMyAccount();

  const [confirmation, setConfirmation] = useState("");

  const isConfirmed = user?.email ? confirmation === user!.email : false;

  const handleSubmit = async () => {
    if (!isConfirmed) return;

    try {
      await deleteAccount();
    } catch {}
  };

  return {
    confirmation,
    setConfirmation,
    isConfirmed,
    isLoading,
    handleSubmit,
    userEmail: user?.email || "",
  };
};

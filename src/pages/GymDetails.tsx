import { useParams, useSearchParams } from "react-router-dom";
import { CircleQuestionMark } from "lucide-react";

import type { GymDto } from "@api/types";
import { useAuth } from "@hooks/user/useAuth";
import { useGetGymById } from "@hooks/gyms/useGetGyms";

import { GymDetailsHeader } from "@components/gyms/GymDetailsHeader";
import { GymDetailsPassesCard } from "@components/gyms/GymDetailsPassesCard";
import { GymPaymentProfileCard } from "@components/gyms/GymDetailsPaymentProfileCard";
import { GymContactInfosCard } from "@components/gymContactInfos/GymContactInfosCard";
import { GymOverviewCard } from "@components/gyms/GymOverviewCard";

import { ItemNotFound } from "@ui/itemNotFound";
import { LoadingSkeleton } from "@ui/loadingSkeleton";
import { showTenantPaymentProfile } from "@lib/permissions";

interface GymDetailsProps {
  gymData?: GymDto;
  isLoading?: boolean;
}

export default function GymDetails({
  gymData,
  isLoading: externalLoading,
}: GymDetailsProps) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isInRole, user } = useAuth();

  const shouldFetch = !gymData && !externalLoading;
  const { gym, isLoading: internalLoading } = useGetGymById(
    shouldFetch ? id : undefined,
  );

  const gymResolved = gymData ?? gym;
  const isLoading = externalLoading || (shouldFetch && internalLoading);

  const openPaymentProfileSetup =
    searchParams.get("openPaymentProfileSetup") === "true";

  if (isLoading) return <LoadingSkeleton />;

  if (!gymResolved) {
    return (
      <ItemNotFound
        Icon={CircleQuestionMark}
        resourceName="Gym"
        navigateBackToPagePath="/gyms"
        backToPageButtonLabel="BackToGyms"
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-6 min-w-0">
      <GymDetailsHeader gym={gymResolved} />

      <div className="grid gap-6 lg:grid-cols-3 flex-1 min-h-0 min-w-0">
        <div className="flex flex-col gap-6 lg:col-span-2 min-w-0 min-h-0">
          <GymOverviewCard gym={gymResolved} />
          <GymDetailsPassesCard gym={gymResolved} className="flex-1 min-h-0" />
        </div>

        <div className="flex flex-col gap-6 min-h-0 min-w-0">
          {user?.gymId &&
            showTenantPaymentProfile(isInRole, user.gymId, gymResolved.id) && (
              <GymPaymentProfileCard
                gym={gymResolved}
                openPaymentProfileSetup={openPaymentProfileSetup}
              />
            )}

          <GymContactInfosCard gym={gymResolved} />
        </div>
      </div>
    </div>
  );
}

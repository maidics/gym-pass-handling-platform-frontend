import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "../pages/NotFound.tsx";
import Home from "../pages/Home.tsx";
import Profile from "../pages/Profile.tsx";
import ActivateAccount from "../pages/ActivateAccount.tsx";
import Requests from "../pages/Requests.tsx";
import RequestDetail from "../pages/RequestDetails.tsx";
import GymDetails from "../pages/GymDetails.tsx";
import Gyms from "../pages/Gyms.tsx";
import GymEmployments from "../pages/GymEmployments.tsx";
import GymEmploymentDetails from "../pages/GymEmploymentDetails.tsx";
import { DashboardLayout } from "../components/dashboard/DashboardLayout.tsx";
import GymMembershipPasses from "../pages/GymMembershipPasses.tsx";
import TenantPaymentProfile from "@pages/TenantPaymentProfile.tsx";
import GymPassProducts from "@pages/GymPassProducts.tsx";
import GymMemberships from "@pages/GymMemberships.tsx";
import { Checkout } from "@pages/Checkout.tsx";
import GymPassUsages from "@pages/GymPassUsages.tsx";
import PasswordReset from "@pages/PasswordReset.tsx";
import RouteError from "@pages/RouteError.tsx";
import { PublicLayout } from "@navigation/PublicLayout.tsx";
import { PublicOnlyGate } from "@navigation/PublicOnlyGate.tsx";
import { ProtectedGate } from "@navigation/ProtectedGate.tsx";

const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
    children: [
      //Public
      {
        element: <PublicLayout />,
        children: [
          {
            element: <PublicOnlyGate />,
            children: [{ path: "/", element: <Home /> }],
          },
          { path: "/activate-account", element: <ActivateAccount /> },
          { path: "/password-reset", element: <PasswordReset /> },
        ],
      },

      //Private
      {
        element: <ProtectedGate />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "/profile", element: <Profile /> },
              { path: "/requests", element: <Requests /> },
              { path: "/requests/:id", element: <RequestDetail /> },
              { path: "/gyms", element: <Gyms /> },
              { path: "/gyms/:id", element: <GymDetails /> },
              { path: "/gyms/:id/employees", element: <GymEmployments /> },
              {
                path: "/gyms/:id/employees/:employmentId",
                element: <GymEmploymentDetails />,
              },
              { path: "/passes", element: <GymMembershipPasses /> },
              { path: "/payment-profile", element: <TenantPaymentProfile /> },
              { path: "/gyms/:id/pass-products", element: <GymPassProducts /> },
              { path: "/gym-members", element: <GymMemberships /> },
              { path: "/checkout/:gymPassProductId", element: <Checkout /> },
              { path: "/pass-uses", element: <GymPassUsages /> },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;

import Profiles from "@root/components/admin/Profiles";
import { useEffect } from "react";
import { useSession } from "@hooks";
import { useNavigate } from "react-router";

export const AdminProfilesPage = () => {
  const navigate = useNavigate();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  return (
    <div className="tw-container tw-my-4">
      <Profiles />
    </div>
  );
};

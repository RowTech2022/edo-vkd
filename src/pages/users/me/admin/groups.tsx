import Groups from "@root/components/admin/Groups";
import { useEffect } from "react";
import { useSession } from "@hooks";
import { useNavigate } from "react-router";

export const AdminGroupsPage = () => {
  const navigate = useNavigate();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  return (
    <div className="tw-container tw-my-4">
      <Groups />
    </div>
  );
};

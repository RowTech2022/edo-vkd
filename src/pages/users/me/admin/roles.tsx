import Roles from "@root/components/admin/Roles";
import { Layout } from "@layouts";
import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSession } from "@hooks";

export const AdminRolesPage = () => {
  const navigate = useNavigate();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  return (
    <div className="tw-container tw-my-4">
      <Roles />
    </div>
  );
};

AdminRolesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AdminRolesPage;

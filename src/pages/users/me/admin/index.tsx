import { ModuleCard } from "@ui";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@hooks";

export const AdminPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/auth/login");
    }
  }, [status]);

  return (
    <div className="tw-container tw-mt-5">
      <div className="tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-6">
        <Link to={`${pathname}/profiles`}>
          <ModuleCard title="Пользователи" description="" disabled={false} />
        </Link>
        <Link to={`${pathname}/roles`}>
          <ModuleCard title="Роли" description="" disabled={false} />
        </Link>
        <Link to={`${pathname}/groups`}>
          <ModuleCard title="Группы" description="" disabled={false} />
        </Link>
      </div>
    </div>
  );
};

import { Link } from "react-router-dom";

import { Logo } from "@ui";

const Header = () => {
  return (
    <div className="tw-bg-white tw-py-8 tw-shadow-lg tw-relative">
      <div className="tw-container">
        <div className="tw-flex tw-justify-center tw-items-center">
          <Link to="/">
            <Logo />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;

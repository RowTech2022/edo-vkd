import { PenIcon } from "@ui";
import { vh } from "@utils";
import { useRef, useState } from "react";

const isAnimationAllowed = parseInt(
  import.meta.env.VITE_PUBLIC_SIGN_ANIMATION || ""
);
export const useAnimatedPen = () => {
  const [state, setState] = useState<any>({});
  const penRef = useRef(null);

  const onMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;

    const penContainer = document.querySelector(".pen-container");

    setState({
      top: target.getBoundingClientRect().top - 320 - vh(30),
      left:
        target.getBoundingClientRect().left -
        (penContainer?.getBoundingClientRect()?.left || 0) +
        30,
    });
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setState({});
  };

  const handlePenClick = () => {
    setState({ ...state, sign: true });
    setTimeout(() => setState({ ...state, sign: false }), 800);
  };

  const iconProps = {
    top: state.top !== undefined ? state.top + "px" : 0,
    left: state.left !== undefined ? state.left + "px" : 0,
    sign: state.sign,
    className: `pen-icon ${state.top !== undefined ? "active" : ""}`,
  };

  return {
    iconContent: isAnimationAllowed ? (
      <div className="pen-container">
        <PenIcon ref={penRef} {...iconProps} />
      </div>
    ) : null,
    handlePenClick,
    onMouseOver,
    onMouseLeave,
  };
};

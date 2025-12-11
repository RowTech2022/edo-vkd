import { useEffect } from "react";
import { Fireworks, useFireworks } from "fireworks-js/dist/react";

export const Firework = ({ duration = 10000 }: { duration?: number }) => {
  const { setEnabled, enabled, options } = useFireworks({
    initialStart: false,
    initialOptions: {
      hue: {
        min: 0,
        max: 345,
      },
      delay: {
        min: 15,
        max: 15,
      },
      rocketsPoint: 50 as any,
      acceleration: 1,
      friction: 0.96,
      gravity: 1,
      particles: 90,
      trace: 3,
      explosion: 10,
      autoresize: true,
      brightness: {
        min: 50,
        max: 100,
        decay: {
          min: 0.015,
          max: 0.03,
        },
      },
      boundaries: {
        visible: false,
      },
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    },
  });

  useEffect(() => {
    setTimeout(() => setEnabled(false), duration);
  }, []);

  const style: React.CSSProperties = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "fixed",
    background: "transparent",
    zIndex: 999,
  };
  if (!enabled) {
    return null;
  }
  return <Fireworks style={style} enabled={enabled} options={options} />;
};

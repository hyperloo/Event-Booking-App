import React, { useRef } from "react";

const Spinner = () => {
  const spinner = {
    dots2: {
      interval: 80,
      frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
    },
  };
  // const divEl = useRef(null);
  // div.innerHTML = spinner.dots2.frames[0];
  // console.log(spinner.dots2.frames[0]);

  // let i = 0;
  // setInterval(() => {
  //   requestAnimationFrame(() => {
  //     div.innerHTML = spinner.dots2.frames[++i % spinner.dots2.frames.length];
  //   });
  // }, spinner.dots2.interval);

  const spin = () => {
    let i = 0;
    return {
      __html: setInterval(() => {
        requestAnimationFrame(() => {
          return spinner.dots2.frames[i++ % spinner.dots2.frames.length];
        });
      }, spinner.dots2.interval),
    };
  };

  return <span dangerouslySetInnerHTML={spin()} />;
};

export default Spinner;

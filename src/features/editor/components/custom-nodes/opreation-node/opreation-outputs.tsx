import React from "react";

const OpreationOutputs = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col gap-2 bg-background/50 rounded-lg p-2">{children}</div>;
};

export default OpreationOutputs;

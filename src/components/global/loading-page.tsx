import React from "react";

import { Spinner } from "../ui/spinner";

const LoadingPage = () => {
  return (
    <div className="flex size-full items-center justify-center">
      <Spinner size={24} />
    </div>
  );
};

export default LoadingPage;

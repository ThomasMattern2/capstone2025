import React from "react";

import ArmDisarm from "../components/displayComponents/ArmAndDisarm";
import FullImage from "../api/temporaryImageCamera";

export default function Display() {
  return (
    <div>
      <FullImage />

      <ArmDisarm />
    </div>
  );
}

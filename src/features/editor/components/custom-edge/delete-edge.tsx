import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  getStraightPath,
  useReactFlow,
} from "@xyflow/react";

import { Button } from "@/components/ui/button";

const DeleteEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getStraightPath(props);
  const { setEdges } = useReactFlow();
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={props.style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Button
            variant={"outline"}
            size={"icon"}
            className="size-5 cursor-pointer rounded-full border text-xs leading-none hover:shadow-lg"
            onClick={() => {
              setEdges((eds) => eds.filter((e) => e.id !== props.id));
            }}
          >
            x
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DeleteEdge;

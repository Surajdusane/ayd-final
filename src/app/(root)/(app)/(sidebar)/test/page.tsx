import React from "react";

import { createClient } from "@/utils/supabase/server";

// {
//     "path": "ee64c9ba-1a86-424a-8335-0ae84e7face7/1762749922812-letter-of-intent-education-counselor-kamini-vinod-kumar.docx",
//     "id": "4b59dac8-fda6-4f5d-9371-05cbfe871dc5",
//     "fullPath": "documents/ee64c9ba-1a86-424a-8335-0ae84e7face7/1762749922812-letter-of-intent-education-counselor-kamini-vinod-kumar.docx"
// }

const page = async () => {
  const supabse = await createClient();
  const data = await supabse.storage
    .from("documents")
    .createSignedUrl(
      "ee64c9ba-1a86-424a-8335-0ae84e7face7/1762749922812-letter-of-intent-education-counselor-kamini-vinod-kumar.docx",
      6000
    );
  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export default page;

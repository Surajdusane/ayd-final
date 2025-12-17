import { Button } from '@/components/ui/button'
import React from 'react'

export const SaveButton = ({ workflowId }: { workflowId: string }) => {
    // console.log(workflowId)
  return (
    <Button size={"sm"} variant={"outline"}>Save</Button>
  )
}

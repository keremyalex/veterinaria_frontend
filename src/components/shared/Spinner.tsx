import { LoaderIcon } from "lucide-react"

export const Spinner = () => {
    return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
        
      className="size-5 animate-spin"
    />
  )
}

import { Suspense } from "react"
import Verify2FA from "./Verify2FAClient"

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify2FA />
    </Suspense>
  )
}

import { JSX } from "react";
import { ConnectWallet } from "../../features/ConnectWallet";

export default function Header(): JSX.Element {
  return (
    <div>
      <ConnectWallet/>
    </div>
  )
}

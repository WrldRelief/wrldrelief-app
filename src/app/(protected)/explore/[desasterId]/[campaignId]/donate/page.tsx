"use client";

import { WalletConfirm } from "@/widgets/WalletConfirm";

const Donate = () => {
  return (
    <div>
      <WalletConfirm campaignId={0} amount={10} />
    </div>
  );
};

export default Donate;

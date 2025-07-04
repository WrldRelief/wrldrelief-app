"use client";

import { Button, Input } from "@worldcoin/mini-apps-ui-kit-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DonationFormProps {
  campaignId: number;
}

const DonationAmount = [10, 50, 100];

const DonationForm: React.FC<DonationFormProps> = () => {
  const router = useRouter();
  const [seletededDanationAmount, setSeletededDanationAmount] = useState(10);

  useEffect(() => {
    console.log(seletededDanationAmount);
  }, [seletededDanationAmount]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-4">
          {DonationAmount.map((amount) => (
            <Button
              key={amount}
              variant={
                seletededDanationAmount === amount ? "primary" : "tertiary"
              }
              onClick={() => setSeletededDanationAmount(amount)}
              className="px-4 w-"
            >
              {amount}
            </Button>
          ))}
        </div>
        <Input label="Input Amount.." />
        <div className="mt-6 w-full">
          <Button
            className="w-full"
            onClick={() => {
              router.push("/explore/1/0/Donate");
            }}
          >
            Donate
          </Button>
        </div>
      </div>
    </>
  );
};

export default DonationForm;

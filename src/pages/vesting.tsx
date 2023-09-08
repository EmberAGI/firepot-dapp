import { ConnectButton } from "@rainbow-me/rainbowkit";
import { readContract, readContracts } from "@wagmi/core";
import { formatUnits, parseUnits } from "viem";
import React, { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import TokenVesting from "../features/Contracts/abis/PowerTokenVesting.json";

const tokenVesting = "0xE0Ab51F248539ee0a1E3bd1C0ECe12f96BddFD8F";
const hottDecimals = 18;

const chunk = (arr: any[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

function date(time: bigint) {
  var date = new Date(Number(time) * 1000);
  return date.toUTCString();
}
const Button = ({
  children,
  className,
  onClick,
  type,
  disabled,
}: {
  children: any;
  className?: string;
  onClick?: any;
  type?: any;
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={
      "bg-buttonGreen flex justify-center items-center self-center py-4 px-5 gap-2.5 cursor-pointer w-full min-w-0 h-12 rounded-full border-none font-sans font-medium text-base whitespace-normal tracking-wider text-darkPurp hover:bg-lightPurp hover:transition-all disabled:bg-disPurp disabled:cursor-default disabled:hover:bg-disPurp" +
      (className ? " " + className : "")
    }
  >
    {children}
  </button>
);
interface VestingSchedule {
  initialized: boolean;
  beneficiary: string;
  cliff: bigint;
  start: bigint;
  duration: bigint;
  slicePeriodSeconds: bigint;
  revocable: boolean;
  amountTotal: bigint;
  released: bigint;
}

function Vest({ vest, i }: { vest: Vest; i: number }) {
  const [amount, setAmountInternal] = useState<`${number}`>("0");
  const setAmount = (input: string) => {
    if (/^[0-9]*(\.[0-9]{0,18})?$/.test(input)) {
      if (Number(input)) {
        setAmountInternal(input as `${number}`);
      }
    }
  };
  const { config } = usePrepareContractWrite({
    address: tokenVesting,
    functionName: "release",
    abi: TokenVesting,
    args: [
      vest.id,
      parseUnits(amount, hottDecimals)
    ],
  });
  const {write} = useContractWrite(config);

  return (
    <form
      key={`vest.${i}`}
      className="bg-darkPurp w-full rounded-2xl gap-10 pt-4 pl-12 pr-5 pb-10 grid grid-cols-3"
      onSubmit={() => write?.()}
    >
      {/* HOTT previously claimed */}
      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">HOTT Previously Claimed</h5>
        <h4 className="text-white">
          {Number(
            formatUnits(
              vest.schedule.released -
                (vest.schedule.released % 10000000000000000n),
              hottDecimals,
            ),
          )}
        </h4>
      </div>
      {/* HOTT Available to claim */}
      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">HOTT to Claim</h5>
        <h4 className="text-white">
          {Number(
            formatUnits(
              vest.releasableAmount -
                (vest.releasableAmount % 10000000000000000n),
              hottDecimals,
            ),
          ).toLocaleString()}
        </h4>
      </div>
      {/* Total HOTT */}
      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">Total Rilla</h5>
        <h4 className="text-white">
          {Number(formatUnits(vest.schedule.amountTotal, hottDecimals)).toLocaleString()}
        </h4>
      </div>
      {/* Vesting until: */}

      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">Vesting End Date</h5>
        <h4 className="text-white">
          {date(vest.schedule.start + vest.schedule.duration)}
        </h4>
      </div>
      {/* Amount to claim: */}
      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">Amount to Claim</h5>
        <div
          className={
            " col-span-8 flex outline outline-1 outline-lightPurp"
          }
        >
          <input
            className={" ml-4"}
            id="amount"
            name="amount"
            type="text"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            placeholder="0.00"
          />
          <p
            className="text-buttonGreen cursor-pointer text-xs whitespace-nowrap"
            onClick={() =>
              setAmount(
                formatUnits(vest.releasableAmount, hottDecimals),
              )
            }
          >
            Balance:{" "}
            {Number(
              formatUnits(
                vest.releasableAmount - 
                  vest.releasableAmount % 10n**BigInt(hottDecimals)//10000000000000000n
                ,
                hottDecimals
              ),
            )}
          </p>
        </div>
      </div>
      {/* Claim HOTT */}
      <div className="flex flex-col justify-between">
        <h5 className="text-lightPurp">Claim HOTT</h5>
        <Button type="submit">Claim HOTT</Button>
      </div>
    </form>
  );
}
interface Vest {
  schedule: VestingSchedule;
  releasableAmount: bigint;
  id: string;
}
export default function Vesting() {
  const { address } = useAccount();
  // const address = "0x1307Ed92b703ffcDBD70757Fe291Af92335a0194"; // only for testing
  const [vests, setVests] = useState<Vest[] | null>(null);
  useEffect(() => {
    if (!address) return;
    const getVests = async () => {
      const nVesting = (await readContract({
        address: tokenVesting,
        functionName: "getVestingSchedulesCountByBeneficiary",
        abi: TokenVesting,
        args: [address],
      })) as bigint;
      const vestIds = (await readContracts({
        contracts: new Array(nVesting).fill(0n).map((_, i) => ({
          address: tokenVesting,
          functionName: "computeVestingScheduleIdForAddressAndIndex",
          abi: TokenVesting as any,
          args: [address, i],
        })),
      })).map((val) => val.result);

      let newMethod = true;
      if (newMethod) {
        const vestingSchedules = await readContracts({
          contracts: new Array(nVesting).fill(0n).map((_, i) => ({
            address: tokenVesting,
            functionName: "getVestingSchedule",
            abi: TokenVesting as any,
            args: [vestIds[i] as any],
          })),
        });
        const filteredIds = vestIds.filter(
          (_, i) => !(vestingSchedules[i] as any).revoked,
        );
        const filteredSchedules = vestingSchedules.filter(
          (_, i) => !(vestingSchedules[i] as any).revoked,
        );
        const amounts = await readContracts({
          contracts: filteredSchedules.map((_, i) => ({
            address: tokenVesting,
            functionName: "computeReleasableAmount",
            abi: TokenVesting as any,
            args: [filteredIds[i] as any],
          })),
        });
        setVests(
          filteredSchedules.map(
            (_, i): Vest => ({
              schedule: filteredSchedules[i] as any,
              releasableAmount: amounts[i] as any,
              id: filteredIds[i] as any,
            }),
          ),
        );
      } else {
        const vesting = await readContracts({
          contracts: new Array(nVesting).fill(0n).flatMap((_, i) => [
            {
              address: tokenVesting,
              functionName: "getVestingSchedule",
              abi: TokenVesting as any,
              args: [vestIds[i] as any],
            },
            {
              address: tokenVesting,
              functionName: "computeReleasableAmount",
              abi: TokenVesting as any,
              args: [vestIds[i] as any],
            },
          ]),
        });
        setVests(
          chunk(vesting, 2)
            .filter((vest) => vest[0].revoked == false)
            .map(
              (elem, i): Vest => ({
                schedule: elem[0],
                releasableAmount: elem[1],
                id: vestIds[i] as any as string,
              }),
            ),
        );
      }
    };
    getVests();
  }, [address]);

  return (
    <div className="relative px-12 py-7 w-full">
      <section className="m-0">
        <div className="bg-paper w-full flex flex-col gap-4">
          <h3>Vests</h3>
            {address ? (
              <div className="flex flex-col gap-8 w-full justify-center items-center">
                {vests?.map((vest, i) => (
                  <React.Fragment key={`vest.${i}`}>
                    <Vest vest={vest} i={i} />
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-8 w-full justify-center items-center">
                <h4 className="text-white">
                  Connect your wallet to view if you have any eligible vests.
                </h4>
                <ConnectButton />
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

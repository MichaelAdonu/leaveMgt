"use client";

import DialogWrapper from "@/components/common/Dialog";
import { FormEvent, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IoPencil } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Balances } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type State = {
  [key: string]: number;
};

type Action = {
  type: string;
  value: number;
};
type Props = {
  balance: Balances;
};

const EditBalances = ({ balance }: Props) => {
  const initialState: State = {
    annualCredit: balance.annualCredit as number,
    annualUsed: balance.annualUsed as number,
    annualAvailable: balance.annualAvailable as number,
    casualCredit: balance.casualCredit as number,
    casualUsed: balance.casualUsed as number,
    casualAvailable: balance.casualAvailable as number,
    sickCredit: balance.sickCredit as number,
    sickUsed: balance.sickUsed as number,
    sickAvailable: balance.sickAvailable as number,
    maternityCredit: balance.maternityCredit as number,
    maternityUsed: balance.maternityUsed as number,
    maternityAvailable: balance.maternityAvailable as number,
    paternityCredit: balance.paternityCredit as number,
    paternityUsed: balance.paternityUsed as number,
    paternityAvailable: balance.paternityAvailable as number,
    studyCredit: balance.studyCredit as number,
    studyUsed: balance.studyUsed as number,
    studyAvailable: balance.studyAvailable as number,
    unpaidUsed: balance.unpaidUsed as number,
  };

  const reducer = (state: State, action: Action): State => {
    return {
      ...state,
      [action.type]: action.value,
    };
  };

  const [open, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  const handleInputChange =
    (type: string) => (e: FormEvent<HTMLInputElement>) => {
      dispatch({
        type,
        value: e.currentTarget.valueAsNumber,
      });
    };

  async function submitEditedBal(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const id = balance.id;
      const formattedValues = {
        ...state,
        id,
      };

      const res = await fetch(`/api/balance/${balance.id}`, {
        method: "PATCH",
        body: JSON.stringify(formattedValues),
      });

      if (res.ok) {
        toast.success("Edit Successful", { duration: 4000 });
        setOpen(false);
        router.refresh();
      } else {
        const errorMessage = await res.text();

        toast.error(`An error occured ${errorMessage}`, { duration: 6000 });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An Unexpected error occured");
    }
  }

  return (
    <DialogWrapper
      title="Edit Credits"
      icon={IoPencil}
      isBtn={false}
      open={open}
      setOpen={() => setOpen(!open)}
    >
      <form onSubmit={submitEditedBal}>
        <div className="grid grid-cols-3 gap-2 my-3">
          {Object.keys(initialState).map((key) => (
            <div className="flex flex-col" key={key}>
              <Label className="text-xs">{key}</Label>
              <Input
                type="number"
                onChange={handleInputChange(key)}
                value={state[key]}
              />
            </div>
          ))}
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </DialogWrapper>
  );
};

export default EditBalances;

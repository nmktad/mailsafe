'use client'

import { Input } from "@/components/ui/input";
import { useState, Fragment, useRef, useEffect } from "react";
import { Button } from "./button";
import { Icons } from "../icons";
import { toast } from "./use-toast";
import useStorage from "@/lib/hooks/useSession";
import { useRouter } from "next/navigation";

type OtpInputProps = {
  length: number;
};

let currentOtpIndex: number = 0;

const Otp = ({ length }: OtpInputProps): JSX.Element => {
  const { getItem, removeItem } = useStorage();

  const email = getItem("email");

  const [otp, setOtp] = useState<string>('');

  const [tempOtp, setTempOtp] = useState<string[]>(
    new Array(length || 6).fill("")
  );
  const [activeOtpIndex, setActiveOtpIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnchange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = target;
    const newOtp: string[] = [...tempOtp];
    newOtp[currentOtpIndex] = value.substring(value.length - 1);

    if (!value) setActiveOtpIndex(currentOtpIndex - 1);
    else setActiveOtpIndex(currentOtpIndex + 1);

    setTempOtp(newOtp);

    setOtp(isNaN(parseInt(newOtp.join(""))) ? '00000' : newOtp.join(""));
  };

  const router = useRouter();

  const handleOnKeyDown = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    currentOtpIndex = index;
    if (key === "Backspace") {
      setActiveOtpIndex(currentOtpIndex - 1);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);


  const handleSubmit = async () => {
    setIsLoading(true);

    const result = await fetch(`/api/auth/verifyemail?otp=${otp.toLocaleString()}&email=${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsLoading(false);

    if (!result?.ok) {
      toast({
        title: "Invalid OTP",
        description: "Please try again.",
        variant: "destructive",
      });
    }

    toast({
      title: "Email verified",
      description: "You can now login to your account.",
    });

    removeItem("email");

    return router.push("/login");
  }

  return (
    <form className="flex items-center space-x-2  w-fit" onSubmit={handleSubmit}>
      {tempOtp.map((_, index) => {
        return (
          <Fragment key={index}>
            <Input
              ref={index === activeOtpIndex ? inputRef : null}
              onChange={handleOnchange}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              className="w-10 text-center placeholder:text-slate-300 dark:placeholder:text-slate-500"
              type="text"
              inputMode="numeric"
              placeholder={(index + 1).toString()}
              size={5}
              value={tempOtp[index]}
            />
          </Fragment>
        );
      })}
      <Button disabled={isLoading}>
        {isLoading && (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        )}
        Submit OtpCode
      </Button>
    </form>
  );
};

export default Otp;

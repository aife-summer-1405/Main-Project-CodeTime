import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 gap-6">
      <h1 className="text-6xl">404</h1>
      <h2 className="text-4xl">یافت نشد</h2>
      <Button nativeButton={false} render={<Link href={"/"} />} className={"p-6 cursor-pointer"}>
        برگشت به خانه
      </Button>
    </div>
  );
};

export default page;

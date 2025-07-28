/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { NextResponse } from "next/server";
import { toast } from "sonner";


export const handleError = (error: any): string => {
  let message = "An unexpected error occurred";

  // Axios error
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // const status = error.response.status;
      const apiMessage = error.response.data?.message || error.message;
      message = ` ${apiMessage}`;
      toast.error(message, {
        position: "top-center",
        duration: 3000,
      });
    } else if (error.request) {
      message = "No response from server. Please check your connection.";
      toast.error(message);
    } else {
      message = error.message;
      toast.error(message);
    }
  } else if (error instanceof Error) {
    message = error.message;
    toast.error(message);
  } else if (typeof error === "string") {
    message = error;
    toast.error(message);
  } else {
    toast.error(message);
  }

  return message;
};





// utils/handleApiError.ts

export function handleApiError(error: any) {
  console.error("API Error:", error);

  const status = error?.status || 500;
  const message =
    error?.message || "Something went wrong. Please try again later.";

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}


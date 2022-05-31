import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());
export default function useUser() {
  const { data, error } = useSWR("/api/users/me", fetcher);
  const router = useRouter();

  return data;
}

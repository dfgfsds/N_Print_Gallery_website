"use client";
import RegisterModel from "@/components/RegisterModel/page";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function CreateAccountPage() {
    const router = useRouter();
    const [model, setModel] = useState(true);
    return (
        <RegisterModel open={model} handleClose={() => router.back()} />
    )
}
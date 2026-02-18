'use client';

import { CreatePartyForm } from "@/components/CreatePartyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth, useUser, initiateAnonymousSignIn } from "@/firebase";
import { useEffect } from "react";

export default function CreatePartyPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
            </Link>
        </Button>
        <div className="bg-card p-8 rounded-xl border shadow-lg">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline text-primary">Create Your Bash</h1>
                <p className="text-muted-foreground mt-2">Fill in the details below to get your party started.</p>
            </div>
            <CreatePartyForm />
        </div>
      </div>
    </div>
  );
}

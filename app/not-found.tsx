import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            We couldn&apos;t find the page you were looking for.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex min-h-10 items-center justify-center rounded-md bg-black px-4 text-sm font-medium text-white hover:bg-black/85"
          >
            Back home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

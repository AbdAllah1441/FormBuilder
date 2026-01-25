import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="pt-12 pb-12 text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Form Not Found</h2>
          <p className="text-muted-foreground">
            The form you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/">Go to Form Builder</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

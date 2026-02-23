import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <span className="text-5xl font-bold text-primary">404</span>
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Página no encontrada
        </h1>
        <p className="mb-8 text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/es">
          <Button size="lg" className="gap-2">
            <Home className="size-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * Protected Routes Layout
 * Layout para todas las rutas protegidas (intranet, onboarding)
 * El middleware se encarga de la protección, este layout es para UI consistente
 */

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <>{children}</>;
}

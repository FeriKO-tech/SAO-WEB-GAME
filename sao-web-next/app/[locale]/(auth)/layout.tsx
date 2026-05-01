import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

export default async function AuthLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4">
      {/* Background Image/Video - Same as Hero or similar */}
      <div className="absolute inset-0 z-0 bg-black">
        <div 
          className="absolute inset-0 w-full h-full object-cover opacity-30 bg-cover bg-center" 
          style={{ backgroundImage: "url('/100_floor.png')" }} 
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
          ← Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

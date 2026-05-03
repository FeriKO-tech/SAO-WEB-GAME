import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-cyan-500/20 mb-6">
            SAO
          </div>
          <h1 className="text-8xl font-heading font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/" 
            className="hero-btn-play text-sm px-6 py-3"
          >
            ← Back to Home
          </Link>
          <Link 
            href="/forum" 
            className="hero-btn-secondary text-sm px-6 py-3"
          >
            Visit Forum
          </Link>
        </div>
      </div>
    </div>
  );
}

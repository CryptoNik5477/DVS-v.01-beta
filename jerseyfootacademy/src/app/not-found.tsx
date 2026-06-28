import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center">
      <p className="font-display text-7xl font-extrabold gold-text">404</p>
      <h1 className="mt-4 font-display text-2xl font-extrabold">Off the pitch!</h1>
      <p className="mt-2 text-navy/60">
        The page you&apos;re looking for has been substituted. Let&apos;s get you back in the game.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}

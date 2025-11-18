import { Button } from "@/components/ui/button";

const GooglePlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path d="M19.31 9.373c-1.39-1.401-3.23-2.274-5.31-2.274-2.12 0-3.98.894-5.36 2.314l5.36 5.39Z" />
    <path d="M3.39 6.273a9.92 9.92 0 0 0-.39 2.527v6.4c0 .91.13 1.79.39 2.597l6.63-6.64-6.63-4.884Z" />
    <path d="M14.07 14.823l-5.32 5.35a9.83 9.83 0 0 0 4.93.927c.33 0 .66-.02.98-.07l4.02-4.04-4.61-2.167Z" />
    <path d="M20.61 10.513c0-.3-.02-.6-.05-.89l-4.22 4.23 4.61-2.17a9.96 9.96 0 0 0-.34-1.17Z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path d="M19.14 13.24C19.14 11.75 20.3 11 20.3 11C20.3 11 18.96 10.05 18.96 8.5C18.96 7.27 19.83 6.22 20.94 6.22C21.45 6.22 22.37 6.44 23 6.83C23 6.84 21.74 7.6 21.74 9.17C21.74 10.74 23 11.39 23 11.39C23 11.39 21.84 12.28 21.84 13.73C21.84 15.01 22.75 16.02 23.97 16.02C24.51 16.02 25.13 15.8 25.6 15.49C25.13 17.5 23.5 19.04 21.43 19.04C20.2 19.04 19.14 18.3 18.52 17.29C17.9 16.28 17.06 16.28 16.44 16.28C15.82 16.28 14.94 16.28 14.32 17.29C13.68 18.3 12.63 19.04 11.4 19.04C9.33 19.04 7.79 17.5 7.32 15.49C7.81 15.8 8.44 16.02 8.98 16.02C10.2 16.02 11.11 15.01 11.11 13.73C11.11 12.28 10 11.39 10 11.39C10 11.39 11.25 10.74 11.25 9.17C11.25 7.6 10 6.84 10 6.83C10.58 6.44 11.5 6.22 12.01 6.22C13.12 6.22 13.99 7.27 13.99 8.5C13.99 10.05 12.65 11 12.65 11C12.65 11 13.81 11.75 13.81 13.24C13.81 14.47 13.11 15.28 12.28 15.65C12.8 17.29 14.1 18.38 15.81 18.38C16.5 18.38 17.23 18.15 17.84 17.72C18.45 18.15 19.17 18.38 19.86 18.38C21.57 18.38 22.87 17.29 23.39 15.65C22.56 15.28 21.86 14.47 21.86 13.24L19.14 13.24Z" />
    <path d="M15.81 5.47C16.36 4.92 16.92 4 17.94 4C18.15 4 18.72 4.05 19.12 4.34C18.66 4.93 18.1 5.8 17.96 6.33C17.42 5.86 16.64 5.48 15.81 5.47Z" />
    <path d="M17.84 14.39C17.17 14.39 16.65 14.88 16.65 15.56C16.65 16.24 17.17 16.73 17.84 16.73C18.51 16.73 19.03 16.24 19.03 15.56C19.03 14.88 18.51 14.39 17.84 14.39Z" />
  </svg>
);


export function AppStoreBadges() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm">
        <GooglePlayIcon />
        <div className="text-left">
          <p className="text-xs">GET IT ON</p>
          <p className="text-lg font-semibold leading-tight">Google Play</p>
        </div>
      </Button>
      <Button size="lg" variant="outline" className="bg-background/80 backdrop-blur-sm">
        <AppleIcon />
        <div className="text-left">
          <p className="text-xs">Download on the</p>
          <p className="text-lg font-semibold leading-tight">App Store</p>
        </div>
      </Button>
    </div>
  );
}

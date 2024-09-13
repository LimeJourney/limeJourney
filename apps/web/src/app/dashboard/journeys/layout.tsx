import { JourneyProvider } from "@/app/contexts/journeyContext";

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JourneyProvider>{children}</JourneyProvider>;
}

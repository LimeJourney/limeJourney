import { JourneyProvider } from "../../../contexts/JourneyContext";

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <JourneyProvider>{children}</JourneyProvider>;
}

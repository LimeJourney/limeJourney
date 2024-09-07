"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface JourneyContextType {
  newJourneyDetails: {
    name: string;
    repeatOption: string;
  } | null;
  setNewJourneyDetails: (
    details: { name: string; repeatOption: string } | null
  ) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [newJourneyDetails, setNewJourneyDetails] = useState<{
    name: string;
    repeatOption: string;
  } | null>(null);

  return (
    <JourneyContext.Provider
      value={{ newJourneyDetails, setNewJourneyDetails }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourneyContext = () => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error("useJourneyContext must be used within a JourneyProvider");
  }
  return context;
};

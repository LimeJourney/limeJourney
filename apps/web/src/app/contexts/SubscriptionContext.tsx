"use client";

import React, { createContext, useContext, useState } from "react";

interface SubscriptionContextType {
  showSubscriptionModal: boolean;
  setShowSubscriptionModal: (show: boolean) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  return (
    <SubscriptionContext.Provider
      value={{ showSubscriptionModal, setShowSubscriptionModal }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

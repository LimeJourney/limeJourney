"use client";

import React from "react";
import SubscriptionModal from "./subscription-modal";
import { useSubscription } from "@/app/contexts/SubscriptionContext";

const SubscriptionModalWrapper: React.FC = () => {
  const { showSubscriptionModal, setShowSubscriptionModal } = useSubscription();

  return (
    <SubscriptionModal
      isOpen={showSubscriptionModal}
      onClose={() => setShowSubscriptionModal(false)}
    />
  );
};

export default SubscriptionModalWrapper;

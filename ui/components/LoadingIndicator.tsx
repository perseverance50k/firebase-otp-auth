import React, { FC } from "react";
import { motion } from "framer-motion";

export const LoadingIndicator: FC = () => {
  return (
    <div className="flex items-center justify-center h-16">
      <motion.div
        className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

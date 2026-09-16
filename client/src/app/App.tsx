import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "./queryClient";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { router } from "@/routes/router";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MotionConfig reducedMotion="user">
          <RouterProvider router={router} />
        </MotionConfig>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

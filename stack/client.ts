import { StackClientApp } from "@stackframe/react";

export const stackClientApp = new StackClientApp({ 
  tokenStore: "cookie", 
  projectId: process.env.EXPO_PUBLIC_STACK_PROJECT_ID!, 
  publishableClientKey: process.env.EXPO_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!, 
});

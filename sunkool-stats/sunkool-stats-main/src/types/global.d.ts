interface SalesIQVisitor {
  name?: (name: string) => void;
  email?: (email: string) => void;
  contactnumber?: (phone: string) => void;
}

interface Window {
  $zoho?: {
    salesiq?: {
      ready?: () => void;
      visitor?: SalesIQVisitor;
    };
  };
}

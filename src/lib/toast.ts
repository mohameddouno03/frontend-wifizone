import { toast } from "sonner";
import { Wifi, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { createElement } from "react";

/**
 * Custom toast notifications for WiFi Zone Manager
 */
export const wifiToast = {
  success(message: string, description?: string) {
    toast.success(message, {
      description,
      icon: createElement(CheckCircle, { className: "h-5 w-5 text-success" }),
      duration: 4000,
    });
  },

  error(message: string, description?: string) {
    toast.error(message, {
      description,
      icon: createElement(XCircle, { className: "h-5 w-5 text-destructive" }),
      duration: 6000,
    });
  },

  warning(message: string, description?: string) {
    toast.warning(message, {
      description,
      icon: createElement(AlertTriangle, { className: "h-5 w-5 text-warning" }),
      duration: 5000,
    });
  },

  info(message: string, description?: string) {
    toast.info(message, {
      description,
      icon: createElement(Info, { className: "h-5 w-5 text-primary" }),
      duration: 4000,
    });
  },

  /** Toast for connection status */
  connected(mikrotikName: string) {
    toast.success(`${mikrotikName} connecté`, {
      description: "Le Mikrotik est en ligne",
      icon: createElement(Wifi, { className: "h-5 w-5 text-success" }),
      duration: 3000,
    });
  },

  disconnected(mikrotikName: string) {
    toast.error(`${mikrotikName} déconnecté`, {
      description: "Le Mikrotik est hors ligne",
      icon: createElement(Wifi, { className: "h-5 w-5 text-destructive" }),
      duration: 5000,
    });
  },

  /** Toast for payment */
  paymentSuccess(amount: string) {
    toast.success("Paiement réussi", {
      description: `Montant: ${amount} GNF`,
      icon: createElement(CheckCircle, { className: "h-5 w-5 text-success" }),
      duration: 5000,
    });
  },

  paymentFailed(reason?: string) {
    toast.error("Échec du paiement", {
      description: reason || "Veuillez réessayer",
      icon: createElement(XCircle, { className: "h-5 w-5 text-destructive" }),
      duration: 6000,
    });
  },

  /** Loading toast that returns a dismiss function */
  loading(message: string) {
    return toast.loading(message, {
      duration: Infinity,
    });
  },

  /** Dismiss a specific or all toasts */
  dismiss(id?: string | number) {
    toast.dismiss(id);
  },
};

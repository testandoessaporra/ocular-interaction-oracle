
// Redirecionamento para o sistema de notificações tático
import { 
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification 
} from "@/components/ui/tactical-notification";

// Interceptar e redirecionar qualquer uso do toast padrão
const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
      if (!title && !description) return;
      
      const titleText = title || '';
      const descriptionText = description || '';
      
      switch (variant) {
        case 'destructive':
          showErrorNotification(titleText, descriptionText);
          break;
        case 'warning':
          showWarningNotification(titleText, descriptionText);
          break;
        case 'success':
          showSuccessNotification(titleText, descriptionText);
          break;
        default:
          showInfoNotification(titleText, descriptionText);
      }
    },
    dismiss: () => {}, // Sonner já gerencia isso automaticamente
  };
};

// Função de toast independente que redireciona para o sistema tático
const toast = ({ title, description, variant }: { title?: string; description?: string; variant?: string }) => {
  if (!title && !description) return { id: '', dismiss: () => {}, update: () => {} };
  
  const titleText = title || '';
  const descriptionText = description || '';
  
  switch (variant) {
    case 'destructive':
      showErrorNotification(titleText, descriptionText);
      break;
    case 'warning':
      showWarningNotification(titleText, descriptionText);
      break;
    case 'success':
      showSuccessNotification(titleText, descriptionText);
      break;
    default:
      showInfoNotification(titleText, descriptionText);
  }
  
  return { id: '', dismiss: () => {}, update: () => {} };
};

export { useToast, toast };

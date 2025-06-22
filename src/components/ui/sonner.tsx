
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Usar tema dark por padrão já que o app é dark theme
  const theme = "dark"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      visibleToasts={10}
      expand={true}
      richColors={false}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast: "tactical-card bg-gray-900/95 border-yellow-500/50 text-yellow-400 backdrop-blur-md shadow-2xl rounded-2xl mb-3",
          description: "font-inter text-xs opacity-90",
          actionButton: "tactical-btn-primary",
          cancelButton: "tactical-btn-secondary",
          closeButton: "text-yellow-400 hover:text-yellow-300",
        },
        style: {
          marginBottom: '12px'
        }
      }}
      {...props}
    />
  )
}

// Não exportar o toast genérico para evitar uso acidental
export { Toaster }

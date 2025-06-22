
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from '@/components/icons';
;

interface ValidationResult {
  isValid: boolean;
  hasWarning: boolean;
  error?: string;
  warning?: string;
}

interface ValidationAlertProps {
  validation: ValidationResult;
}

const ValidationAlert = ({ validation }: ValidationAlertProps) => {
  const { isValid, hasWarning, error, warning } = validation;
  const hasError = !isValid;

  if (!hasError && !hasWarning) return null;

  return (
    <>
      {/* Alerta de Erro (Bloqueante) */}
      {hasError && (
        <Card className="tactical-card border-red-500/50 bg-red-900/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-red-400 font-bold text-xs">CONFIGURAÇÃO INVÁLIDA</h3>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aviso (Não-bloqueante) */}
      {!hasError && hasWarning && (
        <Card className="tactical-card border-yellow-500/50 bg-yellow-900/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-yellow-400 font-bold text-xs">AVISO DE CONFIGURAÇÃO</h3>
                  <p className="text-yellow-300 text-xs">{warning}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ValidationAlert;

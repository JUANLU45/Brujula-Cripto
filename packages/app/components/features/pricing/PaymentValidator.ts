interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export class PaymentValidator {
  static validateTermsAcceptance(
    acceptedTerms: boolean,
    acceptedDisclaimer: boolean,
  ): ValidationResult {
    if (!acceptedTerms || !acceptedDisclaimer) {
      return {
        isValid: false,
        errorMessage: 'Debes aceptar los términos y el descargo de responsabilidad para continuar.',
      };
    }

    return { isValid: true };
  }

  static processError(error: unknown, fallbackMessage: string): string {
    return error instanceof Error ? error.message : fallbackMessage;
  }
}

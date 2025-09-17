import { PaymentProcessor } from './PaymentProcessor';
import { PaymentValidator } from './PaymentValidator';

interface UsePaymentProcessingProps {
  planId: string;
  planName: string;
  price: number;
  currency: string;
  period?: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  setIsProcessing: (processing: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  fallbackErrorMessage: string;
}

interface UsePaymentProcessingReturn {
  handlePaymentProcess: () => Promise<void>;
}

export function usePaymentProcessing(props: UsePaymentProcessingProps): UsePaymentProcessingReturn {
  const handlePaymentProcess = async (): Promise<void> => {
    const validation = PaymentValidator.validateTermsAcceptance(
      props.acceptedTerms,
      props.acceptedDisclaimer,
    );

    if (!validation.isValid) {
      props.setErrorMessage(validation.errorMessage || '');
      return;
    }

    props.setIsProcessing(true);
    props.setErrorMessage(null);

    try {
      const paymentData = {
        planId: props.planId,
        planName: props.planName,
        price: props.price,
        currency: props.currency,
        period: props.period,
      };

      const result = await PaymentProcessor.createCheckoutSession(paymentData);
      await PaymentProcessor.redirectToCheckout(result);

      if (props.onSuccess && result.sessionId) {
        props.onSuccess(result.sessionId);
      }
    } catch (error: unknown) {
      const errorMsg = PaymentValidator.processError(error, props.fallbackErrorMessage);
      props.setErrorMessage(errorMsg);

      if (props.onError) {
        props.onError(errorMsg);
      }
    } finally {
      props.setIsProcessing(false);
    }
  };

  return { handlePaymentProcess };
}

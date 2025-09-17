'use client';

import { Button } from '@/components/ui/Button';

import { ConsentCheckbox } from './ConsentCheckbox';
import { LoadingSpinner } from './LoadingSpinner';
import { UpgradeInfo } from './UpgradeInfo';
import { useUpgradeButtonStyles } from './useUpgradeButtonStyles';
import { useUpgradeLogic } from './useUpgradeLogic';

interface UpgradeButtonProps {
  planId?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  showConsentCheckbox?: boolean;
  customText?: string;
  onUpgrade?: (planId: string) => void;
}

export function UpgradeButton({
  planId = 'premium-monthly',
  disabled = false,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  showConsentCheckbox = false,
  customText,
  onUpgrade,
}: UpgradeButtonProps): JSX.Element {
  const {
    consentChecked,
    isProcessing,
    error,
    handleUpgrade,
    handleConsentChange,
    getButtonText,
    isButtonDisabled,
    user,
    userData,
  } = useUpgradeLogic({ planId, showConsentCheckbox, onUpgrade });

  const { getButtonClasses } = useUpgradeButtonStyles({ size, variant, fullWidth });

  return (
    <div className="space-y-4">
      {showConsentCheckbox && (
        <ConsentCheckbox
          checked={consentChecked}
          onCheckedChange={handleConsentChange}
          error={error}
        />
      )}

      <Button
        onClick={() => void handleUpgrade()}
        disabled={isButtonDisabled(disabled)}
        className={getButtonClasses()}
      >
        <LoadingSpinner isVisible={isProcessing} />
        {getButtonText(customText)}
      </Button>

      <UpgradeInfo user={user} userData={userData} />
    </div>
  );
}

export default UpgradeButton;

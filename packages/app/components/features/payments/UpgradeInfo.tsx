import type { IUser } from '@brujula-cripto/types';
import type { User } from 'firebase/auth';

interface UpgradeInfoProps {
  user: User | null;
  userData: IUser | null;
}

export function UpgradeInfo({ user, userData }: UpgradeInfoProps): JSX.Element {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">Pago seguro • Acceso instantáneo</p>

      {user && userData?.usageCreditsInSeconds && userData.usageCreditsInSeconds > 0 && (
        <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
          Ya tienes créditos activos
        </div>
      )}
    </div>
  );
}

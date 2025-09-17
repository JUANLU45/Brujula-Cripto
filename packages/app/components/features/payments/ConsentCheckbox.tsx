interface ConsentCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
}

export function ConsentCheckbox({
  checked,
  onCheckedChange,
  error,
}: ConsentCheckboxProps): JSX.Element {
  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-start space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          Acepto los{' '}
          <a
            href="/legal/terminos"
            className="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Términos de Servicio
          </a>{' '}
          y el{' '}
          <a
            href="/legal/descargo-responsabilidad"
            className="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Descargo de Responsabilidad
          </a>
          {', '}
          entiendo que esta herramienta no garantiza la recuperación total.
        </span>
      </label>

      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
    </div>
  );
}

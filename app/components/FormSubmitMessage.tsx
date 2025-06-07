import { XCircleIcon, CheckIcon } from '@heroicons/react/24/solid';

export type FormSubmitMessageProps = {
  success: boolean;
  message: string;
};

export function FormSubmitMessage({ success, message }: FormSubmitMessageProps) {
  return (
    <div className={`rounded-md p-4 ${success ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {success ? (
            <CheckIcon className="h-5 w-5 text-green-400" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-400" />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm ${success ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
}

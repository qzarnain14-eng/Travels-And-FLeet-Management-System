import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, short: 'Details', full: 'Booking details' },
  { id: 2, short: 'Pay', full: 'Payment' },
  { id: 3, short: 'Done', full: 'Confirmation' },
];

/**
 * @param {1 | 2 | 3} step — Current step (1 = booking form, 2 = checkout, 3 = success)
 */
const BookingStepper = ({ step = 1, className = '' }) => {
  return (
    <nav aria-label="Booking progress" className={`w-full ${className}`}>
      <div className="flex items-center justify-center w-full max-w-lg mx-auto px-2">
        {STEPS.map((s, index) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center min-w-[4.5rem] sm:min-w-[6rem]">
              <div
                className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all border-2 ${
                  step > s.id
                    ? 'border-orange-500 bg-gradient-to-br from-orange-600 to-amber-600 text-white shadow-md'
                    : step === s.id
                      ? 'border-orange-400 bg-orange-500/20 text-orange-300 ring-2 ring-orange-500/40 ring-offset-2 ring-offset-gray-900'
                      : 'border-gray-600 bg-gray-800/80 text-gray-500'
                }`}
                aria-current={step === s.id ? 'step' : undefined}
              >
                {step > s.id ? (
                  <Check className="w-5 h-5" strokeWidth={3} />
                ) : (
                  s.id
                )}
              </div>
              <span
                className={`mt-2 text-center text-[10px] sm:text-xs font-medium leading-tight ${
                  step === s.id
                    ? 'text-orange-300'
                    : step > s.id
                      ? 'text-gray-400'
                      : 'text-gray-500'
                }`}
              >
                <span className="sm:hidden">{s.short}</span>
                <span className="hidden sm:inline">{s.full}</span>
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 min-w-[1rem] mb-6 sm:mb-7 transition-colors ${
                  step > s.id ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gray-700'
                }`}
                aria-hidden
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default BookingStepper;

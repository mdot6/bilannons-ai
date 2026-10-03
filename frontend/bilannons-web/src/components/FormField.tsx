import { useState } from 'react'

interface FieldProps {
    label: string
    name: string
    value: string
    onChange: (name: string, value: string) => void
    errors?: string[]
    required?: boolean
    type?: 'text' | 'number'
    placeholder?: string
    hint?: string
}

const inputClasses =
    'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 ' +
    'focus:border-slate-900 focus:outline-none'

const errorClasses = 'border-red-500 focus:border-red-500'

export function TextField({
                              label, name, value, onChange, errors, required, type = 'text', placeholder, hint
                          }: FieldProps) {
    const hasError = errors !== undefined && errors.length > 0

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                {label}
                {required && <span className="text-red-600"> *</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
                className={`${inputClasses} ${hasError ? errorClasses : ''}`}
            />

            {hint && !hasError && (
                <p className="mt-1 text-xs text-slate-500">{hint}</p>
            )}

            {hasError && (
                <p className="mt-1 text-sm text-red-600">{errors.join(' ')}</p>
            )}
        </div>
    )
}

interface AreaProps extends Omit<FieldProps, 'type'> {
    rows?: number
}

export function TextAreaField({
                                  label, name, value, onChange, errors, hint, placeholder, rows = 3
                              }: AreaProps) {
    const hasError = errors !== undefined && errors.length > 0

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(name, e.target.value)}
                className={`${inputClasses} ${hasError ? errorClasses : ''}`}
            />

            {hint && !hasError && (
                <p className="mt-1 text-xs text-slate-500">{hint}</p>
            )}

            {hasError && (
                <p className="mt-1 text-sm text-red-600">{errors.join(' ')}</p>
            )}
        </div>
    )
}

    const OTHER = '__other__'

    interface ChoiceProps {
        label: string
        name: string
        value: string
        onChange: (name: string, value: string) => void
        options: string[]
        errors?: string[]
        required?: boolean
        otherPlaceholder?: string
    }

    export function ChoiceField({
                                    label, name, value, onChange, options, errors, required, otherPlaceholder
                                }: ChoiceProps) {
        const hasError = errors !== undefined && errors.length > 0
        const isKnownOption = options.includes(value)

        // Fältet står i fritextläge om användaren valt Annat, eller om ett
        // tidigare ifyllt värde inte finns bland alternativen.
        const [showOther, setShowOther] = useState(value !== '' && !isKnownOption)

        function handleSelect(selected: string) {
            if (selected === OTHER) {
                setShowOther(true)
                onChange(name, '')
            } else {
                setShowOther(false)
                onChange(name, selected)
            }
        }

        const selectValue = showOther ? OTHER : isKnownOption ? value : ''

        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                    {label}
                    {required && <span className="text-red-600"> *</span>}
                </label>

                <select
                    id={name}
                    name={name}
                    value={selectValue}
                    onChange={(e) => handleSelect(e.target.value)}
                    className={`${inputClasses} bg-white ${hasError ? errorClasses : ''}`}
                >
                    <option value="">Välj…</option>
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                    <option value={OTHER}>Annat</option>
                </select>

                {showOther && (
                    <input
                        type="text"
                        autoFocus
                        value={value}
                        placeholder={otherPlaceholder ?? 'Skriv här'}
                        onChange={(e) => onChange(name, e.target.value)}
                        className={`${inputClasses} ${hasError ? errorClasses : ''}`}
                    />
                )}

                {hasError && (
                    <p className="mt-1 text-sm text-red-600">{errors.join(' ')}</p>
                )}
            </div>
        )
    }

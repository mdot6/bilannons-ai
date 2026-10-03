import { useState } from 'react'

interface Props {
    text: string
    label?: string
}

export function CopyButton({ text, label = 'Kopiera' }: Props) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5
                 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
            {copied ? 'Kopierat' : label}
        </button>
    )
}
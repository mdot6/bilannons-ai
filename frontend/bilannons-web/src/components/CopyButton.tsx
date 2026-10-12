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
            className="rounded-sm border border-rule px-3 py-1 text-sm font-medium
                 text-plate hover:border-plate hover:bg-paper"
        >
            {copied ? 'Kopierat' : label}
        </button>
    )
}
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getAdvertisement } from '../api/client'
import { CopyButton } from '../components/CopyButton'
import type { AdvertisementResponse } from '../types/advertisement'

export function AdvertisementPage() {
    const { id } = useParams<{ id: string }>()

    const [ad, setAd] = useState<AdvertisementResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!id) return

        let cancelled = false

        getAdvertisement(id)
            .then((result) => {
                if (!cancelled) setAd(result)
            })
            .catch((e: unknown) => {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : 'Något gick fel.')
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [id])

    if (isLoading) {
        return <p className="mx-auto max-w-3xl px-4 py-16 text-slate-600">Hämtar annonsen…</p>
    }

    if (error || !ad) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16">
                <p className="text-slate-800">{error ?? 'Annonsen kunde inte visas.'}</p>
                <Link to="/ny" className="mt-4 inline-block text-slate-900 underline">
                    Skapa en ny annons
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
                ← Till startsidan
            </Link>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">Din annons är klar</h1>
            <p className="mt-2 text-slate-600">
                Läs igenom texten och ändra det som inte stämmer innan du publicerar.
            </p>

            <Section title="Rubrik" copyText={ad.title ?? ''}>
                <p className="text-lg font-semibold text-slate-900">{ad.title}</p>
            </Section>

            <Section title="Annonstext" copyText={ad.fullDescription ?? ''}>
                <p className="whitespace-pre-wrap text-slate-800">{ad.fullDescription}</p>
            </Section>

            <Section
                title="Kortversion för Facebook Marketplace"
                copyText={ad.marketplaceDescription ?? ''}
            >
                <p className="whitespace-pre-wrap text-slate-800">{ad.marketplaceDescription}</p>
            </Section>

            {ad.sellingPoints.length > 0 && (
                <Section title="Försäljningsargument">
                    <ul className="list-disc space-y-1 pl-5 text-slate-800">
                        {ad.sellingPoints.map((point) => (
                            <li key={point}>{point}</li>
                        ))}
                    </ul>
                </Section>
            )}

            {ad.missingInformation.length > 0 && (
                <section className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-5">
                    <h2 className="font-semibold text-amber-900">Komplettera gärna med</h2>
                    <p className="mt-1 text-sm text-amber-800">
                        Det här är sådant köpare brukar fråga efter. Annonsen blir
                        bättre om du fyller i mer.
                    </p>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900">
                        {ad.missingInformation.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>
            )}

            {ad.salesChecklist.length > 0 && (
                <Section title="Checklista inför försäljning">
                    <ul className="space-y-2 text-slate-800">
                        {ad.salesChecklist.map((item) => (
                            <li key={item} className="flex gap-2">
                                <span className="text-slate-400">☐</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}

            <div className="mt-10 border-t border-slate-200 pt-6">
                <Link
                    to="/ny"
                    className="inline-block rounded-lg bg-slate-900 px-5 py-2.5
                     font-medium text-white hover:bg-slate-700"
                >
                    Skapa en annons till
                </Link>
            </div>
        </div>
    )
}

interface SectionProps {
    title: string
    copyText?: string
    children: React.ReactNode
}

function Section({ title, copyText, children }: SectionProps) {
    return (
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="font-semibold text-slate-900">{title}</h2>
                {copyText && <CopyButton text={copyText} />}
            </div>
            {children}
        </section>
    )
}
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
        <div className="mx-auto max-w-3xl px-5 py-12">
            <h1 className="text-3xl font-bold tracking-tight text-ink">
                Annonsen är klar
            </h1>
            <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
                Läs igenom texten och ändra det som inte stämmer innan du
                publicerar den.
            </p>

            <article className="mt-10 rounded-sm border border-rule bg-white">
                <Block title="Rubrik" copyText={ad.title ?? ''}>
                    <p className="font-serif text-xl font-semibold leading-snug text-ink">
                        {ad.title}
                    </p>
                </Block>

                <Block title="Annonstext" copyText={ad.fullDescription ?? ''}>
                    <p className="whitespace-pre-wrap font-serif leading-relaxed text-ink-soft">
                        {ad.fullDescription}
                    </p>
                </Block>

                <Block
                    title="Kortversion för Marketplace"
                    copyText={ad.marketplaceDescription ?? ''}
                >
                    <p className="whitespace-pre-wrap font-serif leading-relaxed text-ink-soft">
                        {ad.marketplaceDescription}
                    </p>
                </Block>

                {ad.sellingPoints.length > 0 && (
                    <Block title="Försäljningsargument">
                        <ul className="space-y-2">
                            {ad.sellingPoints.map((point) => (
                                <li key={point} className="border-l-2 border-plate pl-3 text-ink-soft">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </Block>
                )}
            </article>

            {ad.missingInformation.length > 0 && (
                <section className="mt-8 rounded-sm border border-note-rule bg-note-bg p-6">
                    <h2 className="font-semibold text-note-ink">Komplettera gärna med</h2>
                    <p className="mt-1.5 max-w-[60ch] text-sm leading-relaxed text-note-ink/80">
                        Köpare brukar fråga efter det här. Fyll i mer så blir annonsen
                        bättre.
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {ad.missingInformation.map((item) => (
                            <li key={item} className="text-sm text-note-ink">
                                {item}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {ad.salesChecklist.length > 0 && (
                <section className="mt-8 rounded-sm border border-rule bg-white p-6">
                    <h2 className="font-semibold text-ink">Inför fotografering och visning</h2>
                    <ul className="mt-4 space-y-3">
                        {ad.salesChecklist.map((item) => (
                            <li key={item} className="flex gap-3 text-ink-soft">
                <span
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-rule"
                />
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="mt-10 flex items-center gap-6 border-t border-rule pt-6">
                <Link
                    to="/ny"
                    className="rounded-sm bg-ink px-5 py-2.5 font-medium text-white hover:bg-ink-soft"
                >
                    Skapa en annons till
                </Link>
                <Link to="/" className="text-sm text-plate hover:text-ink">
                    Till startsidan
                </Link>
            </div>
        </div>
    )
}

interface BlockProps {
    title: string
    copyText?: string
    children: React.ReactNode
}

function Block({ title, copyText, children }: BlockProps) {
    return (
        <section className="border-b border-rule p-6 last:border-b-0">
            <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 className="text-sm font-semibold text-muted">{title}</h2>
                {copyText && <CopyButton text={copyText} />}
            </div>
            {children}
        </section>
    )
}
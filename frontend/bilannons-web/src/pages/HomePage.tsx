import { Link } from 'react-router'

export function HomePage() {
    return (
        <>
            <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
                <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start md:gap-16">
                    <div>
                        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink md:text-5xl">
                            En bilannons som köpare litar på
                        </h1>

                        <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-ink-soft">
                            Fyll i det du vet om bilen. Du får en färdig annonstext, en
                            kortversion för Marketplace och en checklista inför
                            fotograferingen.
                        </p>

                        <p className="mt-4 max-w-[48ch] leading-relaxed text-muted">
                            Det du inte fyller i står det ingenting om.
                        </p>

                        <Link
                            to="/ny"
                            className="mt-8 inline-block rounded-sm bg-ink px-6 py-3
                         font-medium text-white hover:bg-ink-soft"
                        >
                            Skapa annons
                        </Link>
                    </div>

                    <figure className="rounded-sm border border-rule bg-white p-6">
                        <figcaption className="mb-4 border-b border-rule pb-3 text-sm text-muted">
                            Så här kan resultatet se ut
                        </figcaption>

                        <p className="font-serif text-lg font-semibold leading-snug text-ink">
                            Volvo V70 2015 – Diesel, Automat, 14 500 mil – 89 000 kr
                        </p>

                        <div className="mt-4 space-y-3 font-serif leading-relaxed text-ink-soft">
                            <p>
                                Volvo V70, årsmodell 2015. Diesel och automat,
                                mätarställning 14 500 mil.
                            </p>
                            <p>Utrustning: Dragkrok, farthållare, vinterdäck på fälg.</p>
                            <p>Kända fel och brister: Vänster bakljus behöver bytas.</p>
                        </div>
                    </figure>
                </div>
            </section>

            <section className="border-t border-rule bg-white">
                <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-3 md:gap-12">
                    <Point title="Bara det du anger">
                        Tjänsten gissar aldrig. Saknas en uppgift utelämnas den, och
                        du får veta vad som fattas.
                    </Point>
                    <Point title="Två versioner">
                        En utförlig text för Blocket och en kort för Facebook
                        Marketplace.
                    </Point>
                    <Point title="Checklista inför visning">
                        Vad du bör fotografera och vilka papper köparen brukar fråga
                        efter.
                    </Point>
                </div>
            </section>
        </>
    )
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="font-semibold text-ink">{title}</h2>
            <p className="mt-2 leading-relaxed text-muted">{children}</p>
        </div>
    )
}
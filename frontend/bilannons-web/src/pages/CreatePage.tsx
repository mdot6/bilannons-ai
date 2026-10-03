import { useState } from 'react'
import { useNavigate } from 'react-router'
import { TextField, TextAreaField, ChoiceField } from '../components/FormField'
import { ApiValidationError, createAdvertisement, generateAdvertisement } from '../api/client'
import type { CreateAdvertisementRequest } from '../types/advertisement'

/** Alla fält hålls som text i formuläret och konverteras vid utskick. */
const FUEL_TYPES = ['Bensin', 'Diesel', 'El', 'Hybrid', 'Laddhybrid', 'Gas']
const TRANSMISSIONS = ['Manuell', 'Automat']
const emptyForm = {
    make: '',
    model: '',
    modelYear: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    registrationNumber: '',
    color: '',
    equipment: '',
    serviceHistory: '',
    condition: '',
    knownIssues: '',
    askingPrice: ''
}

type FormState = typeof emptyForm

export function CreatePage() {
    const navigate = useNavigate()

    const [form, setForm] = useState<FormState>(emptyForm)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [generalError, setGeneralError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    function handleChange(name: string, value: string) {
        setForm((previous) => ({ ...previous, [name]: value }))
    }

    /** Backend namnger fält med versal, formuläret med gemen. */
    function errorsFor(field: string): string[] | undefined {
        const key = field.charAt(0).toUpperCase() + field.slice(1)
        return errors[key] ?? errors[field]
    }

    /** Tom text skickas som undefined så att backend lagrar null. */
    function optional(value: string): string | undefined {
        return value.trim() === '' ? undefined : value.trim()
    }

    function optionalNumber(value: string): number | undefined {
        return value.trim() === '' ? undefined : Number(value)
    }

    function toRequest(): CreateAdvertisementRequest {
        return {
            make: form.make.trim(),
            model: form.model.trim(),
            modelYear: Number(form.modelYear),
            mileage: Number(form.mileage),
            fuelType: form.fuelType.trim(),
            transmission: form.transmission.trim(),
            registrationNumber: optional(form.registrationNumber),
            color: optional(form.color),
            equipment: optional(form.equipment),
            serviceHistory: optional(form.serviceHistory),
            condition: optional(form.condition),
            knownIssues: optional(form.knownIssues),
            askingPrice: optionalNumber(form.askingPrice)
        }
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        setErrors({})
        setGeneralError(null)
        setIsSubmitting(true)

        try {
            const created = await createAdvertisement(toRequest())
            await generateAdvertisement(created.id)
            navigate(`/annons/${created.id}`)
        } catch (error) {
            if (error instanceof ApiValidationError) {
                setErrors(error.errors)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setGeneralError(
                    error instanceof Error ? error.message : 'Något gick fel.'
                )
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const hasErrors = Object.keys(errors).length > 0

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-3xl font-bold text-slate-900">Uppgifter om bilen</h1>
            <p className="mt-2 text-slate-600">
                Fält märkta med stjärna är obligatoriska. Allt du lämnar tomt
                utelämnas ur annonsen i stället för att gissas.
            </p>

            {hasErrors && (
                <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                    Några uppgifter behöver rättas. Se markeringarna nedan.
                </div>
            )}

            {generalError && (
                <div className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">
                    {generalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Grunduppgifter</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            label="Märke" name="make" required
                            value={form.make} onChange={handleChange}
                            errors={errorsFor('make')} placeholder="Volvo"
                        />
                        <TextField
                            label="Modell" name="model" required
                            value={form.model} onChange={handleChange}
                            errors={errorsFor('model')} placeholder="V70"
                        />
                        <TextField
                            label="Modellår" name="modelYear" required type="number"
                            value={form.modelYear} onChange={handleChange}
                            errors={errorsFor('modelYear')} placeholder="2015"
                        />
                        <TextField
                            label="Miltal" name="mileage" required type="number"
                            value={form.mileage} onChange={handleChange}
                            errors={errorsFor('mileage')} placeholder="14500"
                            hint="Mätarställning i mil"
                        />
                        <ChoiceField
                            label="Bränsletyp" name="fuelType" required
                            value={form.fuelType} onChange={handleChange}
                            errors={errorsFor('fuelType')} options={FUEL_TYPES}
                            otherPlaceholder="Till exempel Etanol"
                        />
                        <ChoiceField
                            label="Växellåda" name="transmission" required
                            value={form.transmission} onChange={handleChange}
                            errors={errorsFor('transmission')} options={TRANSMISSIONS}
                        />
                        <TextField
                            label="Registreringsnummer" name="registrationNumber"
                            value={form.registrationNumber} onChange={handleChange}
                            errors={errorsFor('registrationNumber')} placeholder="ABC123"
                            hint="Används inte i annonsen, bara för din egen överblick"
                        />
                        <TextField
                            label="Färg" name="color"
                            value={form.color} onChange={handleChange}
                            errors={errorsFor('color')} placeholder="Mörkblå"
                        />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Skick och historik</h2>

                    <TextAreaField
                        label="Utrustning" name="equipment"
                        value={form.equipment} onChange={handleChange}
                        errors={errorsFor('equipment')}
                        placeholder="Dragkrok, farthållare, vinterdäck på fälg"
                        hint="Separera med komma. De tre första blir försäljningsargument."
                    />

                    <TextAreaField
                        label="Servicehistorik" name="serviceHistory"
                        value={form.serviceHistory} onChange={handleChange}
                        errors={errorsFor('serviceHistory')}
                        placeholder="Servad enligt schema hos märkesverkstad"
                    />

                    <TextAreaField
                        label="Bilens skick" name="condition"
                        value={form.condition} onChange={handleChange}
                        errors={errorsFor('condition')}
                        placeholder="Gott skick, mindre stenskott i vindrutan"
                    />

                    <TextAreaField
                        label="Kända fel och skador" name="knownIssues"
                        value={form.knownIssues} onChange={handleChange}
                        errors={errorsFor('knownIssues')}
                        placeholder="Vänster bakljus behöver bytas"
                        hint="Var ärlig här. Köpare upptäcker fel ändå, och en annons som nämner dem väcker förtroende."
                    />

                    <TextField
                        label="Önskat pris" name="askingPrice" required type="number"
                        value={form.askingPrice} onChange={handleChange}
                        errors={errorsFor('askingPrice')} placeholder="89000"
                        hint="Kronor. Annonser utan pris får betydligt färre svar."
                    />
                </section>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-slate-900 px-6 py-3 font-medium text-white
                     hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {isSubmitting ? 'Skapar annons…' : 'Skapa annons'}
                </button>
            </form>
        </div>
    )
}
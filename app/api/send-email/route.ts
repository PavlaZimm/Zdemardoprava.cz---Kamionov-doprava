import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const data = await request.json()

  const {
    fromLocation,
    toLocation,
    distance,
    cargoType,
    fullTruckType,
    pickupDate,
    firstName,
    lastName,
    companyName,
    phone,
    email,
    address,
    note,
  } = data

  const html = `
    <h2>Nová poptávka přepravy</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:15px">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Odkud</td><td style="padding:8px;border:1px solid #ddd">${fromLocation}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Kam</td><td style="padding:8px;border:1px solid #ddd">${toLocation}</td></tr>
      ${distance ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Vzdálenost</td><td style="padding:8px;border:1px solid #ddd">${distance} km</td></tr>` : ''}
      ${cargoType ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Typ nákladu</td><td style="padding:8px;border:1px solid #ddd">${cargoType}</td></tr>` : ''}
      ${fullTruckType ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Typ vozidla</td><td style="padding:8px;border:1px solid #ddd">${fullTruckType}</td></tr>` : ''}
      ${pickupDate ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Datum nakládky</td><td style="padding:8px;border:1px solid #ddd">${pickupDate}</td></tr>` : ''}
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Jméno</td><td style="padding:8px;border:1px solid #ddd">${firstName} ${lastName}</td></tr>
      ${companyName ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Firma</td><td style="padding:8px;border:1px solid #ddd">${companyName}</td></tr>` : ''}
      ${phone ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Telefon</td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>` : ''}
      ${email ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>` : ''}
      ${address ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Adresa</td><td style="padding:8px;border:1px solid #ddd">${address}</td></tr>` : ''}
      ${note ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Poznámka</td><td style="padding:8px;border:1px solid #ddd">${note}</td></tr>` : ''}
    </table>
  `

  try {
    await resend.emails.send({
      from: 'Poptávka <onboarding@resend.dev>',
      to: 'marketing@zdemar.cz',
      subject: `Nová poptávka: ${fromLocation} → ${toLocation}`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Email error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

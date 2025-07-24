import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactEmail } from '../../../components/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);
const receipt_email = process.env.SITE_EMAIL;

export async function POST(request: Request) {
  try {
    const { fullName, email, subject, message } = await request.json();

    if (!fullName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'fazioprod.inter@gmail.com', // Remplacez par votre domaine vérifié
      to: `${receipt_email}`, // Votre adresse de réception
      subject: `New Contact Form Submission: ${subject}`,
      react: ContactEmail({ fullName, email, subject, message }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Email sent successfully', data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
import * as React from 'react';
import { Html, Body, Container, Text, Heading, Hr } from '@react-email/components';

interface ContactEmailProps {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmail: React.FC<ContactEmailProps> = ({ fullName, email, subject, message }) => (
  <Html>
    <Body>
      <Container>
        <Heading>Contact Form Submission</Heading>
        <Text><strong>Name:</strong> {fullName}</Text>
        <Text><strong>Email:</strong> {email}</Text>
        <Text><strong>Subject:</strong> {subject}</Text>
        <Text><strong>Message:</strong> {message}</Text>
        <Hr />
        <Text>Sent from your website</Text>
      </Container>
    </Body>
  </Html>
);
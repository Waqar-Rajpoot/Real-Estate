import React from "react";
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Container,
  Hr,
  Link,
} from "@react-email/components";

export default function VerificationEmail({ username, otp, emailType }) {
  // Dynamic content selection based on emailType
  const getContent = () => {
    switch (emailType) {
      case "VERIFY":
        return {
          subject: "Verify Your Account",
          body: "Thank you for joining our Real Estate Portal. To complete your registration and start exploring or listing properties, please use the following verification code:",
        };
      case "2FA":
        return {
          subject: "Two-Factor Authentication",
          body: "A login attempt was made to your account. To maintain your security, please use the 6-digit code below to authorize this session:",
        };
      case "RESET":
        return {
          subject: "Reset Your Password",
          body: "We received a request to reset the password for your Real Estate account. Use the code below to proceed with the update:",
        };
      default:
        return {
          subject: "Security Code",
          body: "Please use the following security code for your account:",
        };
    }
  };

  const { subject, body } = getContent();

  return (
    <Html>
      <Head>
        <title>{subject}</title>
        <Font
          fontFamily="Helvetica"
          fallbackFontFamily="Arial"
          fontWeight="400"
          fontStyle="normal"
        />
      </Head>
      <Preview>{otp} is your {subject} code</Preview>
      
      <Section style={main}>
        <Container style={container}>
          {/* Brand Header */}
          <Section style={header}>
            <Text style={logoText}>
              REAL ESTATE <span style={blueText}>PORTAL</span>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Main Body */}
          <Section style={content}>
            <Heading style={h1}>Hello {username},</Heading>
            
            <Text style={paragraph}>
              {body}
            </Text>

            {/* Clean OTP Display */}
            <Section style={otpBox}>
              <Text style={otpText}>{otp}</Text>
            </Section>

            <Text style={expiryText}>This code will expire in 5 minutes for your security.</Text>

            <Text style={warningText}>
              Security Notice: If you did not request this email, please ignore it or change your password immediately if you suspect unauthorized access.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Professional Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 Real Estate Portal Inc. All rights reserved.
            </Text>
            <Text style={footerText}>
              Helping you find the perfect place to call home.
            </Text>
            <Link href="https://your-realestate-domain.com" style={footerLink}>
              Visit our Website
            </Link>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

// --- Clean & Professional Styles ---

const main = {
  backgroundColor: "#f4f7f9",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px",
  borderRadius: "12px",
  border: "1px solid #e1e8ed",
  maxWidth: "540px",
};

const header = {
  textAlign: "center",
  paddingBottom: "10px",
};

const logoText = {
  color: "#1a1f36",
  fontSize: "22px",
  fontWeight: "800",
  letterSpacing: "0.5px",
  margin: "0",
};

const blueText = {
  color: "#2563eb", 
};

const hr = {
  borderColor: "#edf2f7",
  margin: "20px 0",
};

const content = {
  textAlign: "left",
};

const h1 = {
  color: "#1a202c",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 24px",
};

const otpBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  textAlign: "center",
  border: "2px dashed #cbd5e1",
  margin: "24px 0",
};

const otpText = {
  color: "#2563eb",
  fontSize: "36px",
  fontWeight: "800",
  letterSpacing: "8px",
  margin: "0",
};

const expiryText = {
  color: "#718096",
  fontSize: "14px",
  fontWeight: "500",
  textAlign: "center",
  margin: "10px 0 0",
};

const warningText = {
  color: "#a0aec0",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "32px",
  fontStyle: "italic",
};

const footer = {
  textAlign: "center",
};

const footerText = {
  color: "#718096",
  fontSize: "12px",
  margin: "4px 0",
};

const footerLink = {
  color: "#2563eb",
  fontSize: "12px",
  textDecoration: "underline",
  display: "block",
  marginTop: "12px",
};
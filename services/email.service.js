const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const logger = require("../config/logger");

dotenv.config()

const createTransporter = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Use Mailtrap in development mode
  if (isDevelopment) {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    })
  }

  // Use Gmail (or other provider) in production mode
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

const createPasswordRecoveryEmail = (email, code) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Código de Recuperação - ${process.env.APP_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { background: #f8f9fa; padding: 30px; text-align: center; }
          .code { 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 8px;
            color: #007bff;
            margin: 20px 0;
            padding: 15px;
            background: white;
            border: 2px dashed #007bff;
            border-radius: 8px;
            display: inline-block;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #6c757d; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperação de Senha</h1>
          </div>
          <div class="content">
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            <p>Use o código abaixo para continuar:</p>
            
            <div class="code">${code}</div>
            
            <p>Este código expira em <strong>15 minutos</strong>.</p>
            <p>Se você não solicitou esta redefinição, por favor ignore este email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} ${process.env.APP_NAME}. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

const sendPasswordRecoveryEmail = async (email, token) => {
  try {
    const transporter = createTransporter()
    const mailOptions = createPasswordRecoveryEmail(email, token)
    const result = await transporter.sendMail(mailOptions)
    logger.info('Email sent successfully:', result.messageId)
    return true
  } catch (error) {
    console.warn('Error sending email:', error)
    throw new Error('Failed to send recovery email')
  }
}

module.exports = {
  sendPasswordRecoveryEmail
}

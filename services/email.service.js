const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

dotenv.config()

// Configuração do transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a946c6d2876aac",
      pass: "64206fce126aa5"
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
    console.log('Email enviado com sucesso:', result.messageId)
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    throw new Error('Falha ao enviar email de recuperação')
  }
}

const createTestTransporter = () => {
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a946c6d2876aac",
      pass: "64206fce126aa5"
    }
  })
}

module.exports = {
  sendPasswordRecoveryEmail,
  createTestTransporter
}

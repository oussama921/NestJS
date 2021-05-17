import { ConfigService } from 'modules/config';
import Utils from './utils';


export default class MailingHelper {

  static async sendAccountVerificationEmail(
    configService: ConfigService, 
    email: string,
    token: string
    ){
    let mailOptions = {
      from: '"UPTECH WORKFLOW" <' + configService.get("EMAIL_USER") + '>',
      to: email, // list of receivers (separated by ,)
      subject: 'Validation d\'inscription',
      html: 'Bonjour, <br><br> Vous souhaitez rejoindre notre equipe! Veuillez d\'abord verifier votre mail<br>'+
      'Voici votre code de confirmation de votre inscription : ' + token + '<br>'
    };
    return await Utils.sendEmail(configService, mailOptions)
  }

  static async sendForgetPasswordEmail(
    configService: ConfigService, 
    email: string,
    newPasswordToken: string
    ){
      let mailOptions = {
        from: '"UPTECH WORKFLOW" <' + configService.get("EMAIL_USER") + '>',
        to: email, // list of receivers (separated by ,)
        subject: 'UPTECH WORKFLOW Frogotten Password',
        text: 'Forgot Password',
        html: 'Bonjour'+ '<br><br> Voici votre code  ' + newPasswordToken + '<br><br>pour réussir à réinitialiser votre mot de passe.'// html body
      }
    return await Utils.sendEmail(configService, mailOptions)
  }
}


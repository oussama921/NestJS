import { ConfigService } from 'modules/config';
import * as nodemailer from 'nodemailer';

export default class Utils {
  static async sendEmail(configService: ConfigService, mailOptions: any) {
    let transporter = nodemailer.createTransport({
      host: configService.get("EMAIL_HOST"),
      port: configService.get("EMAIL_PORT"),
      secure: configService.get("EMAIL_SECURE"), // true for 465, false for other ports
      auth: {
        user: configService.get("EMAIL_USER"),
        pass: configService.get("EMAIL_PASS")
      },
      /*tls:{
          ciphers:'SSLv3'
      }*/
    });

    return await new Promise<boolean>(async function(resolve, reject) {
      return await transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.log('Message sent: %s', error);
          return reject(false);
        }
        console.log('Message sent: %s', info.messageId);
        resolve(true);
      });
    })
  }
}


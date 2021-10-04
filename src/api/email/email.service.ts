import { Injectable, InternalServerErrorException } from '@nestjs/common';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { EmailTemplate } from './email.template-enum';
import { SendGridConfig } from '../types/index';
import { InjectSendGirdConfig } from '../configuration/sendgrid.configuration';

@Injectable()
export class EmailService {
  constructor(@InjectSendGirdConfig() private readonly sendGridConfig: SendGridConfig) {
    sgMail.setApiKey(sendGridConfig.api_key);
  }

  async sendByTemplate(
    templateId: EmailTemplate,
    mailData: MailDataRequired,
    isMultiple: boolean = false,
  ): ReturnType<typeof sgMail.send> {
    try {
      mailData = { ...mailData, templateId, from: '1751012039loc@ou.edu.vn' };
      return await sgMail.send(mailData, isMultiple);
    } catch (e) {
      throw new InternalServerErrorException(
        e.response?.body?.errors || e,
        `Error sending email${e.message}`,
      );
    }
  }
}

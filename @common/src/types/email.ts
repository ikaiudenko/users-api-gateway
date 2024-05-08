export interface ISendEmail {
  to: string;
  subject: string;
  text?: string;
  templateId?: string;
  vars?: Record<string, string>;
}
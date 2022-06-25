import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private baseUrl = environment.iisUrl + 'Email/';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    //'Acces-Control-Allow-Origin' : this.baseUrl
  });
  private options = { headers: this.headers, withCredentials: true };
  private signature = 'Bosch-Store Support Team';

  constructor(private http: HttpClient) {}

  sendEmail(
    receiverName: string,
    message: string,
    subject: string
  ): Observable<boolean> {
    const emailDetails = {
      receiver: 'fixed-term.Georgiana.Hotea@ro.bosch.com',
      messageTemplate:
        'Dear ' +
        receiverName +
        ' ,' +
        '<br/><br/>' +
        message +
        '<br/><br/>' +
        'Best regards,' +
        '<br/><br/>' +
        '<strong>' +
        this.signature +
        '</strong>',
      subject: subject,
    };
    const body = JSON.stringify(emailDetails);
    return this.http.post<boolean>(
      this.baseUrl + 'SendEmail',
      body,
      this.options
    );
  }
}

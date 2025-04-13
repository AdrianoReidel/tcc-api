import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>API TCC Adriano</title>
        <link rel="icon" href="https://avatars.githubusercontent.com/u/160292198?s=200&v=4" type="image/png">
        
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap');

          * {
            font-family: 'Exo 2';
          }

          html {
            overflow-x: hidden;
            background-color: #eeeef4;
            color: #464a4a;
            font-weight: 400;
            padding-left: 80px;
          }

          h1,
          h2,
          h3,
          h4,
          p {
            line-height: 1.5;
          }

          h1 {
            font-size: 2.5rem;
            font-weight: 600;
          }

          p {
            font-size: 18px;
          }

          button {
            border: 1px solid #230C7D;
            background-color: #230C7D;
            color: #ffffff;
            border-radius: 8px;
            padding: 4px 10px;
            max-width: 220px;
            transition: all 200ms ease;
            outline: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
          }

          button:hover {
            background-color: #CFEF9E;
            border-color: #CFEF9E;
            color: black;
          }
        </style>
      </head>
      <body>
      <nav style='display: flex; align-items: center;'>
        <h1>API saudável!</h1>
        <img style='margin-left: 20px; width: 64px; height: 64px; border-radius: 6px;' src='https://avatars.githubusercontent.com/u/88398420?s=400&u=ebafd415bdf54ce8483d7a1e4a55608cf20fee22&v=4' alt='Adriano Reidel' />
      </nav>

        <p>API do TCC feito pelo <a href='https://github.com/AdrianoReidel/'</p>

        <p>Clique no botão abaixo para ver a documentação da API.</p>
        <button onclick="goToDoc()">Ver Documentação</button>

        <script>
          function generateReport() {
            fetch('/v1/report/', {
              method: 'GET'
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            })
            .catch(error => console.error('Erro ao gerar o relatório:', error));
          }

          function goToDoc() {
            let url = window.location.href;
            url = url.substr(0, url.length - 3) + '/api-docs/';
            window.open(url, '_blank');
          } 
        </script>
      </body>
      </html>
    `;
  }
}

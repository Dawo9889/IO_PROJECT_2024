using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Application.Services.Email
{
    public class HtmlMessageBuilder
    {
        private readonly string _backgroundColor = "#37392d";
        private readonly string _contentBackgroundColor = "#20211a";
        private readonly string _headerColor = "#f65586";
        private readonly string _textColor = "#c4e6e9";
        private readonly string _buttonColor = "#f65586";
        private readonly string _buttonTextColor = "#ffffff";
        private readonly string _footerColor = "#ffed90";
        private readonly string _footerLinkColor = "#ffe14d";

        private string _title = "Default Title";
        private string _body = "Default message body.";
        private string? _buttonText;
        private string? _buttonLink;
        private string? _footer;

        public HtmlMessageBuilder SetTitle(string title)
        {
            _title = title;
            return this;
        }

        public HtmlMessageBuilder SetBody(string body)
        {
            _body = body;
            return this;
        }

        public HtmlMessageBuilder SetButton(string text, string link)
        {
            _buttonText = text;
            _buttonLink = link;
            return this;
        }

        public HtmlMessageBuilder SetFooter(string footer)
        {
            _footer = footer;
            return this;
        }

        public string Build()
        {
            var buttonHtml = string.Empty;

            if (!string.IsNullOrEmpty(_buttonText) && !string.IsNullOrEmpty(_buttonLink))
            {
                buttonHtml = $@"
                <tr>
                  <td style='text-align: center; padding: 20px; background-color: #37392d;'>
                    <a href='{_buttonLink}' class=button-link style='text-decoration: none; padding: 15px 30px; color: #ffffff; background-color: #e6648c; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;"">
                      {_buttonText}
                    </a>
                  </td>
                 </tr>";
            }

            var footerHtml = !string.IsNullOrEmpty(_footer)
                ? $@"
                <tr>
                  <td style='padding: 20px; background-color: #20211a; border-radius: 8px 8px 8px 8px; text-align: center; color: #ffed90; font-size: 14px;'>
                    {_footer}
                    <p style='margin: 0;'>
                      <a href='https://github.com/Dawo9889/IO_PROJECT_2024'style='color: #ffe14d; text-decoration: none;'>Contact Us</a>
                    </p>
                  </td>
                </tr>"
                : string.Empty;

            return $@"
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>{_title}</title>
            </head>
            <body style='margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #20211a; color: #c4e6e9;'>
              <style>
                .navbar {{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 10px 20px;
                  background-color: #e6648c;
                  color: #ffffff;
                  height: 5vh;
                }}
                .menu-icon {{
                  display: none;
                  font-size: 24px;
                  cursor: pointer;
                }}

                @media (max-width: 768px) {{
                  .navbar-links {{
                    display: none;
                    flex-direction: column;
                    background-color: #e6648c;
                    position: absolute;
                    top: 10vh;
                    right: 0;
                    width: 100%;
                    padding: 10px;
                  }}
                  .navbar-links.active {{
                    display: flex;
                  }}
                  .menu-icon {{
                    display: block;
                  }}
                }}
              </style>
                <div class='navbar'>
                 </div>
                    <div style='padding: 0 10px;'>
                        <table width='100%' cellpadding='0' cellspacing='0' 
                               style='background-color: #37392d; padding: 20px; max-width: 600px; margin: 20px auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);'>  
                      <tr>
                        <td style='text-align: center; padding: 20px; background-color: #37392d; border-radius: 8px 8px 0 0;'>
                           <h1 style='margin: 0; color: #ffffff;'>{_title}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style='padding: 20px; text-align: center; color: #c4e6e9; background-color: #37392d;'>
                            <p style='margin: 0 0 20px; font-size: 16px;'>{_body}</p>
                        </td>
                    </tr>
                    {buttonHtml}
                    {footerHtml}
                </table>
            </body>
            </html>";
        }
    }
}

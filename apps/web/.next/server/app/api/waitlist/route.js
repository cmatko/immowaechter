"use strict";(()=>{var e={};e.id=282,e.ids=[282],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1568:e=>{e.exports=require("zlib")},6005:e=>{e.exports=require("node:crypto")},71:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>y,requestAsyncStorage:()=>f,routeModule:()=>x,serverHooks:()=>b,staticGenerationAsyncStorage:()=>h});var i={};r.r(i),r.d(i,{POST:()=>m});var n=r(3036),s=r(5736),o=r(5262),a=r(942),l=r(5682);let p=new(r(4515)).R(process.env.RESEND_API_KEY);async function d(e,t){let r=`http://localhost:3001/verify?token=${t}`;try{let{data:t,error:i}=await p.emails.send({from:"ImmoW\xe4chter <team@immowaechter.at>",to:e,subject:"✅ Best\xe4tigen Sie Ihre Anmeldung bei ImmoW\xe4chter",html:`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Best\xe4tigung</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #DC2626 0%, #B91C1C 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          🏠 ImmoW\xe4chter
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #111827; font-size: 24px; font-weight: 600;">
                          Willkommen bei ImmoW\xe4chter!
                        </h2>
                        
                        <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Vielen Dank f\xfcr Ihr Interesse! Bitte best\xe4tigen Sie Ihre Email-Adresse, um auf die Warteliste zu kommen.
                        </p>
                        
                        <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Sie sind nur einen Klick davon entfernt, nie wieder eine wichtige Wartung zu verpassen!
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${r}" 
                                 style="display: inline-block; padding: 16px 40px; background-color: #DC2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);">
                                Jetzt Email best\xe4tigen
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          Oder kopieren Sie diesen Link in Ihren Browser:
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px; word-break: break-all;">
                          ${r}
                        </p>
                        
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                        
                        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                          ⏰ Dieser Link ist <strong>24 Stunden</strong> g\xfcltig.
                        </p>
                        
                        <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                          Sie haben sich nicht bei ImmoW\xe4chter angemeldet? Ignorieren Sie diese Email einfach.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          ImmoW\xe4chter - Ihr digitaler Wartungsassistent
                        </p>
                        <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">
                          \xa9 2025 ImmoW\xe4chter. Alle Rechte vorbehalten.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,text:`
Willkommen bei ImmoW\xe4chter!

Bitte best\xe4tigen Sie Ihre Email-Adresse mit diesem Link:
${r}

Dieser Link ist 24 Stunden g\xfcltig.

Sie haben sich nicht angemeldet? Ignorieren Sie diese Email.

---
ImmoW\xe4chter - Ihr digitaler Wartungsassistent
      `.trim()});if(i)return console.error("Resend error:",i),{success:!1,error:i};return{success:!0,data:t}}catch(e){return console.error("Email send error:",e),{success:!1,error:e}}}let c=require("crypto");var u=r.n(c);let g=(0,l.eI)("https://cfggqkjogprlzikzxijc.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY);async function m(e){try{let{email:t}=await e.json();if(!t||!t.includes("@"))return a.NextResponse.json({error:"Bitte geben Sie eine g\xfcltige Email-Adresse ein."},{status:400});let{data:r}=await g.from("waitlist").select("email, verified").eq("email",t.toLowerCase()).single();if(r){if(r.verified)return a.NextResponse.json({error:"Diese Email-Adresse ist bereits verifiziert."},{status:409});{let e=u().randomBytes(32).toString("hex"),r=new Date(Date.now()+864e5);if(await g.from("waitlist").update({verification_token:e,token_expires_at:r.toISOString()}).eq("email",t.toLowerCase()),!(await d(t,e)).success)return a.NextResponse.json({error:"Email konnte nicht gesendet werden. Bitte versuchen Sie es sp\xe4ter erneut."},{status:500});return a.NextResponse.json({message:"Best\xe4tigungs-Email wurde erneut gesendet. Bitte pr\xfcfen Sie Ihr Postfach.",resent:!0})}}let i=u().randomBytes(32).toString("hex"),n=new Date(Date.now()+864e5),{error:s}=await g.from("waitlist").insert({email:t.toLowerCase(),verified:!1,verification_token:i,token_expires_at:n.toISOString(),created_at:new Date().toISOString()});if(s){if(console.error("Database error:",s),"23505"===s.code)return a.NextResponse.json({error:"Diese Email-Adresse wurde gerade eben registriert."},{status:409});return a.NextResponse.json({error:"Ein Fehler ist aufgetreten. Bitte versuchen Sie es sp\xe4ter erneut."},{status:500})}if(!(await d(t,i)).success)return await g.from("waitlist").delete().eq("email",t.toLowerCase()),a.NextResponse.json({error:"Email konnte nicht gesendet werden. Bitte versuchen Sie es erneut."},{status:500});return a.NextResponse.json({message:"Best\xe4tigungs-Email wurde gesendet! Bitte pr\xfcfen Sie Ihr Postfach.",success:!0})}catch(e){return console.error("Waitlist API error:",e),a.NextResponse.json({error:"Ein unerwarteter Fehler ist aufgetreten."},{status:500})}}let x=new n.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/waitlist/route",pathname:"/api/waitlist",filename:"route",bundlePath:"app/api/waitlist/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\immowaechter\\apps\\web\\app\\api\\waitlist\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:f,staticGenerationAsyncStorage:h,serverHooks:b}=x,w="/api/waitlist/route";function y(){return(0,o.patchFetch)({serverHooks:b,staticGenerationAsyncStorage:h})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),i=t.X(0,[193,682,746,526],()=>r(71));module.exports=i})();
"use strict";(()=>{var e={};e.id=581,e.ids=[581],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},2615:e=>{e.exports=require("http")},5240:e=>{e.exports=require("https")},8621:e=>{e.exports=require("punycode")},6162:e=>{e.exports=require("stream")},7360:e=>{e.exports=require("url")},1568:e=>{e.exports=require("zlib")},6005:e=>{e.exports=require("node:crypto")},9038:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>b,requestAsyncStorage:()=>u,routeModule:()=>g,serverHooks:()=>x,staticGenerationAsyncStorage:()=>f});var n={};r.r(n),r.d(n,{GET:()=>m});var o=r(3036),i=r(5736),a=r(5262),s=r(942),p=r(5682),d=r(4515);let l=(0,p.eI)("https://cfggqkjogprlzikzxijc.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY),c=new d.R(process.env.RESEND_API_KEY);async function m(e){try{if(e.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`)return s.NextResponse.json({error:"Unauthorized"},{status:401});console.log("\uD83D\uDD14 Starting maintenance notification check...");let t=new Date,r=new Date;r.setDate(t.getDate()+30);let{data:n,error:o}=await l.from("components").select(`
        id,
        property_id,
        interval_id,
        custom_name,
        brand,
        model,
        last_maintenance,
        next_maintenance,
        is_active,
        properties (
          id,
          name,
          address,
          city,
          postal_code,
          user_id
        ),
        maintenance_intervals (
          id,
          component,
          interval_months
        )
      `).eq("is_active",!0).lte("next_maintenance",r.toISOString().split("T")[0]).not("next_maintenance","is",null);if(o)return console.error("❌ Error fetching components:",o),s.NextResponse.json({error:"Database query failed",details:o},{status:500});if(console.log(`📊 Found ${n?.length||0} components to check`),!n||0===n.length)return s.NextResponse.json({success:!0,message:"No maintenance notifications needed",checked:0,sent:0,notifications:[]});let i=[],a=[],p=[];for(let e of n)try{let r=e.properties,n=e.maintenance_intervals;if(!r||!n){console.log(`⚠️ Skipping component ${e.id}: Missing property or interval data`);continue}let o=r[0],{data:s,error:d}=await l.from("profiles").select("id, email, full_name").eq("id",o.user_id).single();if(d||!s){console.log(`⚠️ Skipping component ${e.id}: User not found`);continue}let m=new Date(e.next_maintenance),g=Math.ceil((m.getTime()-t.getTime())/864e5),u=g<0;if(!(u&&Math.abs(g)%7==0||30===g||14===g||7===g||3===g||1===g||0===g)){console.log(`⏭️ Skipping notification for component ${e.id} (${g} days)`);continue}let f=e.custom_name||"Komponente",x=`${o.address||""}, ${o.postal_code||""} ${o.city||""}`.trim(),h={userName:s.full_name||"Immobilien-Eigent\xfcmer",propertyName:o.name||"Ihre Immobilie",propertyAddress:x,componentName:f,nextMaintenanceDate:e.next_maintenance,daysUntil:Math.abs(g),isOverdue:u},b=function(e){let{userName:t,propertyName:r,propertyAddress:n,componentName:o,nextMaintenanceDate:i,daysUntil:a,isOverdue:s}=e,p=s?"#dc2626":a<=7?"#f59e0b":"#667eea",d=s?`<strong style="color: #dc2626;">Ihre Wartung ist ${Math.abs(a)} Tage \xfcberf\xe4llig!</strong>`:`Ihre Wartung ist in <strong>${a} Tagen</strong> f\xe4llig.`;return`
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wartungserinnerung</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🏠 ImmoW\xe4chter
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                Ihr digitaler Wartungsassistent
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 0 30px;">
              <p style="margin: 0; font-size: 16px; color: #111827;">
                Hallo ${t},
              </p>
            </td>
          </tr>

          <!-- Urgency Banner -->
          <tr>
            <td style="padding: 20px 30px;">
              <div style="background-color: ${s?"#fef2f2":a<=7?"#fffbeb":"#eef2ff"}; border-left: 4px solid ${p}; padding: 15px; border-radius: 4px;">
                <p style="margin: 0; color: #111827; font-size: 16px;">
                  ${d}
                </p>
              </div>
            </td>
          </tr>

          <!-- Maintenance Details -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 15px 0; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      Wartungsdetails
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">
                          🏢 Immobilie:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">
                          ${r}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          📍 Adresse:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px;">
                          ${n}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          🔧 Komponente:
                        </td>
                        <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">
                          ${o}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                          📅 F\xe4lligkeitsdatum:
                        </td>
                        <td style="padding: 8px 0; color: ${p}; font-size: 14px; font-weight: 600;">
                          ${i}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Message -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <p style="margin: 0; padding: 15px; background-color: #eff6ff; border-radius: 6px; color: #1e40af; font-size: 14px; line-height: 1.6;">
                ${s?"⚠️ <strong>Wichtig:</strong> Bitte k\xfcmmern Sie sich zeitnah um diese Wartung, um die Sicherheit Ihrer Immobilie zu gew\xe4hrleisten und m\xf6gliche Haftungsrisiken zu vermeiden.":a<=7?"\uD83D\uDD14 <strong>Bald f\xe4llig:</strong> Vereinbaren Sie rechtzeitig einen Termin mit einem qualifizierten Fachbetrieb.":"\uD83D\uDCA1 <strong>Tipp:</strong> Vereinbaren Sie rechtzeitig einen Termin mit einem qualifizierten Fachbetrieb, um b\xf6se \xdcberraschungen zu vermeiden."}
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="https://www.immowaechter.at/dashboard" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Zum Dashboard
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Diese E-Mail wurde automatisch von ImmoW\xe4chter versendet.
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px;">
                Sie erhalten diese E-Mail, weil Sie sich bei ImmoW\xe4chter registriert haben.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="https://www.immowaechter.at" style="color: #667eea; text-decoration: none;">www.immowaechter.at</a> • 
                <a href="https://www.immowaechter.at/datenschutz" style="color: #667eea; text-decoration: none;">Datenschutz</a> • 
                <a href="https://www.immowaechter.at/impressum" style="color: #667eea; text-decoration: none;">Impressum</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `}(h),y=h.isOverdue?`⚠️ \xdcberf\xe4llige Wartung: ${h.componentName} in ${h.propertyName}`:`🔔 Wartungserinnerung: ${h.componentName} in ${h.propertyName}`,{data:w,error:k}=await c.emails.send({from:"ImmoW\xe4chter <noreply@immowaechter.at>",to:s.email,subject:y,html:b});if(k){console.error(`❌ Failed to send email to ${s.email}:`,k),p.push(`${s.email}: ${k.message}`);continue}console.log(`✅ Sent ${u?"overdue":"reminder"} email to ${s.email} for ${f}`),a.push(s.email),i.push({componentId:e.id,userId:s.id,userEmail:s.email,userName:h.userName,propertyId:o.id,propertyName:h.propertyName,propertyAddress:x,componentName:f,nextMaintenance:e.next_maintenance,daysUntil:Math.abs(g),isOverdue:u})}catch(t){console.error(`❌ Error processing component ${e.id}:`,t),p.push(`Component ${e.id}: ${t instanceof Error?t.message:"Unknown error"}`)}return s.NextResponse.json({success:!0,message:"Notification check completed",checked:n.length,sent:a.length,notifications:i,errors:p.length>0?p:void 0})}catch(e){return console.error("❌ Fatal error in notification check:",e),s.NextResponse.json({error:"Internal server error",message:e instanceof Error?e.message:"Unknown error"},{status:500})}}let g=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/notifications/check/route",pathname:"/api/notifications/check",filename:"route",bundlePath:"app/api/notifications/check/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\immowaechter\\apps\\web\\app\\api\\notifications\\check\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:u,staticGenerationAsyncStorage:f,serverHooks:x}=g,h="/api/notifications/check/route";function b(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:f})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[193,682,746,526],()=>r(9038));module.exports=n})();
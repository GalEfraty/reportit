const sgMail = require('@sendgrid/mail')

 
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendReportMail = (i_Report) =>
{
    let scenariosString = i_Report.reportScenarios.join(', ')
    let authorityTypesString = i_Report.reportAuthorityTypes.join(', ')

    sgMail.send({
        to: i_Report.reporterEmail,
        from: 'reports@report.it',
        subject: 'New report',
        text: `Hello ${i_Report.reporterName}, thank you for your report.\n
        report details: \n
        we recognized that you have reported: ${scenariosString}.\n
        in ${i_Report.reportMunicipalName}.\n
        sent to: ${authorityTypesString}.\n
        Thank you!, 
        reportit`
    })
}

module.exports =  {sendReportMail: sendReportMail}
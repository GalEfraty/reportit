const sgMail = require('@sendgrid/mail')

const mailKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(mailKey)

const sendReportMail = (i_Report) =>
{
    sgMail.send({
        to: i_Report.reporterEmail,
        from: 'reports@report.it',
        subject: 'New report',
        text: mailBody(i_Report)
    })
}

const mailBody = (i_Report) => {
    let scenariosString = i_Report.reportScenarios.join(', ')
    let authorityTypesString = i_Report.reportAuthorityTypes.join(', ')
    
    return `Hello ${i_Report.reporterName}, thank you for your report.\n
    report details: \n
    we recognized that you have reported: ${scenariosString}.\n
    in ${i_Report.reportMunicipalName}.\n
    sent to: ${authorityTypesString}.\n
    Thank you!, 
    reportit`;
}

module.exports =  {
    sendReportMail: sendReportMail,
    mailBody: mailBody
}
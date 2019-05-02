const sgMail = require('@sendgrid/mail')

 
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendReportMail = (i_Report) =>
{
    sgMail.send({
        to: i_Report.reporterEmail,
        from: 'reports@report.it',
        subject: 'New report',
        text: `Hello ${i_Report.reporterName}, thank you for your report.\n
        report details: \n
        we recognized that you have reported: `
    })
}

module.exports =  {sendReportMail: sendReportMail}
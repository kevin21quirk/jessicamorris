// Script to update ACAS task with email details
const emailData = {
  id: Date.now().toString(),
  from: 'Austeja Nenartaviciute <case@acas.org.uk>',
  to: 'Jessica Morris',
  subject: 'ACAS Early Conciliation - Kayomi Carter Case',
  body: `Good morning Jessica,

I have tried to contact you. Please see below the dispute details:

Claimants Position:
We received an Early Conciliation request from Kayomi Carter regarding unpaid wages, unpaid holiday pay, and wrongful dismissal.

Kayomi explained that she had been working for Morris Healthcare Group for approximately one year. Towards the end of her employment, she was offered the opportunity to undertake some work at a tattoo studio.

Kayomi stated that she has not received her final month's pay or her accrued holiday pay. She also advised that her employment contract included a salary increase which she did not receive.

Kayomi believes she was wrongfully dismissed and disputes the reasons given for her gross misconduct dismissal. She would like these reasons to be disregarded.

Claimants Outcome:
She believes she is owed a total of £2,000, comprising her final month's pay, £140 in holiday pay, and £1,600 for the contractual salary increase. She has advised that this is the amount she would be willing to accept in order not to progress the claim to an Employment Tribunal.

Options:
You have the option to engage in the process and try to reach a resolution before the Claimant escalates the matter to an employment tribunal. You may:

Accept - I will formalise this into a COT3 agreement subject to terms and make it legally binding. The Claimant will not be able to pursue the matter further.

Negotiate - You can go back with a counter proposal. It can be beneficial to also explain the basis and strengths of your defence to highlight the benefits of negotiation now.

Decline - I can issue the certificate and close the case. The Claimant will then be able to begin a tribunal claim.

If you are negotiating or declining, it would be helpful for me to understand your position, as this allows me to advise the Claimant. The Claimant can then take this into consideration when deciding whether to proceed with the tribunal process.

Please could you get back to me by Friday 20th February, otherwise I will need to close the case as no conciliation is taking place.

Kind regards,
Austeja Nenartaviciute`,
  direction: 'received',
  status: 'pending',
  date: new Date().toISOString(),
  createdAt: new Date().toISOString()
};

const taskUpdate = {
  description: `ACAS Early Conciliation - Kayomi Carter

Claimant Position:
- Former employee of Morris Healthcare Group (~1 year)
- Claims: Unpaid final month's pay, unpaid holiday pay (£140), contractual salary increase (£1,600)
- Disputes gross misconduct dismissal reasons
- Total demand: £2,000

Options:
1. Accept - COT3 agreement (legally binding, case closed)
2. Negotiate - Counter proposal
3. Decline - Issue certificate, claimant can proceed to tribunal

Contact: Austeja Nenartaviciute (case@acas.org.uk)
Deadline: Friday 20th February

Action Required: Respond by Friday 20th February`,
  timelineEntry: {
    id: (Date.now() + 1).toString(),
    type: 'update',
    message: 'Received ACAS email from Austeja Nenartaviciute regarding Kayomi Carter case',
    user: 'Admin',
    timestamp: new Date().toISOString()
  },
  kevinPhoneCall: {
    id: (Date.now() + 2).toString(),
    type: 'update',
    message: 'Kevin will phone ACAS this morning to discuss negotiation of costs',
    user: 'Admin',
    timestamp: new Date().toISOString()
  }
};

console.log('Email Data:', JSON.stringify(emailData, null, 2));
console.log('\nTask Update:', JSON.stringify(taskUpdate, null, 2));
console.log('\n\nTo apply these updates:');
console.log('1. Navigate to http://localhost:3001/emails');
console.log('2. Click "Add Email" and paste the email details');
console.log('3. Navigate to http://localhost:3001/tasks');
console.log('4. Click on "ACAS Contact" task');
console.log('5. Update the description and add timeline entries');

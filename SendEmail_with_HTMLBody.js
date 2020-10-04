    var email_subject = 'Bạn ' + e.values[1] + ' đăng ký không thành công';
    
    var sFullName = e.values[1];
    var sParish = e.values[6];
    var sAddress = e.values[7];
    var sGroup = e.values[8];
    sFullName = sFullName.replace(/ /g, "%20");
    sParish = sParish.replace(/ /g, "%20");
    sAddress = sAddress.replace(/ /g, "%20");
    sGroup = sGroup.replace(/ /g, "%20");
    
    var link_to_edit = 'https://docs.google.com/forms/d/e/fileID/viewform?usp=pp_url&entry.551681654=' + sFullName + '&entry.1145740948=' + e.values[2] + '&entry.1946284035=' + e.values[5] + '&entry.1146267669=' + sParish + '&entry.1536259180=' + sAddress + '&entry.333704433=' + sGroup + '&entry.2029134402=' + e.values[3] + '&entry.1952234810=' + e.values[4];
    
    var htmlBody = HtmlService.createTemplateFromFile('htmlBody_FalseRegister');
    // set the values for the placeholders
    htmlBody.link_to_edit = link_to_edit;
    htmlBody.FullName = e.values[1];

  
  var email_html = htmlBody.evaluate().getContent();
  Logger.log(email_html);

  sent_to = e.values[4];
  reply_to = 'saigon@gmail.com';
  email_cc = 'saigon@gmail.com';
    
  MailApp.sendEmail(
    { to: sent_to,
      replyTo: reply_to, 
      cc: email_cc, 
      subject: email_subject,
      htmlBody: email_html,
      name: "Carlo Acutis - MVGTSG"}
    ); 
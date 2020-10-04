function UpdateIssueToJira(e) {

  // Look for last issue of IT Support or create new 
  var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "authorization": "Basic AuthenticationStringGeneratedFromJiraCredential="
      };

  var options_get =
      {
        "content-type": "application/json",
        "method": "GET",
        "headers": headers,
      };
  var sURL_of_list_issue = 'https://yourdomain.atlassian.net/rest/api/2/search?jql=project=10807' //List issue of project 10807 which is project DevOps
  var response = UrlFetchApp.fetch(sURL_of_list_issue, options_get);
  var dataAll = JSON.parse(response.getContentText());
//  Logger.log(dataAll.issues[0].fields.summary);

  var sIssueKey = '';
  var sSummary = '';  //sSummary = issue title = "[Support] IT Support for W38"
  var iCurrentWeekNumber = getCurrentWeekNumber();
  var iCurrentYear = (new Date()).getFullYear();
  var description = '';
  // search for last issue

  for (issue of dataAll.issues)
  {
    sSummary = issue.fields.summary;
    if (sSummary.includes('[Support] IT Support for ') && Number(issue.fields.created.split('-')[0])>= iCurrentYear)
    {
      if (Number(sSummary.split('W')[1]) >= iCurrentWeekNumber)
      {
        sIssueKey = issue.key;
        description = issue.fields.description + '\n' + '- ' + e.values[3];
        break;
      }
    }
  }
  
  Logger.log(sIssueKey);
  
  if (sIssueKey == '')
  {
    var sIssueTitle = '[Support] IT Support for W' + iCurrentWeekNumber.toString();
    sIssueKey = create_new_jira_issue(sIssueTitle, description);
  }
  else
    update_issue_description(sIssueKey, description); 
  
  Logger.log(sIssueKey);

}  
  
function create_new_jira_issue(sIssueTitle, sNewDescription)
{
  var sURL_of_issue = 'https://yourdomain.atlassian.net/rest/api/2/issue/';  
  var issueData = 
      {
        "fields": {
          "project":{ 
            "id": "10807",
            "key": "OPS"
          },
          "summary": sIssueTitle,
          "description": sNewDescription,
          "issuetype":{
            "id": "10113",
            "name": "DevOps"
          },
          "assignee": {
            "accountId": "5da4379acbdd1a0c3fee551f",
          }
        }
      };
  
  var payload = JSON.stringify(issueData);  
  var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "authorization": "Basic AuthenticationStringGeneratedFromJiraCredential="
      };  
  var options_post=
      { 
        "content-type": "application/json",
        "method": "POST",
        "headers": headers,
        "payload": payload
      };

  var response = UrlFetchApp.fetch(sURL_of_issue, options_post);
  var dataAll = JSON.parse(response.getContentText());
  var sIssueKey = dataAll.key;
  
  MailApp.sendEmail(
    { to: "youremail@domain.com" ,
     subject: "Weekly IT Task created: " + sIssueKey,
      body: "https://yourdomain.atlassian.net/browse/"+ sIssueKey,
      name: "Jira Task Creator"}
    );
  
  return sIssueKey;
}
  
function update_issue_description(sIssueKey, sNewDescription)
{
  var sURL_of_issue = 'https://yourdomain.atlassian.net/rest/api/2/issue/' + sIssueKey;  
  var issueData = 
      {
        "fields": {
          "description": sNewDescription
          }
      };
  
  var payload = JSON.stringify(issueData);  
  var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "authorization": "Basic AuthenticationStringGeneratedFromJiraCredential="
      };  
  var options_put =
      { 
        "content-type": "application/json",
        "method": "PUT",
        "headers": headers,
        "payload": payload
      };

  UrlFetchApp.fetch(sURL_of_issue, options_put);
  
  MailApp.sendEmail(
    { to: "youremail@domain.com" ,
     subject: "Weekly IT Task updated: " + sIssueKey,
      body: "https://yourdomain.atlassian.net/browse/"+ sIssueKey,
      name: "Jira Task Updater"}
    );
  
}

function getCurrentWeekNumber() 
{
  d= new Date(); 
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNumber = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  return weekNumber;
}


function GetAccountID(emailSubmitter) {
    //parse List of Jira Jira User
  var submitter = emailSubmitter;
  var sAccountID = '';
  var sUserName = submitter.split('@')[0];
  
  var headers = 
  { 
    "content-type": "application/json",
    "Accept": "application/json",
    "authorization": "Basic AuthenticationStringGeneratedFromJiraCredential="
  };
  var options2=
  { 
    "content-type": "application/json",
    "method": "GET",
    "headers": headers
  };
  
  var domains = ['domain1.com', 'domain2.com', 'doman3.com'];
  for (domain of domains) 
  {
    var JiraUserURL = 'https://yourdomain.atlassian.net/rest/api/2/user/search?startAt=0&maxResults=1000&query=' + sUserName + '@' + domain;
    var response2 = UrlFetchApp.fetch(JiraUserURL, options2);
    var data = JSON.parse(response2.getContentText());
    if (data.length == 1)
    {
          sAccountID = data[0].accountId;
          break;
    }
    else {
      sAccountID = "Default Account ID"; // accoundId of Jira Reporter
    }
  }
  Logger.log(sAccountID);    
  return sAccountID;  
}
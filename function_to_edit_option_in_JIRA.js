//This function will not work as Jira do not allow to change Reporter.
//Apply this function to edit other option

function ChangeReporter(reporter_email)
{
  var reporterAccountID = GetReporterAccountID("youremail@domain.com")
  var editIssueUrl = "https://yourdomain.atlassian.net/rest/api/2/issue/" + "DATA-27";
  var reporter_data = {
    "fields": {
        "reporter": {
            "accountId": reporterAccountID
        }
    }
  };
    var headers = 
      { 
        "content-type": "application/json",
        "Accept": "application/json",
        "authorization": "Basic AuthenticationStringGeneratedFromJiraCredential=="
      };
  
  var reporter_payload = JSON.stringify(reporter_data);
  var reporter_option =
      { 
        "method": "PUT",
        "headers": headers,
        "payload": reporter_payload
      };
  Logger.log(reporter_option);
  var reporter_response = UrlFetchApp.fetch(editIssueUrl, reporter_option);
  Logger.log(reporter_response.getContentText());

}
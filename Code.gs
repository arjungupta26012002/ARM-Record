function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('ARM Recording Generator')
      .setFaviconUrl('https://raw.githubusercontent.com/arjungupta26012002/ExcelerateResources/refs/heads/main/favicon.ico');
}

function generateMessage(formData) {
  var template = HtmlService.createTemplateFromFile('MessageTemplate');

  template.week = formData.week;
  template.internshipName = formData.internshipName;
  template.name = formData.name;

  var recordingsData = [];

  formData.recordings.forEach(function(recording) {
    var selectedDate = new Date(recording.recordingDate);

    var formattedDayName = Utilities.formatDate(selectedDate, "Asia/Kolkata", "EEEE");
    var formattedDatePart = Utilities.formatDate(selectedDate, "Asia/Kolkata", "d'S' MMMM").replace(/(\d)(S)/, function(match, p1) {
          var n = parseInt(p1);
          if (n > 3 && n < 21) return p1 + 'th';
          switch (n % 10) {
            case 1: return p1 + 'st';
            case 2: return p1 + 'nd';
            case 3: return p1 + 'rd';
            default: return p1 + 'th';
          }
    });

    var fullDateTimeString = `${formattedDayName}, ${formattedDatePart}`; 

    var rawLink = recording.recordingLink;
    var curedLink = rawLink.trim().replace(/\s/g, '');

    if (!curedLink.startsWith('http://') && !curedLink.startsWith('https://')) {
      curedLink = 'https://' + curedLink;
    }

    var fileName = `${formData.internshipName} - Week ${formData.week} Session ${recording.sessionNumber} Recording`;

    recordingsData.push({
      sessionNumber: recording.sessionNumber,
      recordingDateTime: fullDateTimeString,

      recordingLink: curedLink,
      fileName: fileName
    });
  });

  template.recordingsData = recordingsData;

  return template.evaluate().getContent();
}

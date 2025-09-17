module.exports = {
  // cucumber.js
  example: [
    'feature/example.feature',
    '--require',
    'feature/step-definition'
  ],

  login:[
    'feature/bookmyshow/User Login.feature',
    '--require',
    'feature/step-definition'
  ],

  search:[
    'feature/bookmyshow/Search Functionality.feature',
    '--require',
    'feature/step-definition'
  ],

  amazon:[
    'feature/amazon/search.feature',
    '--require',
    'feature/step-definition/amazon'
  ],

  experian:[
    'feature/experian/loancalculate.feature',
    '--require',
    'feature/step-definition/experian'
  ],

  experian2:[
    'feature/experian-loan-calculate/Personal Loan Calculator Functionality.feature',
    '--require',
    'feature/step-definition/experian-loan-calculate'
  ]
};

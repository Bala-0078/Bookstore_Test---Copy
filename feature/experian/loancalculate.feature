Feature: Personal Loan Calculator Functionality

  As a prospective borrower,
  I want to use the personal loan calculator,
  So that I can estimate my monthly payments and understand my loan options.

  Scenario: Accept valid loan amount input
    Given the user is on the Personal Loan Calculator page
    When the user enters a valid loan amount
    Then the loan amount should be accepted without error

  Scenario: Accept valid interest rate input
    Given the user is on the Personal Loan Calculator page
    When the user enters a valid interest rate
    Then the interest rate should be accepted without error

  Scenario: Accept valid loan term input
    Given the user is on the Personal Loan Calculator page
    When the user enters a valid loan term
    Then the loan term should be accepted without error
  
  Scenario: Calculate monthly payment with valid inputs
    Given the user is on the Personal Loan Calculator page
    When the user enters a valid loan amount, interest rate, and loan term
    And clicks the 'Calculate' button
    Then the monthly payment should be calculated and displayed correctly
  
  @invalidamount
  Scenario: Show error for invalid loan amount input
    Given the user is on the Personal Loan Calculator page
    When the user enters an invalid loan amount
    Then an error message should be displayed for the invalid loan amount

  @invalidintrest
  Scenario: Show error for invalid interest rate input
    Given the user is on the Personal Loan Calculator page
    When the user enters an invalid interest rate
    Then an error message should be displayed for the invalid interest rate

  @invalidterm
  Scenario: Show error for invalid loan term input
    Given the user is on the Personal Loan Calculator page
    When the user enters an invalid loan term
    Then an error message should be displayed for the invalid loan term

  Scenario: Calculate with minimum allowed values
    Given the user is on the Personal Loan Calculator page
    When the user enters the minimum allowed values in all fields
    And clicks the 'Calculate' button
    Then the calculator should display the correct result

  @maxinput
  Scenario: Calculate with maximum allowed values
    Given the user is on the Personal Loan Calculator page
    When the user enters the maximum allowed values in all fields
    And clicks the 'Calculate' button
    Then the calculator should display the correct result

  Scenario: Display result in readable format
    Given the user is on the Personal Loan Calculator page
    When the user enters valid values in all fields
    And clicks the 'Calculate' button
    Then the result should be displayed with proper currency and decimal formatting
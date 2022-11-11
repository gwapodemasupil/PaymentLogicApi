/// <reference types="cypress" />

class commonFunctions {
    setAmexAddCardDetails(cardType) {
        var request = {
            cardNumber : this.generateRandomCardNumber(cardType),
            cardHolder : 'AmexApiAutomation_' + this.generateRandomString(7),
            cardHolderEmail : 'AmexApiAutomation_' + this.generateRandomString(10) + '@paymentlogic.com.au',
            countryCode : this.generateRandomCountryCode(),
            expiryMonth : this.generateRandomExpiryMonth(),
            expiryYear : this.generateExpiryYear(),
        }
        return request
    }

    generateRandomCardNumber(cardType) {
        var cardnumber = '';

        if (cardType == 'mastercard')
        {
            var cardnumberList = ['5555555555554444', '5105105105105100', '5371521800329620']
            cardnumberList[(Math.random() * cardnumberList.length) | 0]
        }
        else if (cardType == 'visa')
        {
            var cardnumberList = ['4111111111111111', '4012888888881881', '4916369189504016']
            cardnumber = cardnumberList[(Math.random() * cardnumberList.length) | 0]
        }
        else
        {
            var cardnumberList = ['371111111111114', '371111111111130', '371111111111148']
            cardnumber = cardnumberList[(Math.random() * cardnumberList.length) | 0]
        }
        return cardnumber;
    }
    
    setMaskedCardNumber(cardNumber) {
        var cNumber = cardNumber.toString()
        var lastDigits = '**** ****** **' + cNumber.substring(cNumber.length - 3)
        return lastDigits
    }

    generateRandomCountryCode() {
        var countryCode = ''
        var countryCodeList = ['AU']
        return countryCode = countryCodeList[(Math.random() * countryCodeList.length) | 0]
    }

    generateRandomExpiryMonth() {
        var expiryMonth = Math.floor(Math.random() * 12) + 1
        if (expiryMonth < 10) {
            return '0' + expiryMonth
        }
        else
        {
            return expiryMonth
        }
    }

    generateExpiryYear() {
        var expiryYear = new Date().getFullYear() + (Math.floor(Math.random() * 3) + 1)
        var stringYear = expiryYear.toString()
        var last2 = stringYear.substring(stringYear.length - 2)
        return last2
    }

    generateRandomTokenStatus() {
        var tokenStatus = ''
        var tokenStatusList = ['suspend', 'resume', 'delete']
        return tokenStatus = tokenStatusList[(Math.random() * tokenStatusList.length) | 0]
    }

    generateRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }

    generateRandomNumbers(length) {
        var result = '';
        var numbers = '0123456789';
        var numbersLength = numbers.length;
        for ( var i = 0; i < length; i++ ) {
          result += numbers.charAt(Math.floor(Math.random() * numbersLength));
       }
       return result;
    }

    generateCardInputCapability() {
        var cardInput = ''
        var cardinputList = ['0', '1', '2', '3', '4', '5', '6']
        return cardInput = cardinputList[(Math.random() * cardinputList.length) | 0]
    }

    generateCardCaptureCapability() {
        var cardCapture = ''
        var cardCaptureList = ['0', '1']
        return cardCapture = cardCaptureList[(Math.random() * cardCaptureList.length) | 0]
    }

    generateOperatingEnvironment() {
        var operatingEnvironment = ''
        var operatingEnvironmentList = ['0', '1', '2', '3', '4', '5', '9', 'S', 'T', 'Z']
        return operatingEnvironment = operatingEnvironmentList[(Math.random() * operatingEnvironmentList.length) | 0]
    }

    generateCardholderPresent() {
        var cardHolder = ''
        var cardHolderList = ['0', '1', '2', '3', '4', '9', 'S']
        return cardHolder = cardHolderList[(Math.random() * cardHolderList.length) | 0]
    }

    generateCardPresent() {
        var cardPresent = ''
        var cardPresentList = ['0', '1', 'W', 'X', 'Z']
        return cardPresent = cardPresentList[(Math.random() * cardPresentList.length) | 0]
    }

    generateCardDataInputMode() {
        var cardData = ''
        var cardDataList = ['0', '1', '2', '3', '4', '5', '6', '9', 'S', 'W']
        return cardData = cardDataList[(Math.random() * cardDataList.length) | 0]
    }

    generateCardmemberAuthMethod() {
        var cardMemberAuth = ''
        var cardMemberAuthList = ['0', '1', '2', '3', '4', '5', '6', 'S']
        return cardMemberAuth = cardMemberAuthList[(Math.random() * cardMemberAuthList.length) | 0]
    }

    generateCardmemberAuthEntity() {
        var cardMemberAuth = ''
        var cardMemberAuthList = ['0', '1', '2', '3', '4', '5']
        return cardMemberAuth = cardMemberAuthList[(Math.random() * cardMemberAuthList.length) | 0]
    }

    generateCardDataOutputCapability() {
        var cardMemberAuth = ''
        var cardMemberAuthList = ['0', '1', '2', '3']
        return cardMemberAuth = cardMemberAuthList[(Math.random() * cardMemberAuthList.length) | 0]
    }

    generateTerminalOutputCapability() {
        var terminalOutput = ''
        var terminalOutputList = ['0', '1', '2', '3', '4']
        return terminalOutput = terminalOutputList[(Math.random() * terminalOutputList.length) | 0]
    }

    generatePinCaptureCapability() {
        var terminalOutput = ''
        var terminalOutputList = ['0', '1', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C']
        return terminalOutput = terminalOutputList[(Math.random() * terminalOutputList.length) | 0]
    }
}

export default commonFunctions
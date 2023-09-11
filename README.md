# Digital Bank RESTful API

This is a digital bank RESTful API project I made for Cubos Academy challenge. I used Node.JS, Express, Nodemon, and date-fns to build this project. The API is able to create an account, list existing accounts, delete an account, update the user info, make financial operations such as withdrawals, deposits, transfers, show account balance, and last but not least show the bank statement with all user registrations.

## Table of Contents

1. [Installation](#installation)
2. [Start Server](#start-server)
3. [Functionalities](#functionalities)
   - [Create New Bank Account](#create-new-bank-account)
   - [List Existing Bank Accounts](#list-existing-bank-accounts)
   - [Update User](#update-user)
   - [Deposit](#deposit)
   - [Withdraw](#withdraw)
   - [Transfer](#transfer)
   - [Balance](#balance)
   - [Bank Statement](#bank-statement)
4. [Contributions](#contributions)
5. [Author](#author)

## Installation

First of all, you will need to clone this project and run the following commands:

```bash
git clone https://github.com/eduvinagre/RESTful-API-Digital-Bank.git
npm install
npm install express
npm install nodemon
npm install date-fns--save
```

## Start Server

To start the server, run the following command:

```bash
npm run dev
```

## Functionalities

You can use tools like Insomnia to interact with this API. Please note that every time you reset the server, it will lose all inputs. Look for the proper routes inside the route.js file to use it.

## Create New Bank Account

Using POST, the new bank account functionality code creates the account number by itself by randomizing it.

![New account](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/b4d555c4-03db-4c30-bfc5-3d92cf0c3a1a)


## List Existing Bank Accounts

Using GET, you can retrieve the existing accounts list.

![List bank accounts](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/72e18160-27f6-4f52-9b54-2474fbf1ff07)


## Update User

Using PUT with validations and verifications to prevent updates of Social Security Numbers or email addresses that have been previously used by another account.

![Update User Info](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/e1b4adb5-f467-4839-ae64-fa9eb3ba46e6)


## Deposit

Using POST and a JSON file to indicate the account and the amount of the deposit with validations.

![Deposit](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/666ca8f3-a91d-4a5b-a646-b38c493c65d8)


## Withdraw

Also using POST to make withdrawal operations and update account balance, among other validations using middleware and controller.

![withdraw](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/0ff07205-728a-44be-b749-2af01ab8e94d)


## Transfer

Using POST, one can transfer money inside the bank database. Also using controllers and middlewares.

![Transfer](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/85e14dfc-8969-4be4-a5d9-12812b2f5686)


## Balance

Using GET, one can check all their account operations.

![Balance](https://github.com/eduvinagre/RESTful-API-Digital-Bank/assets/122939534/f07fd1e6-d989-4009-a86c-bbbd8885c0b9)


## Contributions

Contributions are welcome, and you can contribute to this project by making a pull request.

## Author

Eduardo Vinagre

- LinkdIn - Eduardo Vinagre(https://www.linkedin.com/in/eduvinagre/)
- Email - [eduvinagre@gmail.com](mailto:eduvinagre@gmail.com)

"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
//     owner: "Jonas Schmedtmann",
//     movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//     interestRate: 1.2, // %
//     pin: 1111,
// };

// const account2 = {
//     owner: "Jessica Davis",
//     movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//     interestRate: 1.5,
//     pin: 2222,
// };

// const account3 = {
//     owner: "Steven Thomas Williams",
//     movements: [200, -200, 340, -300, -20, 50, 400, -460],
//     interestRate: 0.7,
//     pin: 3333,
// };

// const account4 = {
//     owner: "Sarah Smith",
//     movements: [430, 1000, 700, 50, 90],
//     interestRate: 1,
//     pin: 4444,
// };

// const accounts = [account1, account2, account3, account4];

const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-05-27T17:01:17.194Z",
        "2020-07-11T23:36:17.929Z",
        "2020-07-12T10:51:36.790Z",
        "2023-06-29T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//date and time
const formatMovementDate = function (date, locale) {
    const calcDayPassed = (date1, date2) =>
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDayPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) {
        return "Today";
    }
    if (daysPassed === 1) {
        return "Yesterday";
    }
    if (daysPassed <= 7) {
        return `${daysPassed} days ago`;
    } else {
        // const day = `${date.getDate()}`.padStart(2, 0);
        // const month = `${date.getMonth() + 1}`.padStart(2, 0);
        // const year = date.getFullYear();
        // const hour = date.getHours();
        // const minute = date.getMinutes();
        // return `${day}/${month}/${year}`;
        return new Intl.DateTimeFormat(locale).format(date);
    }
};

//formatting currencies
const formatCurrency = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
};

//display transaction movements
const displayMovements = function (account, sort = false) {
    containerMovements.innerHTML = "";

    const moves = sort
        ? account.movements.slice().sort((a, b) => a - b)
        : account.movements;

    moves.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";

        const date = new Date(account.movementsDates[i]);
        const displayDate = formatMovementDate(date, account.locale);

        // const formattedMov = new Intl.NumberFormat(account.locale, {
        //     style: "currency",
        //     currency: account.currency,
        // }).format(mov);

        const formattedMov = formatCurrency(
            mov,
            account.locale,
            account.currency
        );

        const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>`;

        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

//display balance amount
const calcDisplayBalance = function (account) {
    const balance = account.movements.reduce(
        (acc, movement) => acc + movement,
        0
    );
    account.balance = balance;
    const formattedBalance = formatCurrency(
        account.balance,
        account.locale,
        account.currency
    );
    labelBalance.textContent = `${formattedBalance}`;
};

//display summary calculation
const calcDisplaySummary = function (account) {
    const incomes = account.movements
        .filter((mov) => mov > 0)
        .reduce((acc, curr) => acc + curr, 0);
    const formattedIncome = formatCurrency(
        incomes,
        account.locale,
        account.currency
    );
    labelSumIn.textContent = `${formattedIncome}`;

    const out = account.movements
        .filter((mov) => mov < 0)
        .reduce((acc, curr) => acc + curr, 0);
    const formattedOutcome = formatCurrency(
        Math.abs(out),
        account.locale,
        account.currency
    );
    labelSumOut.textContent = `${formattedOutcome}`;

    const interest = account.movements
        .filter((mov) => mov > 0)
        .map((deposit) => (deposit * account.interestRate) / 100)
        .filter((int, i, arr) => {
            return int >= 1;
        })
        .reduce((acc, int) => acc + int, 0);
    const formattedInterest = formatCurrency(
        interest,
        account.locale,
        account.currency
    );
    labelSumInterest.textContent = `${formattedInterest}`;
};

//creating username
const createUsername = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(" ")
            .map(function (name) {
                return name[0];
            })
            .join("");
    });
};

createUsername(accounts);
// console.log(accounts);

//update UI
const updateUI = function (account) {
    displayMovements(account);

    calcDisplayBalance(account);

    calcDisplaySummary(account);
};

//event handler
let currentAccount, timer;

//fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//start logout timer
const startLogoutTimer = function () {
    // set time to 5 minutes
    let time = 30;

    const tick = function () {
        const min = String(Math.trunc(time / 60)).padStart(2, 0);
        const sec = time % 60;
        //in each cell print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        //when 0 second logout user
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = "Login to get started";
            containerApp.style.opacity = 0;
        }

        //decrease 1s
        time--;
    };

    //call the timer every second
    tick();
    const timer = setInterval(tick, 1000);

    return timer;
};

btnLogin.addEventListener("click", function (e) {
    //prevent form from submitting
    e.preventDefault();
    //checking login information
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );

    console.log(currentAccount);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // console.log("LOGIN");
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        containerApp.style.opacity = 100;
        // const now = new Date();
        // const day = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear();
        // const hour = `${now.getHours()}`.padStart(2, 0);
        // const minute = `${now.getMinutes()}`.padStart(2, 0);
        // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            // day: "numeric",
            day: "2-digit",
            // month: "numeric",
            month: "2-digit",
            // month: "long",
            year: "numeric",
            // weekday: "narrow",
            // weekday: "short",
            weekday: "long",
        };
        // const locale = navigator.language;
        // console.log(locale);
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);

        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();

        //timer
        if (timer) {
            clearInterval(timer);
        }
        timer = startLogoutTimer();

        updateUI(currentAccount);
    }
});

//transfer amount function
btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        (acc) => acc.username === inputTransferTo.value
    );

    inputTransferAmount.value = inputTransferTo.value = "";

    //validating transfer
    if (
        amount > 0 &&
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // console.log("Transfer Valid");
        currentAccount.movements.push(-amount);
        receiverAcc.movements.push(amount);

        //add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movementsDates.push(new Date().toISOString());

        //update UI
        updateUI(currentAccount);

        //reset timer
        clearInterval(timer);
        timer = startLogoutTimer();
    }
});

//loan amount
btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Math.floor(inputLoanAmount.value);
    if (
        amount > 0 &&
        currentAccount.movements.some((mov) => mov > amount * 0.1)
    ) {
        setTimeout(function () {
            //add the movements
            currentAccount.movements.push(amount);

            //add transfer date
            currentAccount.movementsDates.push(new Date().toISOString());

            //update ui
            updateUI(currentAccount);
        }, 2500);
    }
    inputLoanAmount.value = "";

    //reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
});

//btn close amount
btnClose.addEventListener("click", function (e) {
    e.preventDefault();

    if (
        inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        //index of current account
        const index = accounts.findIndex(
            (acc) => acc.username === currentAccount.username
        );
        // console.log(index);
        //delete account
        accounts.slice(index, 1);

        //hide UI
        containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = "";
});

//sort button
let sorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

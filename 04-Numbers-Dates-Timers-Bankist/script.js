"use strict";
//  Windows 10 + Dot   =>  To add Emoji
// Alt + the word

"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
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
        "2022-09-29T10:51:36.790Z",
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
        "2022-10-06T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: "Steven Thomas Williams",
    movements: [7000, 200, -200, 340, -3000, -2000, -500, 10000, -4600],
    interestRate: 0.7,
    pin: 3333,

    movementsDates: [
        "2019-09-01T13:15:33.035Z",
        "2019-10-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-03-25T14:18:46.235Z",
        "2020-05-05T16:33:06.386Z",
        "2020-06-10T14:43:26.374Z",
        "2020-08-25T18:49:59.371Z",
        "2020-08-26T12:01:20.894Z",
        "2020-12-26T12:01:20.894Z",
    ],

    currency: "SYP",
    locale: "ar-SY",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
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
// Functions and DOM Manipulation
// LECTURES

const currencies = new Map([
    ["USD", "United States dollar"],
    ["EUR", "Euro"],
    ["GBP", "Pound sterling"],
]);

// Use Math.abs() => to ignore the order of recent and old dates.

const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24);
// Or you could do:
// const milliSecondInOneDay = (1000 * 60 * 60 * 24);
// Math.floor(Math.abs(date1 - date2) / milliSecondInOneDay);

const formatDate = function (locale, date1, date2) {
    const daysPassed = calcDaysPassed(date1, date2);
    switch (daysPassed) {
        case 0:
            return "Today";
        case 1:
            return "Yesterday";
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return `${daysPassed} days ago`;

        default:
            // Dynamic format
            return Intl.DateTimeFormat(locale).format(date2);

        // Static Format
        // [
        //     date2.getFullYear(),
        //     String(date2.getMonth() + 1).padStart(2, 0),
        //     String(date2.getDate()).padStart(2, 0),
        // ].join(" / ");
    }
};

const formatCur = function (locale, currency) {
    const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        // useGrouping : false
    });
    return number => formatter.format(number);
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const displayMovements = function (acc, sort = false) {
    containerMovements.innerHTML = "";

    const movs = sort
        ? [...acc.movements].sort((a, b) => a - b)
        : acc.movements;

    const getDate = formatDate.bind(null, currentAccount.locale, Date.now());
    const currencyFormatter = formatCur(acc.locale, acc.currency);

    movs.forEach((mov, i) => {
        const type = mov > 0 ? "deposit" : "withdrawal";
        const date = getDate(new Date(acc.movementsDates[i]));
        const value = currencyFormatter(mov);

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">
                ${i + 1} ${type}
            </div>
            <div class="movements__date">${date}</div>
            <div class="movements__value">${value}</div>
        </div>
        `;
        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

const calcDisplayBalance = function (acc) {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    // const textNodeBalance = document.createTextNode(balance);
    // labelBalance.appendChild(textNodeBalance);
    labelBalance.textContent = `${formatCur(
        acc.locale,
        acc.currency
    )(acc.balance)}`;
};

// Calculate statistics
const calcDisplaySummary = function (acc) {
    // Deposits
    const incomes = acc.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    const formatter = formatCur(acc.locale, acc.currency);
    labelSumIn.textContent = `${formatter(incomes)}`;

    // Withdrawals
    const out = acc.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);
    labelSumOut.textContent = `${formatter(out * -1)}`;

    // our bank pays out an interest for each deposit
    // in the rate of 1.2 percent.
    const interest = acc.movements
        .filter(mov => mov > 0)
        .map(mov => mov * (acc.interestRate / 100))
        .reduce((acc, mov) => acc + mov, 0);

    labelSumInterest.textContent = `${formatter(interest)}`;
};

/////////////////////////////////////////////////

const createUsernames = function (accs) {
    accs.forEach(acc => {
        acc.username = acc.owner
            .split(" ")
            .map(name => name[0].toLowerCase()) // RETURN
            .join("");
    });
};
createUsernames(accounts);

const updateUI = function (acc) {
    calcDisplayBalance(acc);
    displayMovements(acc);
    calcDisplaySummary(acc);
};

const checkCredentials = (username, pin) =>
    accounts.find(acc => acc.username === username && acc.pin + "" === pin);

/////////////////////////////////////////////////
// Event handler
let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
    // Prevent form from submitting
    e.preventDefault();

    const username = inputLoginUsername.value;
    const pin = inputLoginPin.value;
    currentAccount = checkCredentials(username, pin);

    // if NOT falsy value [undefined, null, false, 0, '', NaN].
    if (currentAccount) {
        // Clear input Fields
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();

        // Save user state
        currentAccount.loggedOn = true;

        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(" ")[0]
        }`;
        containerApp.style.opacity = 1;

        // Create current date and time
        // internationalization API
        const now = new Date();
        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric", //  "2-digit"
            weekday: "short", // "long" | "narrow"
        };
        // many situations it actually makes more sense to not define the locale
        // manually but instead to simply get it from the user's browser
        // "navigator.language", using navigator object and its "language" property.
        // const locale = navigator.locale;

        // NEW
        const currentDate = Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);
        // OLD - Experimenting -
        const formattedDate = [
            [
                String(now.getDate()).padStart(2, 0),
                String(now.getMonth() + 1).padStart(2, 0),
                now.getFullYear(),
            ].join("/"),
            [
                String(now.getHours()).padStart(2, 0),
                String(now.getMinutes()).padStart(2, 0),
            ].join(":"),
        ].join(", ");
        labelDate.textContent = currentDate;

        // Display account info [balance, movements, summary]
        updateUI(currentAccount);

        timer && clearInterval(timer);
        timer = startLogOutTimer();
    }
});

btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    const username = inputCloseUsername.value;
    const pin = inputClosePin.value;
    inputCloseUsername.value = inputClosePin.value = "";

    if (
        currentAccount?.username === username &&
        currentAccount.pin + "" === pin &&
        currentAccount.loggedOn
    ) {
        const index = accounts.findIndex(
            acc => acc["username"] === username && acc["pin"] + "" === pin
        );
        // Delete Account
        accounts.splice(index, 1);
        currentAccount = null;

        // Hide UI
        labelWelcome.textContent = "Log in to get started";
        containerApp.style.opacity = 0;

        timer && clearInterval(timer);
    }
});

/*
our bank only grants a loan if there is at least one deposit with 
at least 10 percent of the requested loan amount.
*/
btnLoan.addEventListener("click", function (e) {
    e.preventDefault();
    // Math.floor() actually does Type-Coercion itself
    const amount = Math.floor(inputLoanAmount.value);
    if (
        amount > 0 && // Any deposit > 10% of request?
        currentAccount?.movements.some(mov => mov >= amount * 0.1)
    ) {
        // A timer to simulate the approval of the loan
        const pChild = document.createElement("p");
        const textNode = document.createTextNode(
            "Waiting for bank approval..."
        );
        pChild.append(textNode);
        pChild.classList.add("approval__msg");
        document.querySelector(".form--loan").append(pChild);
        setTimeout(
            msg => {
                currentAccount.movements.push(amount);
                currentAccount.movementsDates.push(new Date().toISOString());
                updateUI(currentAccount);
                msg.remove();
            },
            3000,
            pChild
        );
        // Reset the timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }
    inputLoanAmount.value = "";
});

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Math.floor(inputTransferAmount.value);
    const receiverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );

    if (
        amount > 0 &&
        currentAccount.balance >= amount &&
        receiverAcc &&
        receiverAcc?.username !== currentAccount.username
    ) {
        // Clear input field
        inputTransferAmount.value = inputTransferTo.value = "";

        // Doing the transfer
        currentAccount.movements.push(-amount);
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAcc.movements.push(amount);
        receiverAcc.movementsDates.push(new Date().toISOString());
        updateUI(currentAccount);

        // Reset the timer
        clearInterval(timer);
        timer = startLogOutTimer();
    }
});
let sortToggle = false;

btnSort.addEventListener("click", function () {
    // return < 0 (Keep order)
    // return > 0 (Switch order)
    sortToggle = !sortToggle;
    if (sortToggle) displayMovements(currentAccount, true);
    else displayMovements(currentAccount);
});

// Now for security reasons real bank applications
// will log out users after some inactive time.
const startLogOutTimer = function () {
    const tick = _ => {
        let min = String(Math.trunc(time / 60)).padStart(2, 0);
        let sec = String(time % 60).padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;

        if (time === 0) {
            clearInterval(timer);
            logOut();
        }
        --time;
    };
    let time = 600; // total time in seconds (minutes * seconds) (10 * 60).
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
};

function logOut() {
    currentAccount = null;
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    containerMovements.innerHTML = "";
    labelBalance.textContent = "0000 €";
    labelSumIn.textContent = "0000€";
    labelSumOut.textContent = "0000€";
    labelSumInterest.textContent = "0000€";
    timer = undefined;
}

///////////////////////////////////////////////////////
// OLD PAINFUL SOLUTION FOR TIMER IMPLEMENTATION.  ///
/*
let countdownTimer;
const startLogOutTimer = function () {
    let min = 5;
    let sec = 0;
    const printTime = (min, sec) =>
        (labelTimer.textContent = [
            String(min).padStart(2, 0),
            String(sec).padStart(2, 0),
        ].join(":"));

    printTime(min, sec);
    const countdownTimer = setInterval(_ => {
        if (min === 0 && sec === 0) {
            logOut();
            return;
        }
        if (sec === 0) {
            sec = 59;
            printTime(--min, sec);
        } else {
            printTime(min, --sec);
        }
    }, 1000);
    // function to call later when clearing time 
    return function (clear = false) {
        if (clear) clearInterval(countdownTimer);
    };
};
countdownTimer = startLogOutTimer();

// And later based on logout
countdownTimer(true);
*/

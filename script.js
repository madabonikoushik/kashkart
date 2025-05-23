'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
 const displayMovements=function(movements,sort=false){
  containerMovements.innerHTML='';
  const movs=sort ? movements.slice().sort((a,b)=> a-b):movements;
  movs.forEach(function(move,i){
    const type=move > 0 ? 'deposit':'withdrawal'; 
     const html=`<div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${move.toFixed(2)}₹</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin',html);
  });
 } 
 const startTimeout=function(){
  let time=600 ;
  const timer=setInterval(function(){
    const min=String(Math.trunc(time/60)).padStart(2,0);
    const sec=String(Math.trunc(time%60)).padStart(2,0);
     labelTimer.textContent=`${min}:${sec}`;
       if(time===0){
    clearInterval(timer);
    labelWelcome.textContent=`Session Timed Out Login Again`;
    containerApp.style.opacity=0;
  }
  time--;

  },1000);
 
 }
 
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const createUsername=function(accs){
  accounts.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(name =>name[0]).join(''); 
  })
};
createUsername(accounts);
console.log(accounts);
const printBalance=function(acc){
    acc.balance=acc.movements.reduce((acc,curr) => acc+curr,0);
    labelBalance.textContent=`${acc.balance.toFixed(2)}₹`;
}

const calcDisplaySummary=function(acc){
  const income=acc.movements.filter(mov => mov > 0).reduce((acc,mov)=>acc+mov,0);
  labelSumIn.textContent=`${income.toFixed(2)}₹`;
  const out=acc.movements.filter(mov => mov < 0).reduce((acc,mov)=>acc+mov,0);
  labelSumOut.textContent=`${Math.abs(out)}₹`;
  const interest=acc.movements.filter(mov => mov > 0).map(mov => mov*acc.interestRate/100).filter((int,i,arr) =>{ return int >= 1}).reduce((acc,mov)=>acc+mov,0);
  labelSumInterest.textContent=`${interest.toFixed(2 )}₹`;
}
const UpdateUI=function(acc){
    displayMovements(acc.movements);
    printBalance(acc);
    calcDisplaySummary(acc);
}
let CurrentAccount;
const now=new Date();
const date=`${now.getDate()}`.padStart(2,0);
const month= `${now.getMonth()+1}`.padStart(2,0);
const year=now.getFullYear();
const hour=`${now.getHours()}`.padStart(2,0);
const min=`${now.getMinutes()}`.padStart(2,0);
labelDate.textContent=`${date}/${month}/${year}, ${hour}:${min}`;
btnLogin.addEventListener('click',function(e){
  e.preventDefault();
  CurrentAccount=accounts.find(acc => acc.username===inputLoginUsername.value);

  if(CurrentAccount.pin===Number(inputLoginPin.value)){
    labelWelcome.textContent=`Welcome Back, ${CurrentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity=100;
    inputLoginUsername.value='';
    inputLoginPin.value='';
    inputLoginPin.blur();
    startTimeout();
    UpdateUI(CurrentAccount);
  }else{
     containerApp.style.opacity=0 ;
  }
});
btnTransfer.addEventListener('click',function(e){
e.preventDefault();
 let amount=Number(inputTransferAmount.value);
 const receiverAcc=accounts.find(acc => acc.username===inputTransferTo.value);
   inputTransferAmount.value="";
    inputTransferTo.value="";
 if(amount > 0 && receiverAcc && CurrentAccount.balance >= amount && receiverAcc.username !== CurrentAccount.username){
   CurrentAccount.movements.push(-amount);
   receiverAcc.movements.push(amount);
    UpdateUI(CurrentAccount);
  
 }
});
btnClose.addEventListener('click',function(e){
e.preventDefault();
 if(inputCloseUsername.value===CurrentAccount.username && Number(inputClosePin.value)===CurrentAccount.pin){
    const index=accounts.findIndex(acc => acc.username===CurrentAccount.username);
    console.log(index);
 

    accounts.splice(index,1);
    containerApp.style.opacity=0;
    labelWelcome.textContent=`${CurrentAccount.owner.split(' ')[0]} Account Has Been Deleted`;
 }
    inputCloseUsername.value=inputClosePin.value=""; 

});
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  let number=Math.floor(Number(inputLoanAmount.value));
  if(number > 0 && CurrentAccount.movements.some(mov => mov >= number/10)){
    setTimeout(function(){
    inputLoanAmount.value='';
     CurrentAccount.movements.push(number);
        UpdateUI(CurrentAccount);
  },3000);
}
});

let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
   displayMovements(CurrentAccount.movements,!sorted);
   sorted=!sorted;
});


///////////////////////////////////////////////
///////////////////CART.JS/////////////////////
///////////////////////////////////////////////
/*
    In this file, you'll be writing code to
    calculate order totals. You'll also be 
    creating customer objects.  
*/


//////////////////PROBLEM 1////////////////////
/*  
    Below is a cart array that has food objects
    inside. 

    Write a callback below that uses the reduce
    array method to calculate the sum of all
    the food. 
*/

const cart = [
    {
        name: 'pizza', 
        price: 9.99
    }, 
    {
        name: 'pasta', 
        price: 8.99
    }, 
    {
        name: 'salad', 
        price: 7.99
    }
]

//CODE HERE

const summedPrice = cart.reduce((runningTotal, arrElement) => runningTotal + arrElement.price, 0);
console.log(`The summedPrice was $${summedPrice}`);

//////////////////PROBLEM 2////////////////////
/*  
    Write a function called `calcFinalPrice` that
    can take in `cartTotal`,`couponValue`,
    and `tax` arguments. 

    Inside the function, calculate the tax 
    on the cartTotal and add it in. Subtract
    the value of the coupon. Return the final
    number. 

    Note: the numbers passed in for `tax` will be
    decimals, for example: .06 for a 6% tax.
*/

//CODE HERE
function calcFinalPrice(cartTotal, couponValue, tax) {

    return parseFloat((cartTotal * (1 + tax) - couponValue).toFixed(2));

}

function logFunctionResult(couponValue, tax) {

    console.log(`The summedPrice of the cart, with a tax rate of ${tax}% and coupon discound of $${couponValue} applied, was $${calcFinalPrice(summedPrice, couponValue, tax)}`);

}

logFunctionResult(5, 0.06);

//////////////////PROBLEM 3////////////////////
/*  
    In this problem, you'll create a model for 
    a customer object as well as an example
    object. 

    Plan out a customer object for the cart page.
    Think about the information that a 
    restaurant would need about its customers.

    In the TEXT ANSWER area below, describe the
    properties that your customer object will have
    and why you chose those properties.

    Explain what data types each property should be
    and why you chose those data types. 

    Your object should have at least 4 properties. 
*/

/*
    TEXT ANSWER HERE
        ID: used as the primary key in the customer database, while this is a numeric value, it will be stored as a string because no math will be performed on it.
        name: informs the employees what the name of the customer is, stored as a string for obvious reasons.
        address: a separate object with street address, city, state and zip code properties used in area of service quiries and delivery instructions.
        phoneNumber: stores the customers phone number and is used to contact the customer. String, as no math with be done on it.
        rewardsPoints: used to track the customers progress towards a $20. If a certain purchase threashold is met, this value is incrimented, so it will be a number.
        managerDiscount: used to provide a discount on the customer's next order as compensation for a previous error. number, as it will be subtracted from the next order price.
        standingDiscount: used to provide a discount on corporate contract accounts who have negotiated a permanent discount with the order.

*/

/*
    Now, create a customer object following your own
    guidelines.
*/

//CODE HERE
class Customer {
    
    constructor (id, name, address, phoneNumber) { // all the above described properties

        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.rewardPoints = 0; // these three are set to 0 by default and require business logic based on current policy to update
        this.managerDiscount = 0;
        this.standingDiscount = 0;

    }

    addRewardPoint() { // incriments when the customer makes a qualifying purchase

        this.rewardPoints++;
        
    }

    addManagerDiscount(ammount) { // adds store credit to the customers account

        this.managerDiscount += ammount;

    }

    setStandingDiscount(rate) { // sets the customers current standing discount

        this.standingDiscount = rate;

    }

    applyCustomerDiscounts(orderAmmount, tryToRedeemRewardsPoints, policy) {

        // check if the customer wants to redeem their rewards and if they have enough to do so
        if (tryToRedeemRewardsPoints && this.rewardPoints >= policy.rewardsEligibilityTotal) {

            this.rewardPoints -= policy.rewardsEligibilityTotal; // deduct one full redemption from their rewards total
            orderAmmount = Math.max(0, orderAmmount - policy.rewardsValue); // this discount cannot reduce the price below $0
            
        }

        // reduces the cost of the order by the value of the managers discount

        if (orderAmmount >= this.managerDiscount) { //if the order is bigger than the discount

            orderAmmount -= this.managerDiscount; //it is reduced by the value of the discount
            this.managerDiscount = 0; // and the deiscount is wiped out

        } else { // the customer will still have some value left in the managers discount

            this.managerDiscount -= orderAmmount; // the remaining discount is reduced by the price of the order
            orderAmmount = 0; // and the price of the order is wiped out
        }

        orderAmmount *= 1 - this.standingDiscount; // if there is a standing discount, the price is adjusted accordingly

        return parseFloat(orderAmmount.toFixed(2)); // the result is returned after it is formatted to 2 decimal places

    }

}

let currentCustomerID = 1979;
const nextCustomerID = () => {currentCustomerID++;return currentCustomerID};
const newCustomer = new Customer(nextCustomerID(), 'Bill Stevens', {streeAddress: '1234 Elm', city: 'Anytown', stateAbriv: 'MI', zipcode: '48000'}, '(313) 555-2300');

// Feel free to stop reading here, as this is the end of the requirements for the assesment, but I found a really fun opportunity to write some business logic, so I took a crude swing at it

class DiscountPolicies { // Class that dictates the current company policies on discounts

    constructor (rewardsEligibilityTotal, rewardsValue, maxManagerDiscount, maxStandingDiscount){
        this.rewardsEligibilityTotal = rewardsEligibilityTotal; // How many points a customer must collect before being able to redeem them
        this.rewardsValue = rewardsValue; // How much redeeming a set of points is worth
        this.maxManagerDiscount = maxManagerDiscount; // The maximum ammount a customer can have as 'Store Credit'
        this.maxStandingDiscount = maxStandingDiscount; // The maximum discount a customer may have
    }

    tryToAddManagerDiscount(ammount, customer) { // if the user attempts to add more to the customers account than the max, the max is returned

        return Math.min(customer.managerDiscount + ammount, this.maxManagerDiscount)
    
    }

    tryToSetStandingDiscount(ammount) { // if the user attempts to add more to the customers account than the max, the max is returned

        return Math.min(ammount, this.maxStandingDiscount)
    
    }

}

const currentPolicy = new DiscountPolicies(10, 20, 10, .1); // The current store discount polcies

function logCustomerInfo(customer) { // logs the basic customer info

    console.log(`Customer ${customer.name} (Customer ID# ${customer.id})`);
    console.log(`lives at ${customer.address.streeAddress}, ${customer.address.city}, ${customer.address.stateAbriv}, ${customer.address.zipcode}`);
    console.log(`and can be reached by phone at ${customer.phoneNumber}.`)
}

function logCustomerDiscounts(customer, policy) { // logs the current state of the customers discounts. The policy provides context for the current policies, like rewards value

    let notInsert = '';

    if (customer.rewardPoints < policy.rewardsEligibilityTotal) { // inserts a 'not' inot the log is the customer has fewer points than are required
        notInsert = ' not';
    }

    console.log(`This customer has ${customer.rewardPoints} rewards points and is${notInsert} eligible to redeem ${policy.rewardsEligibilityTotal} points for a $${policy.rewardsValue} discount.`);

    if (customer.managerDiscount > 0) {
        console.log(`This customer has a pending Manager's discount of $${customer.managerDiscount}.`)
    }

    if (customer.standingDiscount != 0) {
        console.log(`This customer's standing discount is ${customer.standingDiscount * 100}%`)
    }
}

function logTransaction(ammount, customer, policy) { // logs the results of the customers discounts being applied to the order ammount. policy for context

       console.log(`Without discounts, the total price is $${ammount}. After the customer discounts it is $${customer.applyCustomerDiscounts(ammount, true, policy)}.`)

}

logCustomerInfo(newCustomer);
logCustomerDiscounts(newCustomer, currentPolicy);

console.log('Before discounts are applied:');
logTransaction(29.99, newCustomer, currentPolicy);

for (let i=1; i<=10; i++) { // I could set the points directly, but I wanted to test the method call, as it is what will be used if a customer purchases a qualifying ammount
    newCustomer.addRewardPoint();
}

newCustomer.managerDiscount = currentPolicy.tryToAddManagerDiscount(5, newCustomer); // using the current policy to ensure valid data is fed into the custoemr object
newCustomer.standingDiscount = currentPolicy.tryToSetStandingDiscount(0.15);

console.log('After the discound updates:')
logCustomerDiscounts(newCustomer, currentPolicy)
logTransaction(29.99, newCustomer, currentPolicy);

console.log('After the last transaction, with only the standing discount in place:');
logTransaction(29.99, newCustomer, currentPolicy);

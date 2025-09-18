# Balance Calculation Testing Guide

## 🎯 **Updated Balance Calculation Logic**

The current balance is now calculated based on **months elapsed since room assignment**, not just a simple calculation. Here's how it works:

### **📊 Calculation Formula:**
```
Current Balance = (Months Elapsed × Monthly Rent) - Total Payments Made
```

### **📅 Example Scenarios:**

#### **Scenario 1: New Tenant (1 Month)**
- **Lease Start:** January 1, 2025
- **Current Date:** February 1, 2025
- **Monthly Rent:** ₱5,000
- **Months Elapsed:** 1
- **Total Due:** ₱5,000
- **Payments Made:** ₱0
- **Current Balance:** ₱5,000

#### **Scenario 2: Tenant with Partial Payment (2 Months)**
- **Lease Start:** January 1, 2025
- **Current Date:** March 1, 2025
- **Monthly Rent:** ₱5,000
- **Months Elapsed:** 2
- **Total Due:** ₱10,000
- **Payments Made:** ₱3,000
- **Current Balance:** ₱7,000

#### **Scenario 3: Up-to-Date Tenant (3 Months)**
- **Lease Start:** January 1, 2025
- **Current Date:** April 1, 2025
- **Monthly Rent:** ₱5,000
- **Months Elapsed:** 3
- **Total Due:** ₱15,000
- **Payments Made:** ₱15,000
- **Current Balance:** ₱0

## 🧪 **Testing Steps:**

### **Test 1: Verify Balance Calculation**
1. **Login with tenant account**
2. **Check the "Current Balance" amount**
3. **Verify it matches the calculation:**
   - Count months since lease start date
   - Multiply by monthly rent
   - Subtract any payments made

### **Test 2: Check Next Due Date**
1. **Look at the date under "Current Balance"**
2. **Verify it shows the next month's due date**
3. **Should be calculated from lease start + months elapsed + 1**

### **Test 3: Test Different Scenarios**

#### **Create Test Tenant with Specific Dates:**
1. **Go to Landlord app**
2. **Create tenant with:**
   - **Lease Start Date:** 2 months ago
   - **Monthly Rent:** ₱5,000
   - **No payments made yet**
3. **Expected Balance:** ₱10,000 (2 months × ₱5,000)

#### **Add Payment and Verify:**
1. **Make a payment of ₱3,000**
2. **Expected Balance:** ₱7,000 (₱10,000 - ₱3,000)

## 🔍 **What to Look For:**

### **✅ Correct Behavior:**
- Balance increases by monthly rent amount each month
- Balance decreases when payments are made
- Next due date advances monthly
- Calculations are accurate based on lease start date

### **❌ Issues to Watch For:**
- Balance doesn't change over time
- Incorrect month calculations
- Wrong due dates
- Balance doesn't decrease after payments

## 📊 **Balance Details Available:**

The system now tracks:
- **Months Elapsed:** Since lease start
- **Total Due:** Months × Monthly Rent
- **Total Paid:** Sum of all payments
- **Current Balance:** Total Due - Total Paid
- **Next Due Date:** Next month's due date

## 🚨 **Troubleshooting:**

### **Balance Shows ₱0 When It Shouldn't:**
- Check if lease start date is set correctly
- Verify monthly rent amount
- Check if months calculation is working

### **Balance Doesn't Update:**
- Ensure lease start date is in the past
- Check if current date is being calculated correctly
- Verify monthly rent is not ₱0

### **Wrong Due Date:**
- Check lease start date format
- Verify month calculation logic
- Ensure date formatting is correct

## 🎯 **Expected Results:**

### **For a tenant assigned 2 months ago with ₱5,000 rent:**
```
Current Balance: ₱10,000
Next Due Date: [Next month from lease start]
Last Payment: ₱0 (if no payments made)
```

### **For a tenant with payments:**
```
Current Balance: ₱7,000 (calculated correctly)
Next Due Date: [Next month]
Last Payment: ₱3,000 (actual payment amount)
```

## 🚀 **Testing Commands:**

1. **Create test tenant with specific lease start date**
2. **Wait for next month to test time-based calculation**
3. **Add payments to test balance reduction**
4. **Verify all calculations are accurate**

The balance calculation now properly reflects the time-based rent accumulation! 🎉

**Test it out and verify the balance shows the correct amount based on months since room assignment!**


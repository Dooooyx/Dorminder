# Request/Report Counters - Dynamic Count Display

## 🎯 **Feature Added**

Added dynamic counters to the request/report side navigation tabs to show:
- **Total number of pending requests/reports**
- **Total number of completed requests/reports**

## 📊 **How It Works**

The counters now automatically update to show the real count of:
1. **Pending Requests/Reports** - Shows count of ongoing/pending items
2. **Completed Requests/Reports** - Shows count of completed items

### **Visual Display:**
```
┌─────────────────────────────┐
│ 📋 Pending Requests    [5]  │  ← Shows 5 pending
├─────────────────────────────┤
│ ✅ Completed Requests [11]  │  ← Shows 11 completed
└─────────────────────────────┘
```

## 📁 **Files Modified**

### 1. **`/Landlord/src/pages/Requests.jsx`**
   - ✅ Added `requestService` and `useAuth` imports
   - ✅ Added state variables: `ongoingCount` and `completedCount`
   - ✅ Added `loadRequestCounts()` function to fetch counts from Firestore
   - ✅ Added `useEffect` to load counts when user or category changes
   - ✅ Updated tabs to use dynamic counts instead of hardcoded values
   - ✅ Pass `onRequestUpdate` callback to child components

### 2. **`/Landlord/src/components/OngoingRequests.jsx`**
   - ✅ Added `onRequestUpdate` prop
   - ✅ Call `onRequestUpdate()` after completing a request to refresh counts

### 3. **`/Landlord/src/components/CompletedRequests.jsx`**
   - ✅ Added `onRequestUpdate` prop for consistency

## 🔧 **Technical Implementation**

### **Count Loading Logic:**
```javascript
const loadRequestCounts = async () => {
  try {
    const propertyId = user.uid;
    
    // Get ongoing/pending requests count
    const ongoingResult = await requestService.getRequestsByStatus(
      propertyId, 
      'pending', 
      category
    );
    if (ongoingResult.success) {
      setOngoingCount(ongoingResult.data.length);
    }
    
    // Get completed requests count
    const completedResult = await requestService.getRequestsByStatus(
      propertyId, 
      'completed', 
      category
    );
    if (completedResult.success) {
      setCompletedCount(completedResult.data.length);
    }
  } catch (error) {
    console.error('Error loading request counts:', error);
  }
};
```

### **Auto-Update on Status Change:**
When a request is marked as completed:
1. The request status updates in Firestore
2. `onRequestUpdate()` callback is triggered
3. Counts are refreshed automatically
4. UI updates to show new counts

## 🎨 **UI Features**

### **Counter Badge Styling:**
- **Active Tab**: White background with orange text
- **Inactive Tab**: Gray background with gray text
- **Auto-hide**: Badge only shows when `count > 0`

### **Counter Behavior:**
- ✅ Real-time updates when requests are completed
- ✅ Separate counts for requests vs reports (based on category)
- ✅ Updates automatically when switching categories
- ✅ Updates when user changes (multi-landlord support)

## 📋 **Category Support**

The counters work for both:
- **Requests** (`category = 'request'`)
  - "Pending Requests" tab shows pending request count
  - "Completed Requests" tab shows completed request count

- **Reports** (`category = 'report'`)
  - "Pending Report" tab shows pending report count
  - "Completed Report" tab shows completed report count

## ✅ **Benefits**

1. ✅ **Real-time Visibility**: Landlords can see at a glance how many items need attention
2. ✅ **Auto-Updates**: Counts refresh when items are completed
3. ✅ **Category-Specific**: Shows correct counts for requests vs reports
4. ✅ **User-Specific**: Each landlord sees their own property's counts
5. ✅ **Clean UI**: Badges only appear when there are items to show

## 🧪 **Testing**

To test the counters:
1. Go to Requests page (`/requests?category=request`)
2. Observe the count on "Pending Requests" tab
3. Complete a request
4. Watch the counts update automatically:
   - Pending count decreases by 1
   - Completed count increases by 1

## 🚀 **What's Working Now**

- ✅ Dynamic counters on both tabs
- ✅ Real-time count updates
- ✅ Category-aware counting (requests vs reports)
- ✅ Auto-refresh on request completion
- ✅ Clean, styled badge display
- ✅ No linting errors

The request/report navigation now provides clear visual feedback on workload!

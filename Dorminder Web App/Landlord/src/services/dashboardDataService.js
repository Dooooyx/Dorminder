/**
 * Dashboard Data Service
 * Fetches real-time data from Firebase for the dashboard
 */

import { firestoreService } from './firestore';
import { tenantService } from './tenantService';
import { requestService } from './requestService';
import { roomService } from './roomService';
import { billingService } from './billingService';

export class DashboardDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes cache
  }

  /**
   * Get cached data or fetch from Firebase
   */
  async getCachedData(key, fetchFunction) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await fetchFunction();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    return data;
  }

  /**
   * Get comprehensive dashboard data for a property
   */
  async getDashboardData(propertyId) {
    return await this.getCachedData(`dashboard_${propertyId}`, async () => {
      try {
        console.log('🔄 Fetching dashboard data for property:', propertyId);
        
        // Fetch all data in parallel
        const [tenants, requests, rooms, bills] = await Promise.all([
          this.getTenantsData(propertyId),
          this.getRequestsData(propertyId),
          this.getRoomsData(propertyId),
          this.getBillsData(propertyId)
        ]);

        const dashboardData = {
          propertyId,
          timestamp: new Date(),
          rentCollected: this.calculateRentCollected(bills),
          totalRooms: this.calculateTotalRooms(rooms, tenants), // Pass tenants for better calculation
          activeTenants: this.calculateActiveTenants(tenants, rooms), // Pass rooms for better calculation
          pendingRequests: this.calculatePendingRequests(requests),
          // Additional metrics for AI analytics
          financialMetrics: this.calculateFinancialMetrics(bills, tenants),
          occupancyMetrics: this.calculateOccupancyMetrics(tenants, rooms),
          maintenanceMetrics: this.calculateMaintenanceMetrics(requests)
        };

        console.log('✅ Dashboard data fetched successfully:', dashboardData);
        return dashboardData;
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
        throw error;
      }
    });
  }

  /**
   * Get tenants data
   */
  async getTenantsData(propertyId) {
    try {
      const result = await tenantService.getTenantsByProperty(propertyId);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching tenants:', error);
      return [];
    }
  }

  /**
   * Get requests data
   */
  async getRequestsData(propertyId) {
    try {
      const result = await requestService.getRequestsByProperty(propertyId);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching requests:', error);
      return [];
    }
  }

  /**
   * Get rooms data
   */
  async getRoomsData(propertyId) {
    try {
      // Assuming roomService has getRoomsByProperty method
      const result = await roomService.getRoomsByProperty(propertyId);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  /**
   * Get bills data
   */
  async getBillsData(propertyId) {
    try {
      // Use getBillsByLandlord since propertyId is actually the landlordId (user.uid)
      const result = await billingService.getBillsByLandlord(propertyId);
      console.log('💰 Bills data fetched:', result);
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Error fetching bills:', error);
      return [];
    }
  }

  /**
   * Calculate rent collected metrics
   */
  calculateRentCollected(bills) {
    console.log('💰 Calculating rent collected from bills:', bills);
    
    const currentMonth = new Date();
    const currentMonthBills = bills.filter(bill => {
      const billDate = bill.createdAt?.toDate?.() || new Date(bill.createdAt);
      const isCurrentMonth = billDate.getMonth() === currentMonth.getMonth() && 
                            billDate.getFullYear() === currentMonth.getFullYear();
      const isPaid = bill.status === 'Paid' || bill.status === 'paid';
      console.log(`📅 Bill ${bill.id}: month=${billDate.getMonth()}, current=${currentMonth.getMonth()}, status=${bill.status}, isCurrentMonth=${isCurrentMonth}, isPaid=${isPaid}`);
      return isCurrentMonth && isPaid;
    });

    console.log('✅ Current month paid bills:', currentMonthBills);

    const totalCollected = currentMonthBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    
    // Calculate expected rent (sum of all tenant monthly rents for current month)
    const expectedRent = bills.reduce((sum, bill) => {
      const billDate = bill.createdAt?.toDate?.() || new Date(bill.createdAt);
      if (billDate.getMonth() === currentMonth.getMonth() && 
          billDate.getFullYear() === currentMonth.getFullYear()) {
        return sum + (bill.totalAmount || 0);
      }
      return sum;
    }, 0);

    const collectionRate = expectedRent > 0 ? (totalCollected / expectedRent) * 100 : 0;
    
    console.log('💰 Rent calculation results:', {
      totalCollected,
      expectedRent,
      collectionRate,
      currentMonthBills: currentMonthBills.length
    });

    return {
      collected: totalCollected,
      expected: expectedRent,
      rate: collectionRate,
      formatted: {
        collected: `₱${totalCollected.toLocaleString()}`,
        expected: `₱${expectedRent.toLocaleString()}`,
        rate: `${collectionRate.toFixed(1)}%`
      }
    };
  }

  /**
   * Calculate total rooms metrics
   */
  calculateTotalRooms(rooms, tenants = []) {
    console.log('🏠 Calculating total rooms from:', rooms.length, 'rooms and', tenants.length, 'tenants');
    
    const totalRooms = rooms.length;
    const currentDate = new Date();
    
    // Count occupied rooms by checking which rooms have active tenants
    let occupiedRooms = 0;
    const roomOccupancyMap = {};
    
    // Initialize all rooms as vacant
    rooms.forEach(room => {
      roomOccupancyMap[room.roomNumber || room.id] = false;
    });
    
    // Check each tenant to see if they occupy a room
    tenants.forEach(tenant => {
      const leaseEndDate = tenant.leaseEndDate?.toDate?.() || new Date(tenant.leaseEndDate);
      const hasValidLease = leaseEndDate > currentDate;
      const roomNumber = tenant.roomNumber || tenant.roomId;
      
      if (hasValidLease && roomNumber && roomOccupancyMap.hasOwnProperty(roomNumber)) {
        roomOccupancyMap[roomNumber] = true;
        console.log('🏠 Room', roomNumber, 'occupied by', tenant.name);
      }
    });
    
    // Count occupied rooms
    occupiedRooms = Object.values(roomOccupancyMap).filter(occupied => occupied).length;
    const vacantRooms = totalRooms - occupiedRooms;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    console.log('📊 Total rooms result:', { totalRooms, occupiedRooms, vacantRooms, occupancyRate });

    return {
      total: totalRooms,
      occupied: occupiedRooms,
      vacant: vacantRooms,
      occupancyRate,
      formatted: {
        total: totalRooms.toString(),
        occupied: `${occupiedRooms}/${totalRooms}`,
        vacant: `${vacantRooms} Vacant`
      }
    };
  }

  /**
   * Calculate active tenants metrics
   */
  calculateActiveTenants(tenants, rooms = []) {
    console.log('👥 Calculating active tenants from:', tenants.length, 'tenants and', rooms.length, 'rooms');
    
    const currentDate = new Date();
    let activeTenants = 0;
    let totalCapacity = 0;
    
    // Calculate total capacity from rooms
    totalCapacity = rooms.length;
    
    // Count active tenants based on lease validity and room assignment
    tenants.forEach(tenant => {
      console.log('👤 Checking tenant:', tenant.name, 'Status:', tenant.status, 'Payment:', tenant.paymentStatus);
      
      // Check if tenant has a valid lease (not expired)
      const leaseEndDate = tenant.leaseEndDate?.toDate?.() || new Date(tenant.leaseEndDate);
      const hasValidLease = leaseEndDate > currentDate;
      
      // Check if tenant is assigned to a room
      const hasRoomAssignment = tenant.roomNumber || tenant.roomId;
      
      // Consider tenant active if they have a valid lease and room assignment
      // Status can be 'pending', 'active', or other - what matters is lease validity
      if (hasValidLease && hasRoomAssignment) {
        activeTenants++;
        console.log('✅ Active tenant:', tenant.name, 'Room:', tenant.roomNumber || tenant.roomId);
      } else {
        console.log('❌ Inactive tenant:', tenant.name, 'Valid lease:', hasValidLease, 'Has room:', hasRoomAssignment);
      }
    });
    
    const occupancyRate = totalCapacity > 0 ? (activeTenants / totalCapacity) * 100 : 0;
    
    console.log('📊 Active tenants result:', { activeTenants, totalCapacity, occupancyRate });

    return {
      total: totalCapacity, // Total room capacity
      active: activeTenants,
      occupancyRate,
      formatted: {
        active: activeTenants.toString(),
        total: `${activeTenants}/${totalCapacity} capacity`
      }
    };
  }

  /**
   * Calculate pending requests metrics
   */
  calculatePendingRequests(requests) {
    const currentMonth = new Date();
    const currentMonthRequests = requests.filter(request => {
      const requestDate = request.createdAt?.toDate?.() || new Date(request.createdAt);
      return requestDate.getMonth() === currentMonth.getMonth() && 
             requestDate.getFullYear() === currentMonth.getFullYear();
    });

    const pendingRequests = requests.filter(request => request.status === 'pending').length;
    const totalThisMonth = currentMonthRequests.length;
    const pendingRate = totalThisMonth > 0 ? (pendingRequests / totalThisMonth) * 100 : 0;

    return {
      pending: pendingRequests,
      totalThisMonth,
      pendingRate,
      formatted: {
        pending: pendingRequests.toString(),
        total: `${pendingRequests}/${totalThisMonth} total this month`
      }
    };
  }

  /**
   * Calculate financial metrics for AI analytics
   */
  calculateFinancialMetrics(bills, tenants) {
    const currentMonth = new Date();
    const last6Months = [];
    
    // Get last 6 months of revenue data
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      
      const monthBills = bills.filter(bill => {
        const billDate = bill.createdAt?.toDate?.() || new Date(bill.createdAt);
        return billDate.getMonth() === month.getMonth() && 
               billDate.getFullYear() === month.getFullYear() &&
               bill.status === 'paid';
      });
      
      const monthRevenue = monthBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
      last6Months.push(monthRevenue);
    }

    // Calculate average monthly rent per tenant
    const totalMonthlyRent = tenants.reduce((sum, tenant) => sum + (tenant.monthlyRent || 0), 0);
    const averageMonthlyRent = tenants.length > 0 ? totalMonthlyRent / tenants.length : 0;

    return {
      last6MonthsRevenue: last6Months,
      averageMonthlyRevenue: last6Months.reduce((sum, rev) => sum + rev, 0) / last6Months.length,
      totalMonthlyRent,
      averageMonthlyRent,
      revenueGrowth: this.calculateGrowthRate(last6Months)
    };
  }

  /**
   * Calculate occupancy metrics for AI analytics
   */
  calculateOccupancyMetrics(tenants, rooms) {
    console.log('🏠 Calculating occupancy metrics from:', tenants.length, 'tenants and', rooms.length, 'rooms');
    
    const totalRooms = rooms.length;
    const currentDate = new Date();
    
    // Count occupied rooms by checking which rooms have active tenants
    let occupiedRooms = 0;
    const roomOccupancyMap = {};
    
    // Initialize all rooms as vacant
    rooms.forEach(room => {
      roomOccupancyMap[room.roomNumber || room.id] = false;
    });
    
    // Check each tenant to see if they occupy a room
    tenants.forEach(tenant => {
      const leaseEndDate = tenant.leaseEndDate?.toDate?.() || new Date(tenant.leaseEndDate);
      const hasValidLease = leaseEndDate > currentDate;
      const roomNumber = tenant.roomNumber || tenant.roomId;
      
      if (hasValidLease && roomNumber && roomOccupancyMap.hasOwnProperty(roomNumber)) {
        roomOccupancyMap[roomNumber] = true;
        console.log('🏠 Room', roomNumber, 'occupied by', tenant.name);
      }
    });
    
    // Count occupied rooms
    occupiedRooms = Object.values(roomOccupancyMap).filter(occupied => occupied).length;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Calculate tenant retention
    const retainedTenants = tenants.filter(tenant => {
      const endDate = tenant.leaseEndDate?.toDate?.() || new Date(tenant.leaseEndDate);
      return endDate > currentDate;
    });
    const retentionRate = tenants.length > 0 ? (retainedTenants.length / tenants.length) * 100 : 0;

    console.log('📊 Occupancy result:', { 
      totalRooms, 
      occupiedRooms, 
      occupancyRate, 
      roomOccupancyMap 
    });

    return {
      occupancyRate,
      retentionRate,
      totalRooms,
      occupiedRooms,
      totalTenants: tenants.length
    };
  }

  /**
   * Calculate maintenance metrics for AI analytics
   */
  calculateMaintenanceMetrics(requests) {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(req => req.status === 'pending').length;
    const completedRequests = requests.filter(req => req.status === 'completed').length;
    
    // Calculate average response time
    const completedWithTimes = requests.filter(req => 
      req.status === 'completed' && req.createdAt && req.updatedAt
    );
    
    const responseTimes = completedWithTimes.map(req => {
      const created = req.createdAt?.toDate?.() || new Date(req.createdAt);
      const completed = req.updatedAt?.toDate?.() || new Date(req.updatedAt);
      return (completed - created) / (1000 * 60 * 60); // hours
    });
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;

    return {
      totalRequests,
      pendingRequests,
      completedRequests,
      averageResponseTime,
      completionRate: totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0
    };
  }

  /**
   * Calculate growth rate
   */
  calculateGrowthRate(values) {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return first > 0 ? ((last - first) / first) * 100 : 0;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const dashboardDataService = new DashboardDataService();
export default dashboardDataService;

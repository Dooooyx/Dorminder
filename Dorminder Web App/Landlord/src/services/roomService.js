import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export class RoomService {
  
  // Check if room number already exists for a property
  async checkRoomNumberExists(propertyId, roomNumber) {
    try {
      const q = query(
        collection(db, 'rooms'),
        where('propertyId', '==', propertyId),
        where('roomNumber', '==', roomNumber)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      console.error('Error checking room number:', error);
      return false;
    }
  }

  // Create a new room
  async createRoom(roomData) {
    try {
      // Check if room number already exists
      const roomExists = await this.checkRoomNumberExists(roomData.propertyId, roomData.roomNumber);
      
      if (roomExists) {
        return { 
          success: false, 
          error: `Room number "${roomData.roomNumber}" already exists for this property. Please choose a different room number.` 
        };
      }

      const roomToSave = {
        ...roomData,
        status: 'Vacant', // New rooms are automatically vacant
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'rooms'), roomToSave);
      return { success: true, roomId: docRef.id };
    } catch (error) {
      console.error('Error creating room:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all rooms for a property
  async getRoomsByProperty(propertyId) {
    try {
      // Try with orderBy first (preferred)
      try {
        const q = query(
          collection(db, 'rooms'), 
          where('propertyId', '==', propertyId),
          orderBy('roomNumber', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const rooms = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        return { success: true, data: rooms };
      } catch (indexError) {
        // If index is still building, fallback to simple query
        console.log('Rooms index still building, using fallback query');
        const q = query(
          collection(db, 'rooms'), 
          where('propertyId', '==', propertyId)
        );
        const querySnapshot = await getDocs(q);
        const rooms = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Sort manually since we can't use orderBy
        rooms.sort((a, b) => {
          const aRoom = a.roomNumber || '';
          const bRoom = b.roomNumber || '';
          return aRoom.localeCompare(bRoom, undefined, { numeric: true });
        });
        
        return { success: true, data: rooms };
      }
    } catch (error) {
      console.error('Error getting rooms by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Get only vacant rooms for a property
  async getVacantRoomsByProperty(propertyId) {
    try {
      // Try with orderBy first (preferred)
      try {
        const q = query(
          collection(db, 'rooms'), 
          where('propertyId', '==', propertyId),
          where('status', '==', 'Vacant'),
          orderBy('roomNumber', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const rooms = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        return { success: true, data: rooms };
      } catch (indexError) {
        // If index is still building, fallback to simple query
        console.log('Vacant rooms index still building, using fallback query');
        const q = query(
          collection(db, 'rooms'), 
          where('propertyId', '==', propertyId),
          where('status', '==', 'Vacant')
        );
        const querySnapshot = await getDocs(q);
        const rooms = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        }));
        
        // Sort manually since we can't use orderBy
        rooms.sort((a, b) => {
          const aRoom = a.roomNumber || '';
          const bRoom = b.roomNumber || '';
          return aRoom.localeCompare(bRoom, undefined, { numeric: true });
        });
        
        return { success: true, data: rooms };
      }
    } catch (error) {
      console.error('Error getting vacant rooms by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Get a single room by ID
  async getRoomById(roomId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Room not found' };
      }
    } catch (error) {
      console.error('Error getting room by ID:', error);
      return { success: false, error: error.message };
    }
  }

  // Update room information
  async updateRoom(roomId, updateData) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating room:', error);
      return { success: false, error: error.message };
    }
  }

  // Update room status (Vacant/Occupied)
  async updateRoomStatus(roomId, status) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      await updateDoc(docRef, {
        status: status,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating room status:', error);
      return { success: false, error: error.message };
    }
  }

  // Assign tenant to room (set status to Occupied)
  async assignTenantToRoom(roomId, tenantId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      await updateDoc(docRef, {
        status: 'Occupied',
        tenantId: tenantId,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error assigning tenant to room:', error);
      return { success: false, error: error.message };
    }
  }

  // Remove tenant from room (set status to Vacant)
  async removeTenantFromRoom(roomId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      await updateDoc(docRef, {
        status: 'Vacant',
        tenantId: null,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error removing tenant from room:', error);
      return { success: false, error: error.message };
    }
  }

  // Sync room status based on tenant assignments
  async syncRoomStatus(propertyId) {
    try {
      // Get all rooms for the property
      const roomsResult = await this.getRoomsByProperty(propertyId);
      if (!roomsResult.success) {
        return { success: false, error: roomsResult.error };
      }

      // Get all tenants for the property
      const { tenantService } = await import('./tenantService');
      const tenantsResult = await tenantService.getTenantsByProperty(propertyId);
      if (!tenantsResult.success) {
        return { success: false, error: tenantsResult.error };
      }

      const tenants = tenantsResult.data;
      const occupiedRoomIds = new Set(tenants.map(tenant => tenant.roomId).filter(Boolean));

      // Update room statuses
      const updatePromises = roomsResult.data.map(async (room) => {
        const shouldBeOccupied = occupiedRoomIds.has(room.id);
        const currentStatus = room.status;
        
        if (shouldBeOccupied && currentStatus !== 'Occupied') {
          return this.updateRoomStatus(room.id, 'Occupied');
        } else if (!shouldBeOccupied && currentStatus !== 'Vacant') {
          return this.updateRoomStatus(room.id, 'Vacant');
        }
        return { success: true };
      });

      await Promise.all(updatePromises);
      return { success: true };
    } catch (error) {
      console.error('Error syncing room status:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a room
  async deleteRoom(roomId) {
    try {
      const docRef = doc(db, 'rooms', roomId);
      await deleteDoc(docRef);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting room:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const roomService = new RoomService();

export default roomService;

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

export class RulesService {
  
  // Create a new rule
  async createRule(ruleData) {
    try {
      const ruleDocData = {
        ...ruleData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'rules'), ruleDocData);
      
      return { 
        success: true, 
        ruleId: docRef.id,
        message: 'Rule created successfully'
      };
    } catch (error) {
      console.error('Error creating rule:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all rules for a property
  async getRulesByProperty(propertyId) {
    try {
      const rulesRef = collection(db, 'rules');
      
      // Try the indexed query first
      try {
        const q = query(
          rulesRef, 
          where('propertyId', '==', propertyId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        
        const rules = [];
        querySnapshot.forEach((doc) => {
          rules.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        return { success: true, data: rules };
      } catch (indexError) {
        // If index is still building, use fallback query
        if (indexError.code === 'failed-precondition' && indexError.message.includes('index')) {
          console.log('Rules index still building, using fallback query');
          
          const fallbackQuery = query(
            rulesRef,
            where('propertyId', '==', propertyId)
          );
          const fallbackSnapshot = await getDocs(fallbackQuery);
          
          const rules = [];
          fallbackSnapshot.forEach((doc) => {
            rules.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Sort by createdAt manually since we can't use orderBy
          rules.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
            return bTime - aTime; // Descending order
          });
          
          return { success: true, data: rules };
        } else {
          throw indexError;
        }
      }
    } catch (error) {
      console.error('Error getting rules:', error);
      return { success: false, error: error.message };
    }
  }

  // Get a specific rule by ID
  async getRuleById(ruleId) {
    try {
      const ruleDoc = await getDoc(doc(db, 'rules', ruleId));
      
      if (!ruleDoc.exists()) {
        return { success: false, error: 'Rule not found' };
      }
      
      return { 
        success: true, 
        data: {
          id: ruleDoc.id,
          ...ruleDoc.data()
        }
      };
    } catch (error) {
      console.error('Error getting rule:', error);
      return { success: false, error: error.message };
    }
  }

  // Update a rule
  async updateRule(ruleId, ruleData) {
    try {
      await updateDoc(doc(db, 'rules', ruleId), {
        ...ruleData,
        updatedAt: serverTimestamp()
      });
      
      return { 
        success: true, 
        message: 'Rule updated successfully'
      };
    } catch (error) {
      console.error('Error updating rule:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a rule
  async deleteRule(ruleId) {
    try {
      await deleteDoc(doc(db, 'rules', ruleId));
      
      return { 
        success: true, 
        message: 'Rule deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting rule:', error);
      return { success: false, error: error.message };
    }
  }

  // Get rules for tenant display (public rules)
  async getPublicRules(propertyId) {
    try {
      const rulesRef = collection(db, 'rules');
      const q = query(
        rulesRef, 
        where('propertyId', '==', propertyId),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const querySnapshot = await getDocs(q);
      
      const rules = [];
      querySnapshot.forEach((doc) => {
        rules.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: rules };
    } catch (error) {
      console.error('Error getting public rules:', error);
      return { success: false, error: error.message };
    }
  }

  // Create default rules for a property
  async createDefaultRules(propertyId) {
    try {
      const defaultRules = [
        {
          propertyId,
          title: 'General Conduct',
          description: 'Basic behavioral guidelines for all tenants',
          rules: [
            'Respect fellow tenants, staff, and visitors at all times.',
            'Keep hallways, shared spaces, and your room clean and orderly.',
            'Smoking, vaping, and illegal substances are strictly prohibited inside the premises.',
            'No loud music or disruptive behavior in common areas.',
            'Report any maintenance issues promptly to the landlord.'
          ],
          order: 1,
          isActive: true,
          icon: 'checkmark'
        },
        {
          propertyId,
          title: 'Quiet Hours',
          description: 'Designated quiet times for peaceful living',
          rules: [
            'Quiet hours are observed from 9:00 PM - 7:00 AM.',
            'Loud music, shouting, or gatherings are not allowed during quiet hours.',
            'Use headphones for music and keep TV volume low during quiet hours.',
            'Be considerate of others who may be studying or sleeping.'
          ],
          order: 2,
          isActive: true,
          icon: 'moon'
        },
        {
          propertyId,
          title: 'Guest Policy',
          description: 'Guidelines for having visitors',
          rules: [
            'Guests must be registered with the landlord before staying overnight.',
            'Maximum of 2 guests per room at any time.',
            'Guests must follow all boarding house rules.',
            'Tenants are responsible for their guests\' behavior.',
            'No guests allowed during quiet hours without prior approval.'
          ],
          order: 3,
          isActive: true,
          icon: 'people'
        },
        {
          propertyId,
          title: 'Payment & Rent',
          description: 'Rent payment guidelines and policies',
          rules: [
            'Rent is due on the 1st of every month.',
            'Late payments after the 5th will incur a ₱100 penalty.',
            'Payment methods: Bank transfer, cash, or check.',
            'Keep all payment receipts for your records.',
            'Contact landlord immediately if you cannot make payment on time.'
          ],
          order: 4,
          isActive: true,
          icon: 'cash'
        }
      ];

      const results = [];
      for (const rule of defaultRules) {
        const result = await this.createRule(rule);
        results.push(result);
      }

      return { 
        success: true, 
        message: 'Default rules created successfully',
        results
      };
    } catch (error) {
      console.error('Error creating default rules:', error);
      return { success: false, error: error.message };
    }
  }
}

export const rulesService = new RulesService();

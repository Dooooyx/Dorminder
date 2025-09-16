import { 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';

export class RulesService {
  
  // Get rules for tenant display (public rules)
  async getPublicRules(propertyId) {
    try {
      const rulesRef = collection(db, 'rules');
      
      // Try the indexed query first
      try {
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
            const ruleData = doc.data();
            // Only include active rules for tenant display
            if (ruleData.isActive === true) {
              rules.push({
                id: doc.id,
                ...ruleData
              });
            }
          });
          
          // Sort by order manually since we can't use orderBy
          rules.sort((a, b) => (a.order || 0) - (b.order || 0));
          
          return { success: true, data: rules };
        } else {
          throw indexError;
        }
      }
    } catch (error) {
      console.error('Error getting public rules:', error);
      return { success: false, error: error.message };
    }
  }

  // Get rules for tenant by property ID (fallback method)
  async getRulesByProperty(propertyId) {
    try {
      const rulesRef = collection(db, 'rules');
      
      // Try the indexed query first
      try {
        const q = query(
          rulesRef, 
          where('propertyId', '==', propertyId),
          orderBy('order', 'asc')
        );
        const querySnapshot = await getDocs(q);
        
        const rules = [];
        querySnapshot.forEach((doc) => {
          const ruleData = doc.data();
          // Only include active rules for tenant display
          if (ruleData.isActive !== false) {
            rules.push({
              id: doc.id,
              ...ruleData
            });
          }
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
            const ruleData = doc.data();
            // Only include active rules for tenant display
            if (ruleData.isActive !== false) {
              rules.push({
                id: doc.id,
                ...ruleData
              });
            }
          });
          
          // Sort by order manually since we can't use orderBy
          rules.sort((a, b) => (a.order || 0) - (b.order || 0));
          
          return { success: true, data: rules };
        } else {
          throw indexError;
        }
      }
    } catch (error) {
      console.error('Error getting rules by property:', error);
      return { success: false, error: error.message };
    }
  }

  // Get icon emoji based on icon type
  getIconEmoji(iconType) {
    const iconMap = {
      'checkmark': '✓',
      'moon': '🌙',
      'people': '👥',
      'cash': '💰',
      'warning': '⚠️',
      'home': '🏠',
      'clock': '🕐',
      'shield': '🛡️'
    };
    return iconMap[iconType] || '📋';
  }
}

export const rulesService = new RulesService();

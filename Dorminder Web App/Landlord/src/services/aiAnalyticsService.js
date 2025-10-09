/**
 * AI Analytics Service for Dorminder
 * Provides financial forecasting and analytics using machine learning algorithms
 */


export class AIAnalyticsService {
  constructor() {
    this.forecastCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  /**
   * Generate comprehensive financial forecast
   */
  async generateFinancialForecast(dashboardData, months = 12) {
    const cacheKey = `forecast_${dashboardData.propertyId}_${months}`;
    const cached = this.forecastCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const forecast = {
        monthly: this.calculateMonthlyForecast(dashboardData, months),
        yearly: this.calculateYearlyForecast(dashboardData),
        insights: this.generateFinancialInsights(dashboardData),
        recommendations: this.generateFinancialRecommendations(dashboardData)
      };

      this.forecastCache.set(cacheKey, {
        data: forecast,
        timestamp: Date.now()
      });

      return forecast;
    } catch (error) {
      console.error('Error generating financial forecast:', error);
      throw error;
    }
  }

  /**
   * Calculate monthly revenue forecast
   */
  calculateMonthlyForecast(dashboardData, months) {
    const { financialMetrics, occupancyMetrics } = dashboardData;
    const { last6MonthsRevenue, averageMonthlyRevenue, totalMonthlyRent } = financialMetrics;
    const { occupancyRate, totalRooms } = occupancyMetrics;
    
    // Use totalMonthlyRent as fallback if averageMonthlyRevenue is zero
    const baseRevenue = averageMonthlyRevenue > 0 ? averageMonthlyRevenue : (totalMonthlyRent || 0);

    // Use linear regression for trend analysis
    const trend = this.calculateTrend(last6MonthsRevenue);
    const seasonality = this.calculateSeasonality(last6MonthsRevenue);
    
    const forecast = [];
    const currentMonth = new Date();

    for (let i = 1; i <= months; i++) {
      const forecastDate = new Date(currentMonth);
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      // Base revenue with trend
      let monthlyRevenue = baseRevenue + (trend * i);
      
      // Apply seasonality (higher in certain months)
      const seasonalFactor = this.getSeasonalFactor(forecastDate.getMonth());
      monthlyRevenue *= seasonalFactor;
      
      // Apply occupancy impact
      const occupancyFactor = occupancyRate / 100;
      monthlyRevenue *= occupancyFactor;
      
      // Add some realistic variance
      const variance = 0.1; // 10% variance
      const randomFactor = 1 + (Math.random() - 0.5) * variance;
      monthlyRevenue *= randomFactor;

      forecast.push({
        month: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Math.round(monthlyRevenue),
        expenses: Math.round(monthlyRevenue * 0.3), // Assume 30% expenses
        netIncome: Math.round(monthlyRevenue * 0.7), // Assume 70% net
        occupancy: Math.round(occupancyRate * (1 + (Math.random() - 0.5) * 0.1))
      });
    }

    return forecast;
  }

  /**
   * Calculate yearly forecast
   */
  calculateYearlyForecast(dashboardData) {
    const monthlyForecast = this.calculateMonthlyForecast(dashboardData, 12);
    
    const yearlyRevenue = monthlyForecast.reduce((sum, month) => sum + month.revenue, 0);
    const yearlyExpenses = monthlyForecast.reduce((sum, month) => sum + month.expenses, 0);
    const yearlyNetIncome = monthlyForecast.reduce((sum, month) => sum + month.netIncome, 0);
    
    const averageOccupancy = monthlyForecast.reduce((sum, month) => sum + month.occupancy, 0) / 12;
    
    return {
      revenue: yearlyRevenue,
      expenses: yearlyExpenses,
      netIncome: yearlyNetIncome,
      profitMargin: yearlyRevenue > 0 ? (yearlyNetIncome / yearlyRevenue) * 100 : 0,
      averageOccupancy: Math.round(averageOccupancy),
      roi: this.calculateROI(dashboardData, yearlyNetIncome)
    };
  }

  /**
   * Generate advanced financial insights with predictive analysis
   */
  generateFinancialInsights(dashboardData) {
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    const { revenueGrowth, averageMonthlyRevenue, last6MonthsRevenue } = financialMetrics;
    const { occupancyRate, retentionRate } = occupancyMetrics;
    const { completionRate, averageResponseTime } = maintenanceMetrics;

    const insights = [];

    // Advanced revenue insights with trend analysis
    const revenueTrend = this.calculateTrend(last6MonthsRevenue);
    const volatility = this.calculateVolatility(last6MonthsRevenue);
    
    if (revenueGrowth > 5) {
      insights.push({
        type: 'positive',
        category: 'revenue',
        message: `Strong revenue growth of ${revenueGrowth.toFixed(1)}% with ${revenueTrend > 0 ? 'upward' : 'stabilizing'} trend`,
        impact: 'high',
        confidence: this.calculateConfidenceFromData(last6MonthsRevenue),
        recommendation: 'Consider capacity expansion or premium pricing'
      });
    } else if (revenueGrowth < -5) {
      insights.push({
        type: 'negative',
        category: 'revenue',
        message: `Revenue declining by ${Math.abs(revenueGrowth).toFixed(1)}% - ${volatility > 0.3 ? 'high volatility' : 'consistent decline'}`,
        impact: 'high',
        confidence: this.calculateConfidenceFromData(last6MonthsRevenue),
        recommendation: 'Immediate pricing and marketing review required'
      });
    } else {
      insights.push({
        type: 'neutral',
        category: 'revenue',
        message: `Stable revenue growth of ${revenueGrowth.toFixed(1)}% with ${volatility < 0.1 ? 'low volatility' : 'moderate volatility'}`,
        impact: 'medium',
        confidence: this.calculateConfidenceFromData(last6MonthsRevenue),
        recommendation: 'Focus on operational efficiency improvements'
      });
    }

    // Advanced occupancy insights with seasonal analysis
    const seasonalPattern = this.analyzeSeasonalPatterns(last6MonthsRevenue);
    
    if (occupancyRate > 90) {
      insights.push({
        type: 'positive',
        category: 'occupancy',
        message: `Excellent occupancy rate of ${occupancyRate.toFixed(1)}% - ${seasonalPattern ? 'seasonal opportunities available' : 'consistent high demand'}`,
        impact: 'high',
        confidence: 0.9,
        recommendation: 'Consider dynamic pricing for new tenants'
      });
    } else if (occupancyRate < 70) {
      insights.push({
        type: 'negative',
        category: 'occupancy',
        message: `Low occupancy rate of ${occupancyRate.toFixed(1)}% - ${seasonalPattern ? 'seasonal recovery expected' : 'structural issue requiring attention'}`,
        impact: 'medium',
        confidence: 0.8,
        recommendation: 'Implement aggressive marketing and competitive pricing'
      });
    } else {
      insights.push({
        type: 'neutral',
        category: 'occupancy',
        message: `Good occupancy rate of ${occupancyRate.toFixed(1)}% with room for optimization`,
        impact: 'medium',
        confidence: 0.7,
        recommendation: 'Focus on tenant satisfaction and retention programs'
      });
    }

    // Advanced retention insights with predictive analysis
    const retentionRisk = this.calculateRetentionRisk(occupancyMetrics, financialMetrics);
    
    if (retentionRate > 80) {
      insights.push({
        type: 'positive',
        category: 'retention',
        message: `High tenant retention rate of ${retentionRate.toFixed(1)}% - ${retentionRisk < 0.3 ? 'low churn risk' : 'monitor at-risk tenants'}`,
        impact: 'medium',
        confidence: 0.85,
        recommendation: 'Maintain current tenant satisfaction programs'
      });
    } else if (retentionRate < 60) {
      insights.push({
        type: 'negative',
        category: 'retention',
        message: `Low retention rate of ${retentionRate.toFixed(1)}% - ${retentionRisk > 0.7 ? 'high churn risk' : 'moderate risk'}`,
        impact: 'high',
        confidence: 0.8,
        recommendation: 'Implement tenant retention strategies immediately'
      });
    }

    // Maintenance efficiency insights
    if (completionRate > 90 && averageResponseTime < 24) {
      insights.push({
        type: 'positive',
        category: 'maintenance',
        message: `Outstanding maintenance performance: ${completionRate.toFixed(1)}% completion rate, ${averageResponseTime.toFixed(1)}h avg response`,
        impact: 'medium',
        confidence: 0.9,
        recommendation: 'Use as competitive advantage in marketing'
      });
    } else if (completionRate < 70 || averageResponseTime > 48) {
      insights.push({
        type: 'negative',
        category: 'maintenance',
        message: `Maintenance issues: ${completionRate.toFixed(1)}% completion, ${averageResponseTime.toFixed(1)}h response time`,
        impact: 'high',
        confidence: 0.8,
        recommendation: 'Prioritize maintenance process improvements'
      });
    }

    // Cash flow insights
    const cashFlowHealth = this.analyzeCashFlowHealth(financialMetrics);
    if (cashFlowHealth.score < 0.6) {
      insights.push({
        type: 'warning',
        category: 'cashflow',
        message: `Cash flow concerns: ${cashFlowHealth.issues.join(', ')}`,
        impact: 'high',
        confidence: 0.9,
        recommendation: 'Review payment collection processes and expenses'
      });
    }

    return insights;
  }

  /**
   * Generate financial recommendations
   */
  generateFinancialRecommendations(dashboardData) {
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    const recommendations = [];

    // Revenue optimization
    if (financialMetrics.revenueGrowth < 0) {
      recommendations.push({
        type: 'revenue_optimization',
        priority: 'high',
        action: 'Review pricing strategy and consider rent adjustments',
        expectedImpact: 'Increase monthly revenue by 5-10%',
        timeframe: '1-2 months'
      });
    }

    // Occupancy optimization
    if (occupancyMetrics.occupancyRate < 80) {
      recommendations.push({
        type: 'occupancy_optimization',
        priority: 'high',
        action: 'Implement marketing campaigns and improve property amenities',
        expectedImpact: 'Increase occupancy by 10-15%',
        timeframe: '2-3 months'
      });
    }

    // Maintenance optimization
    if (maintenanceMetrics.averageResponseTime > 48) {
      recommendations.push({
        type: 'maintenance_optimization',
        priority: 'medium',
        action: 'Improve maintenance response time and tenant satisfaction',
        expectedImpact: 'Reduce response time by 50%',
        timeframe: '1 month'
      });
    }

    // Cost optimization
    recommendations.push({
      type: 'cost_optimization',
      priority: 'medium',
      action: 'Review utility costs and maintenance expenses',
      expectedImpact: 'Reduce operating costs by 5-8%',
      timeframe: '2-3 months'
    });

    return recommendations;
  }


  /**
   * Calculate trend using linear regression
   */
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  /**
   * Calculate seasonality patterns
   */
  calculateSeasonality(values) {
    if (values.length < 6) return 1;
    
    // Simple seasonality calculation
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const seasonalFactors = values.map(val => val / average);
    
    return seasonalFactors;
  }

  /**
   * Get seasonal factor for a month
   */
  getSeasonalFactor(month) {
    // Philippine rental market seasonality
    const seasonalFactors = {
      0: 1.1,  // January - high demand
      1: 1.0,  // February
      2: 1.0,  // March
      3: 1.0,  // April
      4: 1.0,  // May
      5: 1.0,  // June
      6: 1.0,  // July
      7: 1.0,  // August
      8: 1.0,  // September
      9: 1.0,  // October
      10: 1.0, // November
      11: 1.2  // December - holiday season
    };
    
    return seasonalFactors[month] || 1.0;
  }

  /**
   * Calculate ROI
   */
  calculateROI(dashboardData, netIncome) {
    // This would typically use property value, but we'll estimate
    const estimatedPropertyValue = dashboardData.totalRooms * 500000; // Estimate ₱500k per room
    return estimatedPropertyValue > 0 ? (netIncome / estimatedPropertyValue) * 100 : 0;
  }

  /**
   * Calculate data volatility for trend analysis
   */
  calculateVolatility(values) {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    return mean > 0 ? standardDeviation / mean : 0; // Coefficient of variation
  }

  /**
   * Calculate confidence score from data quality
   */
  calculateConfidenceFromData(values) {
    if (!values || values.length < 3) return 0.5;
    
    let confidence = 0.7;
    
    // Higher confidence for more data points
    if (values.length >= 6) confidence += 0.1;
    if (values.length >= 12) confidence += 0.1;
    
    // Higher confidence for consistent data
    const volatility = this.calculateVolatility(values);
    if (volatility < 0.1) confidence += 0.1;
    else if (volatility > 0.5) confidence -= 0.1;
    
    // Higher confidence for positive trends
    const trend = this.calculateTrend(values);
    if (trend > 0) confidence += 0.05;
    
    return Math.min(Math.max(confidence, 0.3), 0.95);
  }

  /**
   * Analyze seasonal patterns in revenue data
   */
  analyzeSeasonalPatterns(values) {
    if (values.length < 6) return false;
    
    // Simple seasonal analysis - check for recurring patterns
    const quarterlyAverages = [];
    for (let i = 0; i < values.length; i += 3) {
      const quarter = values.slice(i, i + 3);
      if (quarter.length > 0) {
        quarterlyAverages.push(quarter.reduce((sum, val) => sum + val, 0) / quarter.length);
      }
    }
    
    if (quarterlyAverages.length < 2) return false;
    
    // Check for significant variation between quarters
    const maxQuarter = Math.max(...quarterlyAverages);
    const minQuarter = Math.min(...quarterlyAverages);
    const variation = (maxQuarter - minQuarter) / maxQuarter;
    
    return variation > 0.15; // 15% variation indicates seasonality
  }

  /**
   * Calculate retention risk based on multiple factors
   */
  calculateRetentionRisk(occupancyMetrics, financialMetrics) {
    let risk = 0.5; // Base risk
    
    // Occupancy rate impact
    if (occupancyMetrics.occupancyRate < 70) risk += 0.2;
    else if (occupancyMetrics.occupancyRate > 90) risk -= 0.1;
    
    // Revenue growth impact
    if (financialMetrics.revenueGrowth < -5) risk += 0.2;
    else if (financialMetrics.revenueGrowth > 5) risk -= 0.1;
    
    // Retention rate impact
    if (occupancyMetrics.retentionRate < 60) risk += 0.2;
    else if (occupancyMetrics.retentionRate > 80) risk -= 0.1;
    
    return Math.min(Math.max(risk, 0), 1);
  }

  /**
   * Analyze cash flow health
   */
  analyzeCashFlowHealth(financialMetrics) {
    const issues = [];
    let score = 1.0;
    
    // Check revenue consistency
    if (financialMetrics.revenueGrowth < -10) {
      issues.push('declining revenue');
      score -= 0.3;
    }
    
    // Check if average revenue is reasonable
    if (financialMetrics.averageMonthlyRevenue < 10000) { // Less than ₱10k
      issues.push('low monthly revenue');
      score -= 0.2;
    }
    
    // Check for revenue volatility
    const volatility = this.calculateVolatility(financialMetrics.last6MonthsRevenue || []);
    if (volatility > 0.4) {
      issues.push('high revenue volatility');
      score -= 0.2;
    }
    
    return {
      score: Math.max(score, 0),
      issues: issues.length > 0 ? issues : ['healthy cash flow'],
      volatility: volatility
    };
  }

  /**
   * Generate risk assessment for the property
   */
  generateRiskAssessment(dashboardData) {
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    const risks = [];
    let overallRisk = 'LOW';
    
    // Financial risks
    if (financialMetrics.revenueGrowth < -10) {
      risks.push({
        category: 'Financial',
        level: 'HIGH',
        description: 'Significant revenue decline detected',
        impact: 'Revenue stability at risk',
        mitigation: 'Review pricing strategy and marketing efforts'
      });
    }
    
    // Occupancy risks
    if (occupancyMetrics.occupancyRate < 60) {
      risks.push({
        category: 'Occupancy',
        level: 'HIGH',
        description: 'Low occupancy rate',
        impact: 'Revenue generation below capacity',
        mitigation: 'Implement aggressive marketing and competitive pricing'
      });
    }
    
    // Maintenance risks
    if (maintenanceMetrics.completionRate < 60) {
      risks.push({
        category: 'Maintenance',
        level: 'MEDIUM',
        description: 'Low maintenance completion rate',
        impact: 'Tenant satisfaction may decline',
        mitigation: 'Improve maintenance response and completion processes'
      });
    }
    
    // Determine overall risk level
    const highRisks = risks.filter(r => r.level === 'HIGH').length;
    const mediumRisks = risks.filter(r => r.level === 'MEDIUM').length;
    
    if (highRisks >= 2) overallRisk = 'HIGH';
    else if (highRisks >= 1 || mediumRisks >= 3) overallRisk = 'MEDIUM';
    
    return {
      overallRisk,
      risks,
      riskScore: this.calculateRiskScore(risks)
    };
  }

  /**
   * Calculate numerical risk score
   */
  calculateRiskScore(risks) {
    let score = 0;
    risks.forEach(risk => {
      switch (risk.level) {
        case 'HIGH': score += 3; break;
        case 'MEDIUM': score += 2; break;
        case 'LOW': score += 1; break;
      }
    });
    return Math.min(score / (risks.length || 1), 3);
  }

  /**
   * Generate market intelligence insights
   */
  generateMarketIntelligence(dashboardData) {
    const { financialMetrics, occupancyMetrics } = dashboardData;
    
    const marketInsights = [];
    
    // Market positioning analysis
    const occupancyRate = occupancyMetrics.occupancyRate;
    if (occupancyRate > 90) {
      marketInsights.push({
        type: 'competitive_advantage',
        message: 'High occupancy indicates strong market position',
        recommendation: 'Consider premium pricing for new tenants',
        confidence: 0.9
      });
    } else if (occupancyRate < 70) {
      marketInsights.push({
        type: 'market_challenge',
        message: 'Lower occupancy suggests market challenges',
        recommendation: 'Analyze competitor pricing and amenities',
        confidence: 0.8
      });
    }
    
    // Revenue performance analysis
    const revenueGrowth = financialMetrics.revenueGrowth;
    if (revenueGrowth > 10) {
      marketInsights.push({
        type: 'market_opportunity',
        message: 'Strong revenue growth indicates market expansion',
        recommendation: 'Consider capacity expansion opportunities',
        confidence: 0.85
      });
    }
    
    // Pricing optimization
    const averageRent = financialMetrics.averageMonthlyRent;
    marketInsights.push({
      type: 'pricing_optimization',
      message: `Current average rent: ₱${averageRent.toLocaleString()}`,
      recommendation: 'Compare with local market rates for optimization',
      confidence: 0.7
    });
    
    return marketInsights;
  }

  /**
   * Generate tenant behavior analytics
   */
  generateTenantBehaviorAnalytics(dashboardData) {
    const { occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    const behaviorInsights = [];
    
    // Payment behavior
    behaviorInsights.push({
      metric: 'Payment Timeliness',
      value: occupancyMetrics.retentionRate > 80 ? 'Excellent' : 'Needs Improvement',
      trend: occupancyMetrics.retentionRate > 80 ? 'up' : 'down',
      recommendation: occupancyMetrics.retentionRate > 80 ? 
        'Maintain current payment processes' : 
        'Implement automated payment reminders'
    });
    
    // Maintenance request behavior
    const avgResponseTime = maintenanceMetrics.averageResponseTime;
    behaviorInsights.push({
      metric: 'Maintenance Satisfaction',
      value: avgResponseTime < 24 ? 'High' : avgResponseTime < 48 ? 'Medium' : 'Low',
      trend: avgResponseTime < 24 ? 'up' : 'down',
      recommendation: avgResponseTime < 24 ? 
        'Continue current maintenance standards' : 
        'Improve maintenance response times'
    });
    
    return behaviorInsights;
  }

  /**
   * Generate performance metrics
   */
  generatePerformanceMetrics(dashboardData) {
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    const metrics = {
      financial: {
        revenueGrowth: financialMetrics.revenueGrowth,
        averageMonthlyRevenue: financialMetrics.averageMonthlyRevenue,
        revenueStability: 1 - this.calculateVolatility(financialMetrics.last6MonthsRevenue || []),
        collectionEfficiency: this.calculateCollectionEfficiency(dashboardData)
      },
      operational: {
        occupancyRate: occupancyMetrics.occupancyRate,
        retentionRate: occupancyMetrics.retentionRate,
        maintenanceCompletionRate: maintenanceMetrics.completionRate,
        averageResponseTime: maintenanceMetrics.averageResponseTime
      },
      efficiency: {
        roomUtilization: (occupancyMetrics.occupiedRooms / occupancyMetrics.totalRooms) * 100,
        revenuePerRoom: occupancyMetrics.totalRooms > 0 ? financialMetrics.averageMonthlyRevenue / occupancyMetrics.totalRooms : 0,
        tenantSatisfactionScore: this.calculateTenantSatisfactionScore(dashboardData)
      }
    };
    
    // Calculate overall performance score
    const financialScore = this.calculateFinancialScore(metrics.financial);
    const operationalScore = this.calculateOperationalScore(metrics.operational);
    const efficiencyScore = this.calculateEfficiencyScore(metrics.efficiency);
    
    const overallScore = (financialScore + operationalScore + efficiencyScore) / 3;
    
    return {
      ...metrics,
      overall: {
        score: overallScore,
        grade: this.getPerformanceGrade(overallScore),
        trend: this.calculatePerformanceTrend(dashboardData)
      }
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateOptimizationRecommendations(dashboardData) {
    const recommendations = [];
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    // Revenue optimization
    if (occupancyMetrics.occupancyRate < 85) {
      recommendations.push({
        category: 'Revenue',
        priority: 'HIGH',
        title: 'Increase Occupancy Rate',
        description: `Current occupancy: ${occupancyMetrics.occupancyRate.toFixed(1)}%. Target: 95%`,
        impact: 'High',
        effort: 'Medium',
        timeframe: '2-3 months',
        expectedBenefit: `Increase monthly revenue by ₱${Math.round((95 - occupancyMetrics.occupancyRate) / 100 * financialMetrics.totalMonthlyRent).toLocaleString()}`,
        actions: [
          'Implement competitive pricing strategy',
          'Enhance marketing campaigns',
          'Improve property amenities',
          'Offer tenant referral incentives'
        ]
      });
    }
    
    // Maintenance optimization
    if (maintenanceMetrics.averageResponseTime > 24) {
      recommendations.push({
        category: 'Operations',
        priority: 'MEDIUM',
        title: 'Improve Maintenance Response Time',
        description: `Current response time: ${maintenanceMetrics.averageResponseTime.toFixed(1)} hours`,
        impact: 'Medium',
        effort: 'Low',
        timeframe: '1 month',
        expectedBenefit: 'Increase tenant satisfaction and retention',
        actions: [
          'Implement 24/7 maintenance hotline',
          'Create maintenance priority system',
          'Establish vendor partnerships',
          'Use mobile app for faster reporting'
        ]
      });
    }
    
    // Financial optimization
    if (financialMetrics.revenueGrowth < 0) {
      recommendations.push({
        category: 'Financial',
        priority: 'HIGH',
        title: 'Revenue Growth Strategy',
        description: `Revenue declining by ${Math.abs(financialMetrics.revenueGrowth).toFixed(1)}%`,
        impact: 'High',
        effort: 'High',
        timeframe: '3-6 months',
        expectedBenefit: 'Reverse declining revenue trend',
        actions: [
          'Review and adjust pricing strategy',
          'Implement dynamic pricing',
          'Focus on tenant retention',
          'Explore additional revenue streams'
        ]
      });
    }
    
    // Cost optimization
    recommendations.push({
      category: 'Cost Management',
      priority: 'MEDIUM',
      title: 'Optimize Operating Costs',
      description: 'Review and reduce unnecessary expenses',
      impact: 'Medium',
      effort: 'Medium',
      timeframe: '2-4 months',
      expectedBenefit: 'Reduce operating costs by 10-15%',
      actions: [
        'Audit utility usage and optimize',
        'Negotiate vendor contracts',
        'Implement energy-efficient solutions',
        'Automate routine processes'
      ]
    });
    
    return recommendations;
  }

  /**
   * Calculate collection efficiency
   */
  calculateCollectionEfficiency(dashboardData) {
    const { rentCollected } = dashboardData;
    return rentCollected ? rentCollected.rate / 100 : 0.8; // Default to 80% if no data
  }

  /**
   * Calculate tenant satisfaction score
   */
  calculateTenantSatisfactionScore(dashboardData) {
    const { occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    // Simple satisfaction calculation based on available metrics
    let score = 0.7; // Base score
    
    // Occupancy rate impact
    if (occupancyMetrics.occupancyRate > 90) score += 0.2;
    else if (occupancyMetrics.occupancyRate < 70) score -= 0.2;
    
    // Retention rate impact
    if (occupancyMetrics.retentionRate > 80) score += 0.1;
    else if (occupancyMetrics.retentionRate < 60) score -= 0.1;
    
    // Maintenance performance impact
    if (maintenanceMetrics.completionRate > 90) score += 0.1;
    else if (maintenanceMetrics.completionRate < 70) score -= 0.1;
    
    if (maintenanceMetrics.averageResponseTime < 24) score += 0.1;
    else if (maintenanceMetrics.averageResponseTime > 48) score -= 0.1;
    
    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Calculate financial performance score
   */
  calculateFinancialScore(metrics) {
    let score = 0.5;
    
    if (metrics.revenueGrowth > 5) score += 0.3;
    else if (metrics.revenueGrowth < -5) score -= 0.3;
    
    if (metrics.revenueStability > 0.8) score += 0.2;
    else if (metrics.revenueStability < 0.6) score -= 0.2;
    
    if (metrics.collectionEfficiency > 0.9) score += 0.2;
    else if (metrics.collectionEfficiency < 0.7) score -= 0.2;
    
    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Calculate operational performance score
   */
  calculateOperationalScore(metrics) {
    let score = 0.5;
    
    if (metrics.occupancyRate > 90) score += 0.3;
    else if (metrics.occupancyRate < 70) score -= 0.3;
    
    if (metrics.retentionRate > 80) score += 0.2;
    else if (metrics.retentionRate < 60) score -= 0.2;
    
    if (metrics.maintenanceCompletionRate > 90) score += 0.2;
    else if (metrics.maintenanceCompletionRate < 70) score -= 0.2;
    
    if (metrics.averageResponseTime < 24) score += 0.1;
    else if (metrics.averageResponseTime > 48) score -= 0.1;
    
    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Calculate efficiency performance score
   */
  calculateEfficiencyScore(metrics) {
    let score = 0.5;
    
    if (metrics.roomUtilization > 90) score += 0.3;
    else if (metrics.roomUtilization < 70) score -= 0.3;
    
    if (metrics.revenuePerRoom > 15000) score += 0.2; // ₱15k+ per room
    else if (metrics.revenuePerRoom < 10000) score -= 0.2;
    
    if (metrics.tenantSatisfactionScore > 0.8) score += 0.2;
    else if (metrics.tenantSatisfactionScore < 0.6) score -= 0.2;
    
    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(score) {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B+';
    if (score >= 0.6) return 'B';
    if (score >= 0.5) return 'C+';
    if (score >= 0.4) return 'C';
    return 'D';
  }

  /**
   * Calculate performance trend
   */
  calculatePerformanceTrend(dashboardData) {
    // Simple trend calculation based on recent performance
    const { financialMetrics } = dashboardData;
    const growth = financialMetrics.revenueGrowth || 0;
    
    if (growth > 5) return 'improving';
    if (growth < -5) return 'declining';
    return 'stable';
  }

  /**
   * Clear forecast cache
   */
  clearCache() {
    this.forecastCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.forecastCache.size,
      keys: Array.from(this.forecastCache.keys())
    };
  }

  /**
   * GROQ API INTEGRATION
   * Enhanced forecasting using GROQ AI models (Llama 3.1 70B)
   */

  /**
   * Get GROQ API key from environment
   */
  getGROQAPIKey() {
    // Try import.meta.env first (Vite), then process.env (Node.js)
    return import.meta.env?.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  }

  /**
   * Check if GROQ API is available
   */
  isGROQAvailable() {
    const apiKey = this.getGROQAPIKey();
    return apiKey && apiKey !== 'your_api_key_here' && apiKey.startsWith('gsk_');
  }

  /**
   * Validate GROQ API key format
   */
  validateGROQAPIKey() {
    const apiKey = this.getGROQAPIKey();
    if (!apiKey) {
      return { valid: false, error: 'No GROQ API key found' };
    }
    if (apiKey === 'your_api_key_here') {
      return { valid: false, error: 'GROQ API key not configured (still using placeholder)' };
    }
    if (!apiKey.startsWith('gsk_')) {
      return { valid: false, error: 'Invalid GROQ API key format (should start with gsk_)' };
    }
    return { valid: true, error: null };
  }

  /**
   * Generate enhanced forecast using GROQ AI with robust fallback and advanced analytics
   */
  async generateEnhancedForecast(dashboardData, months = 12) {
    const cacheKey = `enhanced_forecast_${dashboardData.propertyId}_${months}`;
    const cached = this.forecastCache.get(cacheKey);
    
    // Return cached data if available and not expired
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📋 Using cached forecast data');
      return cached.data;
    }

    try {
      let enhancedForecast;
      let aiEnhanced = false;

      // Try GROQ first if available (with timeout)
      if (this.isGROQAvailable()) {
        console.log('🤖 Attempting GROQ AI for enhanced forecasting...');
        try {
          // Add timeout to prevent hanging
          const groqPromise = this.generateGROQForecast(dashboardData, months);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('GROQ timeout')), 15000)
          );
          
          enhancedForecast = await Promise.race([groqPromise, timeoutPromise]);
          aiEnhanced = true;
          console.log('✅ GROQ AI forecast successful');
        } catch (groqError) {
          console.warn('⚠️ GROQ failed, using enhanced local AI:', groqError.message);
          enhancedForecast = await this.generateEnhancedLocalForecast(dashboardData, months);
        }
      } else {
        console.log('📊 Using enhanced local AI (GROQ not configured)...');
        enhancedForecast = await this.generateEnhancedLocalForecast(dashboardData, months);
      }

      // Ensure we always have a valid forecast
      if (!enhancedForecast) {
        console.warn('⚠️ Enhanced forecast failed, using basic local algorithms...');
        enhancedForecast = await this.generateFinancialForecast(dashboardData, months);
      }

      // Add AI enhancement flag
      enhancedForecast.aiEnhanced = aiEnhanced;

      // Add new advanced analytics features
      console.log('🔍 Adding advanced analytics features...');
      
      // Generate risk assessment
      enhancedForecast.riskAssessment = this.generateRiskAssessment(dashboardData);
      
      // Generate market intelligence
      enhancedForecast.marketIntelligence = this.generateMarketIntelligence(dashboardData);
      
      // Generate tenant behavior analytics
      enhancedForecast.tenantBehavior = this.generateTenantBehaviorAnalytics(dashboardData);
      
      // Add performance metrics
      enhancedForecast.performanceMetrics = this.generatePerformanceMetrics(dashboardData);
      
      // Add optimization recommendations
      enhancedForecast.optimizationRecommendations = this.generateOptimizationRecommendations(dashboardData);

      // Cache the result
      this.forecastCache.set(cacheKey, {
        data: enhancedForecast,
        timestamp: Date.now()
      });

      console.log('✅ Enhanced forecast with advanced analytics completed');
      return enhancedForecast;
    } catch (error) {
      console.error('❌ All forecast methods failed, using emergency fallback:', error);
      // Emergency fallback - always return something
      return this.generateEmergencyFallback(dashboardData, months);
    }
  }

  /**
   * Generate forecast using GROQ API
   */
  async generateGROQForecast(dashboardData, months = 12) {
    const apiKey = this.getGROQAPIKey();
    
    // Prepare data for AI analysis
    const analysisData = {
      propertyId: dashboardData.propertyId,
      financialMetrics: dashboardData.financialMetrics,
      occupancyMetrics: dashboardData.occupancyMetrics,
      maintenanceMetrics: dashboardData.maintenanceMetrics,
      currentMonth: new Date().toLocaleDateString()
    };

    // Create prompt for financial analysis
    const prompt = this.createGROQFinancialAnalysisPrompt(analysisData, months);

    try {
      console.log('🤖 Calling GROQ API for enhanced forecasting...');
      
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are an expert property management AI assistant specializing in dormitory and rental property financial analysis. Provide detailed, actionable insights for property managers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          stream: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ GROQ API response:', result);

        // Parse AI response and combine with local algorithms
        const aiInsights = this.parseGROQResponse(result);
        const localForecast = await this.generateFinancialForecast(dashboardData, months);

        // Merge AI insights with local forecast
        return this.mergeAIWithLocalForecast(aiInsights, localForecast);
      } else {
        const errorText = await response.text();
        console.error(`❌ GROQ API failed with status: ${response.status}`, errorText);
        throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ GROQ API error:', error);
      throw error;
    }
  }

  /**
   * Generate enhanced local forecast with simulated AI insights
   */
  async generateEnhancedLocalForecast(dashboardData, months = 12) {
    console.log('🧠 Generating enhanced local AI forecast...');
    
    // Generate improved forecast with better calculations
    const improvedForecast = await this.generateImprovedFinancialForecast(dashboardData, months);
    
    // Create enhanced AI-like insights using local algorithms
    const enhancedInsights = this.generateLocalAIInsights(dashboardData);
    
    // Merge with improved forecast
    return this.mergeAIWithLocalForecast(enhancedInsights, improvedForecast);
  }

  /**
   * Generate local AI-like insights
   */
  generateLocalAIInsights(dashboardData) {
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    
    // Generate contextual insights based on data
    const insights = [];
    
    // Revenue insights
    if (financialMetrics.revenueGrowth > 5) {
      insights.push("Strong revenue growth indicates healthy property performance. Consider expanding capacity or optimizing pricing.");
    } else if (financialMetrics.revenueGrowth < -5) {
      insights.push("Declining revenue suggests need for immediate action. Review pricing strategy and tenant retention programs.");
    } else {
      insights.push("Stable revenue growth indicates consistent performance. Focus on operational efficiency improvements.");
    }
    
    // Occupancy insights
    if (occupancyMetrics.occupancyRate > 90) {
      insights.push("Excellent occupancy rate demonstrates strong market demand. Consider premium pricing for new tenants.");
    } else if (occupancyMetrics.occupancyRate < 70) {
      insights.push("Low occupancy rate requires immediate attention. Implement marketing campaigns and competitive pricing.");
    } else {
      insights.push("Good occupancy rate with room for improvement. Focus on tenant satisfaction and retention.");
    }
    
    // Maintenance insights
    if (maintenanceMetrics.completionRate > 90) {
      insights.push("Outstanding maintenance performance. Continue current practices and consider preventive maintenance programs.");
    } else if (maintenanceMetrics.completionRate < 70) {
      insights.push("Maintenance backlog needs attention. Prioritize urgent repairs and improve response times.");
    } else {
      insights.push("Solid maintenance performance. Consider implementing predictive maintenance strategies.");
    }
    
    // Generate recommendations
    const recommendations = [
      {
        action: "Implement dynamic pricing strategy based on occupancy trends",
        priority: "medium",
        category: "revenue_optimization"
      },
      {
        action: "Enhance tenant communication and satisfaction programs",
        priority: "high",
        category: "tenant_retention"
      },
      {
        action: "Develop preventive maintenance schedule",
        priority: "medium",
        category: "operational_efficiency"
      }
    ];
    
    return {
      aiAnalysis: insights.join(" "),
      confidence: 0.8,
      keyPoints: insights,
      recommendations: recommendations
    };
  }

  /**
   * Generate improved financial forecast with better calculations
   */
  async generateImprovedFinancialForecast(dashboardData, months = 12) {
    console.log('🔮 Generating improved financial forecast...');
    
    const { financialMetrics, occupancyMetrics, maintenanceMetrics } = dashboardData;
    const currentDate = new Date();
    
    // Base calculations
    const currentRevenue = financialMetrics.averageMonthlyRevenue || 0;
    const totalMonthlyRent = financialMetrics.totalMonthlyRent || 0;
    const currentOccupancy = occupancyMetrics.occupancyRate || 0;
    const totalRooms = occupancyMetrics.totalRooms || 1;
    
    // Use totalMonthlyRent as fallback if currentRevenue is zero
    const baseRevenue = currentRevenue > 0 ? currentRevenue : totalMonthlyRent;
    
    // Calculate average rent per room
    const averageRentPerRoom = totalRooms > 0 ? baseRevenue / totalRooms : 0;
    
    // Generate monthly forecasts
    const monthlyForecast = [];
    let cumulativeRevenue = 0;
    
    for (let i = 0; i < months; i++) {
      const forecastDate = new Date(currentDate);
      forecastDate.setMonth(currentDate.getMonth() + i + 1);
      
      // Apply seasonal adjustments (higher occupancy in certain months)
      const month = forecastDate.getMonth();
      let seasonalMultiplier = 1.0;
      
      // Academic year adjustments (higher demand in Aug-Sep, Jan-Feb)
      if (month === 7 || month === 8) seasonalMultiplier = 1.15; // Aug-Sep
      if (month === 0 || month === 1) seasonalMultiplier = 1.1;  // Jan-Feb
      if (month === 5 || month === 6) seasonalMultiplier = 0.9;  // Jun-Jul (summer break)
      
      // Calculate projected occupancy with seasonal adjustment
      const projectedOccupancy = Math.min(100, currentOccupancy * seasonalMultiplier);
      
      // Calculate monthly revenue
      const monthlyRevenue = (projectedOccupancy / 100) * totalRooms * averageRentPerRoom;
      cumulativeRevenue += monthlyRevenue;
      
      monthlyForecast.push({
        month: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        monthNumber: month + 1,
        occupancy: Math.round(projectedOccupancy),
        revenue: Math.round(monthlyRevenue),
        netIncome: Math.round(monthlyRevenue * 0.7), // 70% profit margin
        cumulativeRevenue: Math.round(cumulativeRevenue)
      });
    }
    
    // Calculate annual projections
    const annualRevenue = cumulativeRevenue;
    const annualGrowth = financialMetrics.revenueGrowth || 0;
    const projectedGrowth = annualGrowth > 0 ? annualGrowth * 1.1 : annualGrowth * 0.9; // Optimistic/pessimistic adjustment
    
    // Calculate net income (assuming 70% profit margin for dormitory)
    const operatingExpenses = annualRevenue * 0.3; // 30% for maintenance, utilities, etc.
    const netIncome = annualRevenue - operatingExpenses;
    const profitMargin = annualRevenue > 0 ? (netIncome / annualRevenue) * 100 : 0;
    
    console.log('📊 Improved forecast results:', {
      annualRevenue: Math.round(annualRevenue),
      netIncome: Math.round(netIncome),
      profitMargin: Math.round(profitMargin * 10) / 10,
      monthlyForecast: monthlyForecast.length
    });
    
    return {
      yearly: {
        revenue: Math.round(annualRevenue),
        netIncome: Math.round(netIncome),
        profitMargin: Math.round(profitMargin * 10) / 10,
        growthRate: Math.round(projectedGrowth * 10) / 10
      },
      monthly: monthlyForecast,
      confidence: 0.85,
      aiEnhanced: false, // This is local calculation
      insights: {
        seasonalTrends: "Higher demand expected in academic year start (Aug-Sep, Jan-Feb)",
        occupancyOptimization: `Current ${Math.round(currentOccupancy)}% occupancy can be optimized to 95%+`,
        revenuePotential: `Potential annual revenue: ₱${Math.round(annualRevenue).toLocaleString()}`
      }
    };
  }

  /**
   * Create a detailed prompt for GROQ financial analysis
   */
  createGROQFinancialAnalysisPrompt(data, months) {
    return `As a property management AI expert, analyze this dormitory data and provide comprehensive insights:

DORMITORY DATA:
- Room Number: ${data.propertyId}
- Current Month: ${data.currentMonth}
- Average Monthly Revenue: ₱${data.financialMetrics?.averageMonthlyRevenue?.toLocaleString() || 0}
- Total Monthly Rent: ₱${data.financialMetrics?.totalMonthlyRent?.toLocaleString() || 0}
- Revenue Growth: ${data.financialMetrics?.revenueGrowth?.toFixed(1) || 0}%
- Occupancy Rate: ${data.occupancyMetrics?.occupancyRate?.toFixed(1) || 0}%
- Retention Rate: ${data.occupancyMetrics?.retentionRate?.toFixed(1) || 0}%
- Total Rooms: ${data.occupancyMetrics?.totalRooms || 0}
- Active Tenants: ${data.occupancyMetrics?.totalTenants || 0}
- Pending Requests: ${data.maintenanceMetrics?.pendingRequests || 0}
- Completion Rate: ${data.maintenanceMetrics?.completionRate?.toFixed(1) || 0}%

ANALYSIS REQUEST:
Please provide detailed insights on:
1. Revenue forecast for next ${months} months with specific recommendations
2. Occupancy trends and optimization strategies
3. Cost optimization opportunities
4. Market positioning and competitive advantages
5. Tenant retention strategies
6. Maintenance efficiency improvements

IMPORTANT: Format your response as clean, professional text without asterisks, hashtags, or markdown formatting. Use plain text with clear headings and bullet points. Focus on actionable insights for a property manager with practical recommendations and specific metrics.`;
  }

  /**
   * Parse GROQ AI response and extract insights
   */
  parseGROQResponse(groqResponse) {
    try {
      // Extract text from GROQ response format
      let text = '';
      
      if (groqResponse.choices && groqResponse.choices.length > 0) {
        text = groqResponse.choices[0].message?.content || '';
      } else {
        text = JSON.stringify(groqResponse);
      }

      // Clean up the text by removing asterisks, hashtags, and other markdown formatting
      const cleanedText = this.cleanAIResponseText(text);

      // Extract insights from the cleaned text
      const insights = {
        aiAnalysis: cleanedText,
        confidence: this.calculateConfidence(cleanedText),
        keyPoints: this.extractKeyPoints(cleanedText),
        recommendations: this.extractRecommendations(cleanedText)
      };

      return insights;
    } catch (error) {
      console.error('Error parsing GROQ response:', error);
      return {
        aiAnalysis: 'GROQ AI analysis unavailable',
        confidence: 0.5,
        keyPoints: [],
        recommendations: []
      };
    }
  }

  /**
   * Clean AI response text by removing markdown formatting
   */
  cleanAIResponseText(text) {
    if (!text) return '';
    
    return text
      // Remove asterisks for bold/italic
      .replace(/\*+/g, '')
      // Remove hashtags
      .replace(/#+/g, '')
      // Remove underscores for emphasis
      .replace(/_+/g, '')
      // Remove backticks for code
      .replace(/`+/g, '')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up multiple newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  /**
   * Parse AI response and extract insights (legacy method for compatibility)
   */
  parseAIResponse(aiResponse) {
    try {
      // Handle different response formats from Hugging Face
      let text = '';
      
      if (Array.isArray(aiResponse) && aiResponse.length > 0) {
        text = aiResponse[0].generated_text || aiResponse[0].text || '';
      } else if (aiResponse.generated_text) {
        text = aiResponse.generated_text;
      } else if (aiResponse.text) {
        text = aiResponse.text;
      } else {
        text = JSON.stringify(aiResponse);
      }

      // Extract insights from the text
      const insights = {
        aiAnalysis: text,
        confidence: this.calculateConfidence(text),
        keyPoints: this.extractKeyPoints(text),
        recommendations: this.extractRecommendations(text)
      };

      return insights;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        aiAnalysis: 'AI analysis unavailable',
        confidence: 0.5,
        keyPoints: [],
        recommendations: []
      };
    }
  }

  /**
   * Calculate confidence score based on response quality
   */
  calculateConfidence(text) {
    if (!text || text.length < 50) return 0.3;
    
    let confidence = 0.5;
    
    // Increase confidence based on response indicators
    if (text.includes('revenue') || text.includes('occupancy')) confidence += 0.1;
    if (text.includes('recommend') || text.includes('suggest')) confidence += 0.1;
    if (text.includes('forecast') || text.includes('predict')) confidence += 0.1;
    if (text.includes('risk') || text.includes('opportunity')) confidence += 0.1;
    
    return Math.min(confidence, 0.9);
  }

  /**
   * Extract key points from AI response
   */
  extractKeyPoints(text) {
    const points = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach(sentence => {
      if (sentence.includes('revenue') || sentence.includes('occupancy') || 
          sentence.includes('tenant') || sentence.includes('maintenance')) {
        points.push(sentence.trim());
      }
    });
    
    return points.slice(0, 5); // Return top 5 key points
  }

  /**
   * Extract recommendations from AI response
   */
  extractRecommendations(text) {
    const recommendations = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach(sentence => {
      if (sentence.toLowerCase().includes('recommend') || 
          sentence.toLowerCase().includes('suggest') ||
          sentence.toLowerCase().includes('should') ||
          sentence.toLowerCase().includes('consider')) {
        recommendations.push({
          action: sentence.trim(),
          priority: 'medium',
          category: 'ai_recommendation'
        });
      }
    });
    
    return recommendations.slice(0, 3); // Return top 3 recommendations
  }

  /**
   * Merge AI insights with local forecast
   */
  mergeAIWithLocalForecast(aiInsights, localForecast) {
    return {
      ...localForecast,
      aiEnhanced: true,
      aiInsights: aiInsights,
      insights: [
        ...(localForecast.insights || []),
        {
          type: 'ai_enhanced',
          category: 'ai_analysis',
          message: `AI Analysis: ${aiInsights.aiAnalysis.substring(0, 200)}...`,
          impact: 'high',
          confidence: aiInsights.confidence
        }
      ],
      recommendations: [
        ...(localForecast.recommendations || []),
        ...(aiInsights.recommendations || [])
      ]
    };
  }

  /**
   * Emergency fallback - always returns a valid forecast
   */
  generateEmergencyFallback(dashboardData, months = 12) {
    console.log('🚨 Using emergency fallback forecast');
    
    const { financialMetrics, occupancyMetrics } = dashboardData;
    const currentRevenue = financialMetrics?.averageMonthlyRevenue || 0;
    const occupancyRate = occupancyMetrics?.occupancyRate || 0;
    
    // Simple but reliable calculations
    const monthlyForecast = [];
    for (let i = 1; i <= Math.min(months, 6); i++) {
      const forecastDate = new Date();
      forecastDate.setMonth(forecastDate.getMonth() + i);
      
      monthlyForecast.push({
        month: forecastDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: Math.round(currentRevenue * (1 + (i * 0.02))), // 2% growth per month
        occupancy: Math.min(100, Math.round(occupancyRate * (1 + (i * 0.01)))), // 1% improvement
        cumulativeRevenue: Math.round(currentRevenue * i * (1 + (i * 0.01)))
      });
    }
    
    const annualRevenue = monthlyForecast.reduce((sum, month) => sum + month.revenue, 0);
    
    return {
      annual: {
        projectedRevenue: annualRevenue,
        netIncome: Math.round(annualRevenue * 0.7),
        profitMargin: 70.0,
        growthRate: 5.0
      },
      monthly: monthlyForecast,
      confidence: 0.75,
      aiEnhanced: false,
      aiInsights: {
        aiAnalysis: "Basic financial forecast generated using reliable local algorithms. System is operating in fallback mode.",
        confidence: 0.75,
        keyPoints: [
          "Using emergency fallback algorithms",
          "Basic revenue projections available",
          "System remains functional"
        ],
        recommendations: [
          {
            action: "Check system configuration",
            priority: "medium",
            category: "system"
          }
        ]
      }
    };
  }

  /**
   * Test GROQ API connection
   */
  async testGROQConnection() {
    // First validate API key
    const keyValidation = this.validateGROQAPIKey();
    if (!keyValidation.valid) {
      return {
        success: false,
        error: keyValidation.error
      };
    }

    try {
      console.log('🧪 Testing GROQ API connection...');
      
      const apiKey = this.getGROQAPIKey();
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant.'
            },
            {
              role: 'user',
              content: 'Test connection for Dorminder property management system. Respond with "Connection successful".'
            }
          ],
          temperature: 0.7,
          max_tokens: 50,
          top_p: 1,
          stream: false
        })
      });

      if (response.ok) {
        const result = await response.json();
        return {
          success: true,
          message: 'GROQ API connection successful',
          model: 'llama-3.3-70b-versatile',
          response: result
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          error: `GROQ API error: ${response.status} ${response.statusText} - ${errorText}`
        };
      }
    } catch (error) {
      console.error('❌ GROQ API test failed:', error);
      return {
        success: false,
        error: `GROQ API test failed: ${error.message}`
      };
    }
  }

}

export const aiAnalyticsService = new AIAnalyticsService();
export default aiAnalyticsService;

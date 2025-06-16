import type { Task } from "./task" // Assuming Task is imported from another file

interface BusinessModel {
  id: string
  name: string
  type: string
  incomeModel: string
  status: "Not Started" | "In Progress" | "Systemized"
  description: string
  tasks: Task[]
}

interface SmartTask {
  task: string
  reason: string
  priority: "High" | "Medium" | "Low"
  impact: string
  businessModel: string
}

export function generateSmartTasks(
  businessModels: BusinessModel[],
  userGoals: any[],
  currentIncome: number,
): SmartTask[] {
  const tasks: SmartTask[] = []

  businessModels.forEach((model) => {
    if (model.status === "Not Started") {
      tasks.push(...getStartupTasks(model))
    } else if (model.status === "In Progress") {
      tasks.push(...getGrowthTasks(model, currentIncome))
    } else if (model.status === "Systemized") {
      tasks.push(...getOptimizationTasks(model))
    }
  })

  // Add goal-specific tasks
  userGoals.forEach((goal) => {
    if (goal.category === "Income") {
      const monthsLeft = Math.max(
        1,
        Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)),
      )
      const monthlyTarget = (goal.targetAmount - goal.currentAmount) / monthsLeft

      tasks.push(...getIncomeGoalTasks(monthlyTarget, businessModels))
    }
  })

  return tasks.slice(0, 8) // Return top 8 tasks
}

function getStartupTasks(model: BusinessModel): SmartTask[] {
  const tasks: SmartTask[] = []

  switch (model.type) {
    case "SaaS/Software":
      tasks.push(
        {
          task: "Build MVP with core features",
          reason: `Essential foundation for ${model.name}`,
          priority: "High",
          impact: "Product development",
          businessModel: model.name,
        },
        {
          task: "Interview 10 potential customers",
          reason: "Validate product-market fit",
          priority: "High",
          impact: "Market validation",
          businessModel: model.name,
        },
        {
          task: "Set up analytics and user tracking",
          reason: "Measure user behavior and retention",
          priority: "Medium",
          impact: "Data foundation",
          businessModel: model.name,
        },
      )
      break

    case "E-commerce/Physical Products":
      tasks.push(
        {
          task: "Research and source 3 winning products",
          reason: "Product selection determines success",
          priority: "High",
          impact: "Product foundation",
          businessModel: model.name,
        },
        {
          task: "Set up Shopify store with professional design",
          reason: "Professional storefront builds trust",
          priority: "High",
          impact: "Brand credibility",
          businessModel: model.name,
        },
        {
          task: "Create compelling product photography",
          reason: "Visual appeal drives conversions",
          priority: "Medium",
          impact: "Conversion optimization",
          businessModel: model.name,
        },
      )
      break

    case "High-Ticket Consulting":
      tasks.push(
        {
          task: "Define signature methodology and framework",
          reason: "Unique approach justifies premium pricing",
          priority: "High",
          impact: "Value proposition",
          businessModel: model.name,
        },
        {
          task: "Create case studies from past results",
          reason: "Social proof for high-ticket sales",
          priority: "High",
          impact: "Credibility building",
          businessModel: model.name,
        },
        {
          task: "Build premium landing page with testimonials",
          reason: "Professional presence for $5K+ services",
          priority: "Medium",
          impact: "Lead conversion",
          businessModel: model.name,
        },
      )
      break

    case "Content Creation/Influencer":
      tasks.push(
        {
          task: "Define content niche and target audience",
          reason: "Focused content builds engaged audience",
          priority: "High",
          impact: "Audience building",
          businessModel: model.name,
        },
        {
          task: "Create content calendar for 30 days",
          reason: "Consistency is key to growth",
          priority: "High",
          impact: "Growth strategy",
          businessModel: model.name,
        },
        {
          task: "Set up professional filming/recording setup",
          reason: "Quality content stands out",
          priority: "Medium",
          impact: "Content quality",
          businessModel: model.name,
        },
      )
      break

    case "Real Estate Investment":
      tasks.push(
        {
          task: "Get pre-approved for investment loan",
          reason: "Know your buying power",
          priority: "High",
          impact: "Deal readiness",
          businessModel: model.name,
        },
        {
          task: "Analyze 10 potential investment properties",
          reason: "Find deals with best ROI",
          priority: "High",
          impact: "Deal sourcing",
          businessModel: model.name,
        },
        {
          task: "Build network of contractors and property managers",
          reason: "Essential team for scaling",
          priority: "Medium",
          impact: "Team building",
          businessModel: model.name,
        },
      )
      break

    case "Digital Agency":
      tasks.push(
        {
          task: "Choose agency specialization (PPC, SEO, Social, etc.)",
          reason: "Specialists charge more than generalists",
          priority: "High",
          impact: "Positioning",
          businessModel: model.name,
        },
        {
          task: "Create service packages with clear pricing",
          reason: "Structured offerings scale better",
          priority: "High",
          impact: "Service delivery",
          businessModel: model.name,
        },
        {
          task: "Build portfolio with 3 case studies",
          reason: "Proof of results wins clients",
          priority: "Medium",
          impact: "Credibility",
          businessModel: model.name,
        },
      )
      break

    default:
      tasks.push({
        task: "Define business model and target market",
        reason: "Clear focus drives better results",
        priority: "High",
        impact: "Strategic foundation",
        businessModel: model.name,
      })
  }

  return tasks
}

function getGrowthTasks(model: BusinessModel, currentIncome: number): SmartTask[] {
  const tasks: SmartTask[] = []

  switch (model.type) {
    case "SaaS/Software":
      if (currentIncome < 10000) {
        tasks.push(
          {
            task: "Launch beta and get first 100 users",
            reason: "User feedback drives product development",
            priority: "High",
            impact: "User acquisition",
            businessModel: model.name,
          },
          {
            task: "Implement user onboarding flow",
            reason: "Reduce churn and increase activation",
            priority: "High",
            impact: "Retention optimization",
            businessModel: model.name,
          },
        )
      } else {
        tasks.push(
          {
            task: "Optimize conversion funnel and reduce churn",
            reason: "Improve unit economics for scaling",
            priority: "High",
            impact: "Revenue optimization",
            businessModel: model.name,
          },
          {
            task: "Launch enterprise sales outreach",
            reason: "Higher ACV accelerates growth",
            priority: "High",
            impact: "Revenue acceleration",
            businessModel: model.name,
          },
        )
      }
      break

    case "E-commerce/Physical Products":
      tasks.push(
        {
          task: "Scale winning products with increased ad spend",
          reason: "Double down on what's working",
          priority: "High",
          impact: "Revenue scaling",
          businessModel: model.name,
        },
        {
          task: "Test 3 new product variations",
          reason: "Expand successful product lines",
          priority: "Medium",
          impact: "Product expansion",
          businessModel: model.name,
        },
        {
          task: "Optimize product pages for higher conversion",
          reason: "Small improvements compound at scale",
          priority: "Medium",
          impact: "Conversion optimization",
          businessModel: model.name,
        },
      )
      break

    case "High-Ticket Consulting":
      tasks.push(
        {
          task: "Conduct 5 high-value discovery calls",
          reason: "Direct path to $5K+ deals",
          priority: "High",
          impact: "Revenue generation",
          businessModel: model.name,
        },
        {
          task: "Create thought leadership content",
          reason: "Authority content attracts premium clients",
          priority: "Medium",
          impact: "Brand positioning",
          businessModel: model.name,
        },
        {
          task: "Ask existing clients for referrals",
          reason: "Referrals have highest close rate",
          priority: "High",
          impact: "Lead generation",
          businessModel: model.name,
        },
      )
      break

    case "Content Creation/Influencer":
      tasks.push(
        {
          task: "Post 3 pieces of content daily",
          reason: "Consistency builds audience",
          priority: "High",
          impact: "Audience growth",
          businessModel: model.name,
        },
        {
          task: "Reach out to 10 brands for partnerships",
          reason: "Monetize your audience",
          priority: "High",
          impact: "Revenue generation",
          businessModel: model.name,
        },
        {
          task: "Analyze top performing content and create more",
          reason: "Double down on what works",
          priority: "Medium",
          impact: "Growth optimization",
          businessModel: model.name,
        },
      )
      break

    case "Real Estate Investment":
      tasks.push(
        {
          task: "Make offers on 3 investment properties",
          reason: "Volume of offers leads to deals",
          priority: "High",
          impact: "Deal acquisition",
          businessModel: model.name,
        },
        {
          task: "Refinance existing properties for better rates",
          reason: "Improve cash flow and equity",
          priority: "Medium",
          impact: "Portfolio optimization",
          businessModel: model.name,
        },
        {
          task: "Network with wholesalers and agents",
          reason: "Access to off-market deals",
          priority: "Medium",
          impact: "Deal flow",
          businessModel: model.name,
        },
      )
      break

    case "Digital Agency":
      tasks.push(
        {
          task: "Pitch 10 potential clients this week",
          reason: "Sales activity drives revenue",
          priority: "High",
          impact: "Client acquisition",
          businessModel: model.name,
        },
        {
          task: "Deliver exceptional results for current clients",
          reason: "Results lead to referrals and retention",
          priority: "High",
          impact: "Client satisfaction",
          businessModel: model.name,
        },
        {
          task: "Create case study from best client result",
          reason: "Social proof for future sales",
          priority: "Medium",
          impact: "Marketing asset",
          businessModel: model.name,
        },
      )
      break
  }

  return tasks
}

function getOptimizationTasks(model: BusinessModel): SmartTask[] {
  const tasks: SmartTask[] = []

  switch (model.type) {
    case "SaaS/Software":
      tasks.push(
        {
          task: "Analyze churn data and implement retention features",
          reason: "Reduce churn to maximize LTV",
          priority: "High",
          impact: "Revenue retention",
          businessModel: model.name,
        },
        {
          task: "Launch enterprise tier with premium features",
          reason: "Increase average revenue per user",
          priority: "Medium",
          impact: "Revenue expansion",
          businessModel: model.name,
        },
      )
      break

    case "E-commerce/Physical Products":
      tasks.push(
        {
          task: "Implement email marketing automation",
          reason: "Increase customer lifetime value",
          priority: "Medium",
          impact: "Revenue optimization",
          businessModel: model.name,
        },
        {
          task: "Negotiate better supplier terms",
          reason: "Improve profit margins",
          priority: "Medium",
          impact: "Profitability",
          businessModel: model.name,
        },
      )
      break

    default:
      tasks.push({
        task: "Analyze metrics and optimize key bottlenecks",
        reason: "Systematic optimization drives growth",
        priority: "Medium",
        impact: "Performance optimization",
        businessModel: model.name,
      })
  }

  return tasks
}

function getIncomeGoalTasks(monthlyTarget: number, businessModels: BusinessModel[]): SmartTask[] {
  const tasks: SmartTask[] = []

  if (monthlyTarget > 50000) {
    tasks.push({
      task: "Focus on enterprise deals and strategic partnerships",
      reason: `Need $${monthlyTarget.toLocaleString()}/month - requires big moves`,
      priority: "High",
      impact: "High-value revenue",
      businessModel: "Income Goal",
    })
  } else if (monthlyTarget > 20000) {
    tasks.push({
      task: "Scale proven systems and hire team members",
      reason: `$${monthlyTarget.toLocaleString()}/month requires leverage`,
      priority: "High",
      impact: "Scalable growth",
      businessModel: "Income Goal",
    })
  } else if (monthlyTarget > 5000) {
    tasks.push({
      task: "Increase prices and focus on premium clients",
      reason: `$${monthlyTarget.toLocaleString()}/month needs higher-value work`,
      priority: "High",
      impact: "Revenue per client",
      businessModel: "Income Goal",
    })
  }

  return tasks
}

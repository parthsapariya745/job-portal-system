const mongoose = require("mongoose");
require("dotenv").config();

const SupportCategory = require("./models/SupportCategory");
const SupportOrganization = require("./models/SupportOrganization");
const SupportService = require("./models/SupportService");
const connectDB = require("./config/db");

// Real Government and NGO data
const categories = [
  {
    name: "Agriculture Work",
    description: "Farm work, crop cultivation, livestock management, and agricultural labor opportunities",
    icon: "🌾",
  },
  {
    name: "Daily Wage Jobs",
    description: "Daily labor work including loading, unloading, cleaning, and manual labor",
    icon: "💪",
  },
  {
    name: "Construction Work",
    description: "Building construction, masonry, carpentry, plumbing, and electrical work",
    icon: "🏗️",
  },
  {
    name: "Housekeeping Work",
    description: "Domestic help, cleaning services, cooking, and household assistance",
    icon: "🏠",
  },
  {
    name: "Government Welfare Work",
    description: "MNREGA, rural employment programs, and government-sponsored work schemes",
    icon: "🏛️",
  },
  {
    name: "Orphan Employment Support",
    description: "Special employment programs and skill training for orphans and abandoned children",
    icon: "👶",
  },
  {
    name: "Senior Citizen Support",
    description: "Employment and assistance programs for elderly citizens above 60 years",
    icon: "👴",
  },
  {
    name: "Mental Health Rehabilitation",
    description: "Support services, therapy, and rehabilitation programs for mental health recovery",
    icon: "🧠",
  },
  {
    name: "NGO Skill Programs",
    description: "Free skill training, vocational courses, and employment assistance by NGOs",
    icon: "🎓",
  },
  {
    name: "Women Empowerment",
    description: "Self-help groups, vocational training, and employment programs for women",
    icon: "👩",
  },
  {
    name: "Disability Support",
    description: "Employment and rehabilitation programs for persons with disabilities",
    icon: "♿",
  },
  {
    name: "Rural Development",
    description: "Rural infrastructure work, community development, and village improvement projects",
    icon: "🌄",
  },
];

const organizations = [
  // Government Organizations
  {
    name: "Ministry of Rural Development",
    description: "Government of India ministry responsible for rural development, including MNREGA, rural housing, and livelihood programs",
    governmentLevel: "Central",
    website: "https://rural.nic.in",
    email: "secy.rural@nic.in",
    helpline: "011-23061470",
    address: "Krishi Bhavan, New Delhi - 110001",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "Ministry of Women and Child Development",
    description: "Government ministry for welfare of women and children, including skill development and employment programs",
    governmentLevel: "Central",
    website: "https://wcd.nic.in",
    email: "min-wcd@gov.in",
    helpline: "011-23381619",
    address: "Shastri Bhavan, New Delhi - 110001",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "Ministry of Social Justice and Empowerment",
    description: "Government ministry for social justice, empowerment of marginalized groups and senior citizens",
    governmentLevel: "Central",
    website: "https://socialjustice.gov.in",
    email: "secy-sj@gov.in",
    helpline: "011-23386192",
    address: "Shastri Bhavan, New Delhi - 110001",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "National Rural Livelihood Mission (NRLM)",
    description: "Aajeevika - Job creation and skill development program for rural poor through Self Help Groups",
    governmentLevel: "Central",
    website: "https://aajeevika.gov.in",
    email: "secy-nrlm@nic.in",
    helpline: "011-23070300",
    address: "7th Floor, Jeevan Prakash Building, New Delhi",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "National Institute of Mental Health and Neurosciences (NIMHANS)",
    description: "Premier mental health and neuroscience institute offering rehabilitation and support services",
    governmentLevel: "Central",
    website: "https://nimhans.ac.in",
    email: "nimhans@nimhans.ac.in",
    helpline: "080-26995000",
    address: "Hosur Road, Bangalore - 560029",
    location: "Bangalore",
    isVerified: true,
  },
  {
    name: "Department of Agriculture and Farmers Welfare",
    description: "Government department for agricultural development and farmer welfare programs",
    governmentLevel: "Central",
    website: "https://agricoop.nic.in",
    email: "secy-agri@nic.in",
    helpline: "011-23384128",
    address: "Krishi Bhavan, New Delhi - 110001",
    location: "New Delhi",
    isVerified: true,
  },
  // NGO Organizations
  {
    name: "Childline India Foundation",
    description: "24/7 emergency helpline and support service for children in need of care and protection",
    governmentLevel: "NGO",
    website: "https://www.childlineindia.org",
    email: "dial1098@childlineindia.org",
    helpline: "1098",
    address: "Various locations across India",
    location: "All India",
    isVerified: true,
  },
  {
    name: "HelpAge India",
    description: "NGO working for elderly care, healthcare, and livelihood support for senior citizens",
    governmentLevel: "NGO",
    website: "https://www.helpageindia.org",
    email: "info@helpage.org",
    helpline: "011-41688955",
    address: "C-14, Qutab Institutional Area, New Delhi",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "CARE India",
    description: "Humanitarian NGO working on poverty alleviation, women's empowerment, and education",
    governmentLevel: "NGO",
    website: "https://www.careindia.org",
    email: "info@careindia.org",
    helpline: "011-49281000",
    address: "9th Floor, Tower 1, One IndiaBulls Centre, Mumbai",
    location: "Mumbai",
    isVerified: true,
  },
  {
    name: "Pratham Education Foundation",
    description: "NGO focused on quality education and vocational training for underprivileged children and youth",
    governmentLevel: "NGO",
    website: "https://www.pratham.org",
    email: "info@pratham.org",
    helpline: "022-61654700",
    address: "Yashwant Building, Dadar, Mumbai",
    location: "Mumbai",
    isVerified: true,
  },
  {
    name: "Smile Foundation",
    description: "Development organization working on education, healthcare, and livelihood for marginalized communities",
    governmentLevel: "NGO",
    website: "https://www.smilefoundationindia.org",
    email: "info@smilefoundationindia.org",
    helpline: "011-43111100",
    address: "161 B/4, 3rd Floor, Gulmohar House, New Delhi",
    location: "New Delhi",
    isVerified: true,
  },
  {
    name: "Goonj",
    description: "NGO working on rural development, disaster relief, and dignity for marginalized communities",
    governmentLevel: "NGO",
    website: "https://goonj.org",
    email: "mail@goonj.org",
    helpline: "011-41401216",
    address: "J-93, Sarita Vihar, New Delhi - 110076",
    location: "New Delhi",
    isVerified: true,
  },
];

const seedSupportData = async () => {
  try {
    await connectDB();
    console.log("Connected to database...");

    // Clear existing data
    console.log("Clearing existing support data...");
    await SupportCategory.deleteMany();
    await SupportOrganization.deleteMany();
    await SupportService.deleteMany();
    console.log("Existing data cleared.");

    // Insert categories
    console.log("Seeding categories...");
    const createdCategories = await SupportCategory.insertMany(categories);
    console.log(`${createdCategories.length} categories created.`);

    // Insert organizations
    console.log("Seeding organizations...");
    const createdOrganizations = await SupportOrganization.insertMany(organizations);
    console.log(`${createdOrganizations.length} organizations created.`);

    // Create sample services
    console.log("Creating sample services...");
    const sampleServices = [
      {
        title: "MNREGA Rural Employment Program",
        categoryId: createdCategories[4]._id, // Government Welfare Work
        organizationId: createdOrganizations[0]._id, // Ministry of Rural Development
        serviceType: "Employment Program",
        location: "Rural Areas Nationwide",
        requirements: "Must be 18+ years, rural resident, willing to do manual labor",
        description: "100 days of guaranteed wage employment in rural areas. Work includes road construction, water conservation, irrigation, and rural infrastructure development.",
      },
      {
        title: "Skill India Training Program",
        categoryId: createdCategories[8]._id, // NGO Skill Programs
        organizationId: createdOrganizations[8]._id, // Pratham
        serviceType: "Skill Training",
        location: "Multiple Centers Nationwide",
        requirements: "Age 18-35, basic literacy preferred",
        description: "Free vocational training in plumbing, electrical work, tailoring, and other skills. Includes job placement assistance after training completion.",
      },
      {
        title: "Senior Citizen Healthcare & Employment",
        categoryId: createdCategories[6]._id, // Senior Citizen Support
        organizationId: createdOrganizations[6]._id, // HelpAge India
        serviceType: "Healthcare & Support",
        location: "Major Cities",
        requirements: "Age 60+ years",
        description: "Healthcare support, pension assistance, and light employment opportunities suitable for senior citizens including counseling and advisory roles.",
      },
      {
        title: "Mental Health Rehabilitation Center",
        categoryId: createdCategories[7]._id, // Mental Health Rehabilitation
        organizationId: createdOrganizations[4]._id, // NIMHANS
        serviceType: "Healthcare",
        location: "Bangalore & Outreach Programs",
        requirements: "Referred by medical professional or family",
        description: "Comprehensive mental health rehabilitation including therapy, counseling, medication support, and vocational training for recovery and reintegration.",
      },
      {
        title: "Orphan Care & Skill Development",
        categoryId: createdCategories[5]._id, // Orphan Employment Support
        organizationId: createdOrganizations[5]._id, // Childline
        serviceType: "Care & Education",
        location: "All India",
        requirements: "Ages 6-18 for care, 18+ for employment programs",
        description: "Educational support, vocational training, and employment assistance for orphans and children without parental care. Includes hostel facilities.",
      },
      {
        title: "Women Self-Help Group Program",
        categoryId: createdCategories[9]._id, // Women Empowerment
        organizationId: createdOrganizations[1]._id, // Ministry of Women and Child Development
        serviceType: "Empowerment Program",
        location: "Rural Areas Nationwide",
        requirements: "Women above 18 years, rural residents",
        description: "Formation of Self-Help Groups (SHGs), microfinance support, skill training, and marketing assistance for women entrepreneurs.",
      },
      {
        title: "Agricultural Labor Opportunities",
        categoryId: createdCategories[0]._id, // Agriculture Work
        organizationId: createdOrganizations[5]._id, // Department of Agriculture
        serviceType: "Employment",
        location: "Agricultural Regions",
        requirements: "Willingness to work in farms, physical fitness",
        description: "Seasonal and year-round agricultural employment opportunities including sowing, harvesting, crop management, and livestock care.",
      },
      {
        title: "Construction Worker Registration",
        categoryId: createdCategories[2]._id, // Construction Work
        organizationId: createdOrganizations[10]._id, // CARE India
        serviceType: "Registration & Support",
        location: "Urban Areas",
        requirements: "Age 18-55, physically fit",
        description: "Registration with Building and Other Construction Workers Welfare Board. Includes safety training, insurance coverage, and wage protection.",
      },
      {
        title: "Housekeeping & Domestic Work Training",
        categoryId: createdCategories[3]._id, // Housekeeping Work
        organizationId: createdOrganizations[9]._id, // Smile Foundation
        serviceType: "Training & Placement",
        location: "Metro Cities",
        requirements: "Age 18-50, basic communication skills",
        description: "Professional training in housekeeping, cooking, childcare, and elderly care. Includes placement assistance in households and institutions.",
      },
      {
        title: "Disability Employment Support",
        categoryId: createdCategories[10]._id, // Disability Support
        organizationId: createdOrganizations[2]._id, // Ministry of Social Justice
        serviceType: "Employment Support",
        location: "All India",
        requirements: "Persons with disabilities (PWDs)",
        description: "Job reservation assistance, skill training suitable for different disabilities, workplace accommodation support, and entrepreneurship guidance.",
      },
    ];

    const createdServices = await SupportService.insertMany(sampleServices);
    console.log(`${createdServices.length} services created.`);

    console.log("\n✅ Support data seeding completed successfully!");
    console.log("\nSeeded Data Summary:");
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Organizations: ${createdOrganizations.length}`);
    console.log(`- Services: ${createdServices.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding support data:", error);
    process.exit(1);
  }
};

// Run the seed function
seedSupportData();

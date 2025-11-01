import dotenv from 'dotenv';
import { initializeDatabase } from '../models/database';
import { ResourceModel } from '../models/resource';

dotenv.config();

const sampleResources = [
  // Electronics
  {
    name: "MacBook Pro 16-inch",
    description: "High-performance laptop with M2 Pro chip, 32GB RAM, and 1TB SSD. Perfect for development, design, and creative work.",
    category: "electronics",
    status: "active" as const
  },
  {
    name: "iPhone 15 Pro",
    description: "Latest smartphone with advanced camera system, titanium design, and A17 Pro chip for professional photography and daily use.",
    category: "electronics",
    status: "active" as const
  },
  {
    name: "Dell UltraSharp 4K Monitor",
    description: "27-inch 4K USB-C monitor with excellent color accuracy for professional design work and productivity.",
    category: "electronics",
    status: "active" as const
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Premium wireless noise-cancelling headphones with industry-leading sound quality and 30-hour battery life.",
    category: "electronics",
    status: "active" as const
  },
  {
    name: "iPad Pro 12.9",
    description: "Powerful tablet with M2 chip and Apple Pencil support for digital art, note-taking, and productivity tasks.",
    category: "electronics",
    status: "inactive" as const
  },
  {
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with precision tracking, customizable buttons, and ergonomic design for professionals.",
    category: "electronics",
    status: "active" as const
  },

  // Furniture
  {
    name: "Herman Miller Aeron Chair",
    description: "Ergonomic office chair with advanced lumbar support, breathable mesh, and adjustable features for all-day comfort.",
    category: "furniture",
    status: "active" as const
  },
  {
    name: "Standing Desk Converter",
    description: "Height-adjustable desk converter that transforms any workspace into a healthy sit-stand workstation.",
    category: "furniture",
    status: "active" as const
  },
  {
    name: "IKEA BEKANT Desk",
    description: "Modern office desk with clean lines, cable management, and spacious work surface for productive workspaces.",
    category: "furniture",
    status: "active" as const
  },
  {
    name: "Steelcase Think Chair",
    description: "Sustainable office chair with intuitive design, responsive back support, and environmentally conscious materials.",
    category: "furniture",
    status: "inactive" as const
  },
  {
    name: "Flexispot E7 Standing Desk",
    description: "Electric height-adjustable desk with memory presets, anti-collision technology, and sturdy steel frame.",
    category: "furniture",
    status: "active" as const
  },

  // Software
  {
    name: "Figma Pro Subscription",
    description: "Professional design tool subscription for UI/UX design, prototyping, and collaborative design workflows.",
    category: "software",
    status: "active" as const
  },
  {
    name: "Adobe Creative Cloud",
    description: "Complete creative suite including Photoshop, Illustrator, InDesign, and video editing tools for professional content creation.",
    category: "software",
    status: "active" as const
  },
  {
    name: "JetBrains IntelliJ IDEA",
    description: "Powerful integrated development environment for Java, Kotlin, and other JVM languages with advanced code assistance.",
    category: "software",
    status: "active" as const
  },
  {
    name: "Notion Team Plan",
    description: "All-in-one workspace for notes, documentation, project management, and team collaboration with advanced features.",
    category: "software",
    status: "active" as const
  },
  {
    name: "Slack Professional",
    description: "Team communication platform with unlimited message history, file sharing, and integration capabilities.",
    category: "software",
    status: "inactive" as const
  },

  // Office Supplies
  {
    name: "Moleskine Notebook Set",
    description: "Premium hardcover notebooks with dotted pages, elastic closure, and ribbon bookmark for professional note-taking.",
    category: "office-supplies",
    status: "active" as const
  },
  {
    name: "Pilot G2 Pen Pack",
    description: "Smooth gel ink pens with comfortable grip and reliable performance for everyday writing tasks.",
    category: "office-supplies",
    status: "active" as const
  },
  {
    name: "3M Post-it Note Collection",
    description: "Assorted sticky notes in various sizes and colors for organization, reminders, and brainstorming sessions.",
    category: "office-supplies",
    status: "active" as const
  },
  {
    name: "Stapler and Hole Punch Set",
    description: "Professional office tools for document organization and binding with durable construction and smooth operation.",
    category: "office-supplies",
    status: "active" as const
  },

  // Books & Learning
  {
    name: "Clean Code by Robert Martin",
    description: "Essential programming book covering best practices for writing maintainable, readable, and professional code.",
    category: "books",
    status: "active" as const
  },
  {
    name: "The Design of Everyday Things",
    description: "Fundamental design book exploring user-centered design principles and human-computer interaction concepts.",
    category: "books",
    status: "active" as const
  },
  {
    name: "JavaScript: The Good Parts",
    description: "Concise guide to JavaScript's most useful features and best practices for modern web development.",
    category: "books",
    status: "inactive" as const
  },
  {
    name: "Pluralsight Annual Subscription",
    description: "Comprehensive online learning platform with courses on technology, software development, and IT skills.",
    category: "learning",
    status: "active" as const
  },

  // Networking & Connectivity
  {
    name: "Ubiquiti UniFi Access Point",
    description: "Enterprise-grade wireless access point with high-performance Wi-Fi 6 and centralized management capabilities.",
    category: "networking",
    status: "active" as const
  },
  {
    name: "Ethernet Cable Bundle",
    description: "Cat 6A ethernet cables in various lengths for reliable wired network connections and high-speed data transfer.",
    category: "networking",
    status: "active" as const
  },
  {
    name: "USB-C Hub with HDMI",
    description: "Multi-port hub with USB-A, USB-C, HDMI, and SD card slots for expanding laptop connectivity options.",
    category: "accessories",
    status: "active" as const
  },

  // Storage & Organization
  {
    name: "Synology NAS DS220+",
    description: "Network-attached storage device for file sharing, backup, and media streaming with robust data protection.",
    category: "storage",
    status: "active" as const
  },
  {
    name: "Cable Management Tray",
    description: "Under-desk cable organizer for keeping workspace clean and organized with easy access to power and data cables.",
    category: "accessories",
    status: "active" as const
  },
  {
    name: "Desktop File Organizer",
    description: "Multi-compartment organizer for documents, supplies, and accessories to maintain an efficient workspace.",
    category: "office-supplies",
    status: "active" as const
  },

  // Health & Ergonomics
  {
    name: "Blue Light Blocking Glasses",
    description: "Computer glasses with blue light filtering technology to reduce eye strain during long screen sessions.",
    category: "health",
    status: "active" as const
  },
  {
    name: "Ergonomic Keyboard and Mouse",
    description: "Wireless ergonomic set designed to reduce wrist strain and improve typing comfort during extended use.",
    category: "accessories",
    status: "inactive" as const
  }
];

async function seedDatabase(): Promise<void> {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Adding sample resources...');
    for (let i = 0; i < sampleResources.length; i++) {
      const resource = sampleResources[i];
      if (!resource) {
        console.error(`✗ Resource ${i + 1} is undefined`);
        continue;
      }
      
      try {
        const created = await ResourceModel.create(resource);
        console.log(`✓ Created resource ${i + 1}/30: ${created.name}`);
      } catch (error) {
        console.error(`✗ Failed to create resource ${i + 1}: ${resource.name}`, error);
      }
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`Added ${sampleResources.length} sample resources to the database.`);
    
    // Show summary
    const categories = [...new Set(sampleResources.map(r => r.category))];
    console.log(`\nCategories included: ${categories.join(', ')}`);
    console.log(`Active resources: ${sampleResources.filter(r => r.status === 'active').length}`);
    console.log(`Inactive resources: ${sampleResources.filter(r => r.status === 'inactive').length}`);
    
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✨ Seeding script completed. You can now start the server and view the sample data!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error during seeding:', error);
      process.exit(1);
    });
}

export { seedDatabase };
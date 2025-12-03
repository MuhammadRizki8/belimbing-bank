import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Create Prisma client with Postgres adapter using DATABASE_URL from .env
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Seed helper: clear selected tables (optional but useful during development)
async function clearData() {
  // We intentionally delete child records first to satisfy FK constraints.
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.customer.deleteMany();
  // Keep deposito types removal optional; using upsert later is safer.
}

// Ensure deposito types exist (upsert style)
async function seedDepositoTypes() {
  const types = [
    { name: 'Deposito Bronze', yearlyReturnRate: 3.0 },
    { name: 'Deposito Silver', yearlyReturnRate: 5.0 },
    { name: 'Deposito Gold', yearlyReturnRate: 7.0 },
  ];

  console.log('[Seed] Ensuring deposito types...');

  for (const t of types) {
    // `name` is not declared unique in the schema, so `upsert` with
    // `where: { name }` would fail. Use findFirst() and update/create by id.
    const existing = await prisma.depositoType.findFirst({ where: { name: t.name } });
    if (existing) {
      await prisma.depositoType.update({
        where: { id: existing.id },
        data: { yearlyReturnRate: t.yearlyReturnRate },
      });
    } else {
      await prisma.depositoType.create({ data: t });
    }
  }

  console.log('[Seed] Deposito types ready.');
}

// Create customers, accounts and transactions
async function seedCustomersAndAccounts() {
  console.log('[Seed] Seeding customers, accounts, and transactions...');

  // Preload deposito types so we can connect by id
  // Use findFirst since `name` is not unique in the Prisma schema
  const bronze = await prisma.depositoType.findFirst({ where: { name: 'Deposito Bronze' } });
  const silver = await prisma.depositoType.findFirst({ where: { name: 'Deposito Silver' } });
  const gold = await prisma.depositoType.findFirst({ where: { name: 'Deposito Gold' } });

  if (!bronze || !silver || !gold) {
    throw new Error('Missing deposito types. Run seedDepositoTypes first.');
  }

  // Example seed data
  const customers = [
    {
      name: 'Alice Johnson',
      accounts: [
        { balance: 1000.0, depositoTypeId: bronze.id, startDate: new Date('2024-01-01') },
        { balance: 5000.5, depositoTypeId: silver.id, startDate: new Date('2024-06-15') },
      ],
    },
    {
      name: 'Bob Smith',
      accounts: [{ balance: 15000.0, depositoTypeId: gold.id, startDate: new Date('2023-11-30') }],
    },
    {
      name: 'Catherine Lee',
      accounts: [{ balance: 250.0, depositoTypeId: bronze.id, startDate: new Date('2025-03-10') }],
    },
  ];

  for (const c of customers) {
    // Create customer
    const createdCustomer = await prisma.customer.create({ data: { name: c.name } });

    // Create accounts for this customer
    for (const acc of c.accounts) {
      const createdAccount = await prisma.account.create({
        data: {
          balance: acc.balance,
          startDate: acc.startDate,
          customerId: createdCustomer.id,
          depositoTypeId: acc.depositoTypeId,
        },
      });

      // Add a couple of example transactions for each account
      const transactions = [
        {
          amount: acc.balance,
          type: 'DEPOSIT',
          transactionDate: acc.startDate,
          accountId: createdAccount.id,
        },
        {
          amount: Math.round((acc.balance * 0.05 + Number.EPSILON) * 100) / 100, // sample interest amount
          type: 'DEPOSIT',
          transactionDate: new Date(acc.startDate.getTime() + 1000 * 60 * 60 * 24 * 30),
          accountId: createdAccount.id,
        },
      ];

      for (const t of transactions) {
        await prisma.transaction.create({ data: t });
      }
    }
  }

  console.log('[Seed] Customers, accounts, and transactions seeded.');
}

// Main orchestrator
async function main() {
  try {
    console.log('[Seed] Starting seeding process...');

    // Optional: clear existing child data to get a predictable seed state in dev
    // Comment out the next line in production to avoid data loss
    await clearData();

    await seedDepositoTypes();
    await seedCustomersAndAccounts();

    console.log('[Seed] Seeding finished successfully.');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder when executed directly
if (require.main === module) {
  main();
}

export default main;

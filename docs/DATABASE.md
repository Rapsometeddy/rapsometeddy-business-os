# Database Plan

Core tables:

- businesses
- profiles
- customers
- products
- sales
- sale_items
- expenses
- invoices
- invoice_items
- leads

Every business-owned record should be scoped to a business ID and protected with Supabase Row Level Security.

## Core relationships

businesses -> customers
businesses -> products
businesses -> sales
sales -> sale_items
businesses -> expenses
businesses -> invoices
invoices -> invoice_items
businesses -> leads

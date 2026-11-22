"use client";

import Badge from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { formatDate, formatNaira } from "@/lib/format";
import { GetCustomers } from "@/lib/services/customer";
import { customersProps } from "@/types/customerTypes";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<customersProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pageSize = 12;

  useEffect(() => {
    async function load() {
      try {
        const data = await GetCustomers(page, search, pageSize);
        setCustomers(data.data);
        setTotal(data.meta.total);
        setError(false);
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [page, search]);

  let content;

  if (loading) {
    content = (
      <div className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((number) => (
          <div key={number} className="flex gap-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <ErrorState
          message="We couldn't load the customers."
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  } else if (total === 0) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <EmptyState
          title="No customers found"
          message="Try a different name or email."
        />
      </div>
    );
  } else {
    content = (
      <Table
        footer={
          <Pagination
            page={page}
            limit={pageSize}
            total={total}
            onPageChange={setPage}
          />
        }
      >
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th className="text-right">Orders</Th>
            <Th className="text-right">Total spent</Th>
            <Th>Joined</Th>
            <Th>Status</Th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <Tr key={customer.id}>
              <Td className="font-medium">
                {customer.firstName} {customer.lastName}
              </Td>
              <Td className="text-ink-secondary">{customer.email}</Td>
              <Td className="text-ink-secondary">{customer.phone || "-"}</Td>
              <Td className="text-right tabular-nums">{customer.orderCount}</Td>
              <Td className="text-right tabular-nums">
                {formatNaira(customer.totalSpentMinor)}
              </Td>
              <Td className="text-ink-secondary">
                {formatDate(customer.createdAt)}
              </Td>
              <Td>
                <Badge variant={customer.isActive ? "success" : "neutral"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-90">
        <SearchInput
          placeholder="Name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {content}
    </div>
  );
}

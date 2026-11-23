"use client";

import Badge from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import Select from "@/components/ui/select";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { captilaze, getInitials } from "@/lib/format";
import { GetStaff } from "@/lib/services/staff";
import { adminUserProps } from "@/types/sidebar";
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [staff, setStaff] = useState<adminUserProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    async function load() {
      try {
        const data = await GetStaff(page, pageSize, search, role);
        setStaff(data.data);
        setTotal(data.meta.total);
        setError(false);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [page, search, role]);

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
          message="We couldn't load the staff."
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  } else if (total === 0) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <EmptyState
          title="No staff found"
          message="Try a different name, email or role."
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
            <Th>Role</Th>
            <Th>Status</Th>
          </tr>
        </thead>

        <tbody>
          {staff.map((member) => (
            <Tr key={member.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <span className="size-8 rounded-full bg-stone-100 text-ink-secondary text-xs font-semibold flex items-center justify-center">
                    {getInitials(member.firstName, member.lastName)}
                  </span>
                  <span className="font-medium">
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              </Td>
              <Td className="text-ink-secondary">{member.email}</Td>
              <Td className="text-ink-secondary">{member.phone || "—"}</Td>
              <Td>
                <Badge variant={member.role === "admin" ? "accent" : "neutral"}>
                  {captilaze(member.role)}
                </Badge>
              </Td>
              <Td>
                <Badge variant={member.isActive ? "success" : "neutral"}>
                  {member.isActive ? "Active" : "Inactive"}
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
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <SearchInput
            placeholder="Name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-48">
          <Select
            label="Role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
      </div>

      {content}
    </div>
  );
}

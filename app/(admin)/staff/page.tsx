"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import Select from "@/components/ui/select";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import { captilaze, getInitials } from "@/lib/format";
import { CreateStaff, GetStaff } from "@/lib/services/staff";
import { adminUserProps } from "@/types/sidebar";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function StaffPage() {
  const [staff, setStaff] = useState<adminUserProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newRole, setNewRole] = useState("staff");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
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
      } catch {
        setError(true);
      }
      setLoading(false);
    }
    load();
  }, [page, search, role]);

  function handleShowAdd() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNewRole("staff");
    setPassword("");
    setEmailError("");
    setFormError("");
    setShowAdd(true);
  }

  async function handleAdd() {
    setSaving(true);
    setEmailError("");
    setFormError("");

    try {
      await CreateStaff(firstName, lastName, email, phone, newRole, password);

      const data = await GetStaff(page, pageSize, search, role);
      setStaff(data.data);
      setTotal(data.meta.total);
      setShowAdd(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.code === "EMAIL_TAKEN")
          setEmailError("This email is already used");
        else setFormError(error.response.data.message);
      } else {
        setFormError("Something went wrong. Try again.");
      }
    }
    setSaving(false);
  }
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

        <Button onClick={handleShowAdd}>
          <Plus size={16} />
          Add Staff
        </Button>
      </div>

      {content}

      {showAdd ? (
        <Modal title="Add staff" onClose={() => setShowAdd(false)}>
          <div className="flex flex-col gap-3">
            {formError ? (
              <div className="bg-red-50 border border-red-200 text-danger text-sm rounded-lg px-4 py-3">
                {formError}
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />

            <Input
              label="Phone (optional)"
              placeholder="+234"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div>
              <p className="text-sm font-medium text-ink mb-1">Role</p>
              <div className="grid grid-cols-2 gap-3">
                {["staff", "admin"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setNewRole(option)}
                    className={`flex items-center gap-2 h-11 px-3 rounded-lg border text-sm cursor-pointer ${newRole === option ? "border-accent bg-accent-soft" : "border-line bg-surface"}`}
                  >
                    <span
                      className={`size-4 rounded-full border flex items-center justify-center ${newRole === option ? "border-accent" : "border-line-strong"}`}
                    >
                      {newRole === option ? (
                        <span className="size-2 rounded-full bg-accent" />
                      ) : null}
                    </span>
                    {captilaze(option)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-ink-muted mt-1">
                At least 8 characters.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button
                loading={saving}
                disabled={
                  !firstName || !lastName || !email || password.length < 8
                }
                onClick={handleAdd}
              >
                Add staff
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

"use client";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/modal";
import Pagination from "@/components/ui/pagination";
import SearchInput from "@/components/ui/search-input";
import { EmptyState, ErrorState, Skeleton } from "@/components/ui/state";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import Toggle from "@/components/ui/toggle";
import { captilaze } from "@/lib/format";
import { ChangeStock, GetStock } from "@/lib/services/stock";
import { stockProps } from "@/types/stockTypes";
import axios from "axios";
import { useEffect, useState } from "react";

export default function StockPage() {
  const [stocks, setStocks] = useState<stockProps[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [saveError, setSaveError] = useState("");

  const [lowOnly, setLowOnly] = useState(false);

  const [selected, setSelected] = useState<stockProps | null>(null);
  const [quantity, setQuantity] = useState("");
  const [mode, setMode] = useState("set");

  useEffect(() => {
    async function load() {
      try {
        const data = await GetStock(page, search, lowOnly);
        setStocks(data.data);
        setTotal(data.meta.total);
        setError(false);
      } catch {
        setError(true);
      }
      setLoading(false);
    }

    load();
  }, [page, search, lowOnly]);

  async function handleSave() {
    if (!selected) return;

    try {
      await ChangeStock(selected.variantId, mode, Number(quantity));

      const data = await GetStock(page, search, lowOnly);
      setStocks(data.data);
      setTotal(data.meta.total);
      setSelected(null);
      setError(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setSaveError(err.response.data.message);
      } else {
        setSaveError("Something went wrong");
      }
    }
  }

  const filters = (
    <div className="flex items-center justify-between gap-3">
      <div className="w-90">
        <SearchInput
          placeholder="Product name or SKU"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Toggle
        label="Low stock only"
        checked={lowOnly}
        onChange={(value) => {
          setLowOnly(value);
          setPage(1);
        }}
      />
    </div>
  );

  let content;

  if (loading) {
    content = (
      <div className="bg-surface border border-line rounded-xl p-5 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((e) => (
          <div key={e} className="flex gap-6">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
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
          message="We couldn't load the stock."
          onReentry={() => window.location.reload()}
        />
      </div>
    );
  } else if (total === 0) {
    content = (
      <div className="bg-surface border border-line rounded-xl">
        <EmptyState
          title="No Products found"
          message="Try a different search."
        />
      </div>
    );
  } else {
    content = (
      <Table
        footer={
          <Pagination
            page={page}
            limit={20}
            total={total}
            onPageChange={setPage}
          />
        }
      >
        <thead>
          <tr>
            <Th>Product</Th>
            <Th>Variant</Th>
            <Th>SKU</Th>
            <Th>Status</Th>
            <Th className="text-right">In Stock</Th>
            <Th />
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => (
            <Tr key={stock.variantId}>
              <Td className="font-medium">{stock.productName}</Td>
              <Td className="text-ink-secondary">{stock.variantName}</Td>
              <Td className="font-mono text-xs text-accent">{stock.sku}</Td>
              <Td>
                <Badge
                  variant={stock.status === "active" ? "success" : "neutral"}
                >
                  {captilaze(stock.status)}
                </Badge>
              </Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium tabular-nums">
                    {stock.stockQuantity}
                  </span>

                  {stock.stockQuantity === 0 ? (
                    <Badge variant="danger">Out of stock</Badge>
                  ) : stock.lowStock ? (
                    <Badge variant="warning">Low</Badge>
                  ) : null}
                </div>
              </Td>

              <Td>
                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelected(stock);
                      setQuantity("");
                      setSaveError("");
                    }}
                  >
                    Adjust
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {filters}
      {content}
      {selected ? (
        <Modal
          title="Adjust stock"
          subtitle={`${selected.productName} · ${selected.variantName} · ${selected.sku}`}
          onClose={() => setSelected(null)}
        >
          <div className="flex bg-canvas rounded-lg p-1 mb-4">
            <button
              onClick={() => setMode("set")}
              className={`flex-1 h-8 rounded-md text-sm cursor-pointer ${mode === "set" ? "bg-surface shadow-sm font-medium" : "text-ink-secondary"}`}
            >
              Set count
            </button>
            <button
              onClick={() => setMode("adjust")}
              className={`flex-1 h-8 rounded-md text-sm cursor-pointer ${mode === "adjust" ? "bg-surface shadow-sm font-medium" : "text-ink-secondary"}`}
            >
              Adjust
            </button>
          </div>

          <Input
            label={mode === "set" ? "New quantity" : "+ / - amount"}
            type="number"
            value={quantity}
            error={saveError}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <div className="flex justify-end gap-2 mt-5">
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
